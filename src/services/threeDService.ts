import {
  AmbientLight, AnimationClip, AnimationMixer,
  Box3,
  Box3Helper, Cache, Clock,
  Color,
  HemisphereLight, LoopOnce, Mesh, MeshLambertMaterial, Object3D,
  PerspectiveCamera, PlaneGeometry,
  ReinhardToneMapping,
  Scene, SpotLight, SpotLightHelper, TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getRandomArbitrary, getRandomInt } from '../utils';
import { AmmoPhysics } from '@enable3d/ammo-physics';
import { ExtendedMesh, PhysicsLoader } from 'enable3d';
import { BehaviorSubject, first } from 'rxjs';
import * as Plugins from '@enable3d/three-graphics/jsm/plugins';
import { AnimationActionLoopStyles } from 'three/src/constants';
import { EventListener } from 'three/src/core/EventDispatcher';

export type CameraConfig = {
  position: [x: number, y: number, z: number],
  lookAt: Vector3 | [x: number, y: number, z: number]
}

export const INITIAL_CAMERA_PROSITION: [x: number, y: number, z: number] = [20, 30, 45];
export type InitConfig = Partial<{
  lights: boolean | {
    hemispheric: boolean;
    spot: boolean;
    ambiant: boolean;
  };
  smoke: boolean;
  camera: 'perspective' | 'isometric',
  controls: boolean;
  debug: boolean;
  physics: boolean;
  cache: boolean;
  animation: (scene: Scene, clock: Clock, time: number, delta: number) => void;
  container: HTMLElement;
}>;


type AnimationConfig = { loop?: AnimationActionLoopStyles; repetitions?: number; onFinished?: any; onLoop?: EventListener<any, any, any> }
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  loop: LoopOnce, repetitions: 1, onFinished: () => {
  }, onLoop: () => {
  },
} as const;

export class ThreeDService {
  private static _instance: ThreeDService;
  private gltfLoader?: GLTFLoader;
  private _perspectiveCamera?: PerspectiveCamera;
  private _renderer?: WebGLRenderer;
  private _scene?: Scene;
  private width: number = document.body.offsetWidth;
  private height: number = document.body.offsetHeight;
  private running: boolean = true;
  private _hemisphereLight?: HemisphereLight;
  private _spotLight?: SpotLight;
  private _ambiantLight?: AmbientLight;
  private _smokeParticles: Mesh<PlaneGeometry, MeshLambertMaterial>[] = [];
  private _physics?: AmmoPhysics;
  private _clock = new Clock();
  private _delta = 1000;
  private _debug: boolean | undefined = false;
  private _container: HTMLElement = document.body;
  private _cleaning = new BehaviorSubject(false);
  private _isCleaning = false;
  private _mixers = new Plugins.Mixers();
  private _isWindowVisible: boolean = true;
  public animation?: (scene: Scene, clock: Clock, time: number, delta: number) => void;
  private _controls?: OrbitControls;
  private textureLoader?: TextureLoader;

  private _animationsObjects: ExtendedMesh[] = [];

  private constructor() {
    this._cleaning.subscribe((value) => {
      this._isCleaning = value;
    });
    document.addEventListener('visibilitychange', () => {
      this._isWindowVisible = document.visibilityState === 'visible';
    });
  }

  public static instance(): ThreeDService {
    if (!ThreeDService._instance) {
      ThreeDService._instance = new ThreeDService();
    }
    return ThreeDService._instance;
  }

  public init = async (config: InitConfig = {}) => {

    return new Promise((resolve, _reject) => {
      this._cleaning.pipe(
        first(value => !value),
      ).subscribe(() => {
        PhysicsLoader('/assets/vendors/ammo', async () => {
          await this._init(config);
          resolve(this._scene);
        });
      });

    });

  };

  public animateObject(mesh: ExtendedMesh, animationClip: AnimationClip, config = DEFAULT_ANIMATION_CONFIG) {
    const _config = { ...DEFAULT_ANIMATION_CONFIG, ...config };

    mesh.userData.mixer = new AnimationMixer(mesh);
    const animationAction = mesh.userData.mixer.clipAction(animationClip);
    (mesh.userData.mixer as AnimationMixer).addEventListener('finished', _config.onFinished);

    animationAction.setLoop(
      _config.loop,
      _config.repetitions,
    );
    animationAction.clampWhenFinished = true;
    animationAction.play();
    this._animationsObjects.push(mesh);
  }

  removeObject3D(object3D: Mesh | Object3D) {
    if (!(object3D instanceof Mesh)) return false;

    while (object3D.children.length > 0) {
      this.removeObject3D(object3D.children[0]);
      object3D.remove(object3D.children[0]);
    }

    // for better memory management and performance
    if (object3D.geometry) object3D.geometry.dispose();

    if (object3D.material) {
      if (object3D.material instanceof Array) {
        // for better memory management and performance
        object3D.material.forEach(material => material.dispose());
      } else {
        // for better memory management and performance
        object3D.material.dispose();
      }
    }
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
  }

  // TODO flesh out for more use case
  private _init = async (config: InitConfig = {}) => {
    const { lights, smoke, controls, physics, camera, debug, cache, container, animation } = config;
    this.animation = animation;

    Cache.enabled = typeof cache === typeof undefined || cache === true;

    if (container) {
      this._container = container;
    }

    await this.addScene();


    this._debug = typeof debug === typeof undefined ? false : debug;

    if (typeof camera === typeof undefined || camera === 'perspective') {
      this.addPerspectiveCamera();
    }


    if (lights === true || typeof lights === typeof undefined) {
      this.addLights();
    }

    if (smoke === true || typeof smoke === typeof undefined) {
      await this.addSmoke();
    }

    if (controls === true || typeof controls === typeof undefined) {
      this.addControls();
    }

    if (physics === true || typeof physics === typeof undefined) {
      this.addPhysics();
      if (this._debug === true) {
        this._physics?.debug?.enable();
      } else {
        this._physics?.debug?.disable();
      }
    }

  };

  public get renderer() {

    if (!this._renderer) {
      this._renderer = new WebGLRenderer({ alpha: true, antialias: true });

      this._renderer.setSize(this.width, this.height);
      this._renderer.autoClear = false;
      this._renderer.toneMapping = ReinhardToneMapping;
      this._renderer.toneMappingExposure = 2.3;
      this._renderer.shadowMap.enabled = true;
      const DPR = window.devicePixelRatio;
      this.renderer.setPixelRatio(Math.min(2, DPR));
    }

    return this._renderer;
  }

  public get isRunning() {
    return this.running;
  }

  public get scene() {
    return this._scene;
  }

  public async addScene() {
    if (!this._scene) {
      this._scene = new Scene();
      this._scene.background = null;
    }

    return this._scene;
  }

  public get clock() {
    return this._clock;
  }

  // TODO
  public async clearScene() {
    // this._scene.remove.apply(this._scene, this._scene.children);
    this._renderer?.setAnimationLoop(null);

    // reset clock
    this._clock.start();
    this.animation = undefined;
    this._cleaning.next(true);
    await this._clearScene();
    this._cleaning.next(false);

  }

  private async _clearScene() {
    if (this._physics?.rigidBodies)
      for (let i = this._physics.rigidBodies.length - 1; i >= 0; i--) {
        this._physics.destroy(this._physics.rigidBodies[i]);
      }

    // destroy all three objects
    if (this._scene) {
      for (let i = this._scene.children.length - 1; i >= 0; i--) {
        this._scene.remove(this._scene.children[i]);
      }
    }
  }

  public loadTexture(path: string) {
    if (!this.textureLoader) {
      this.textureLoader = new TextureLoader();
    }
    return this.textureLoader.loadAsync(path);
  }

  public loadAssets(path: string, onProgres: (event: ProgressEvent) => void = (_e) => null) {

    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
    }

    return new Promise(async (resolve, reject) => {

      try {
        if (this.gltfLoader) {
          const gltf = await this.gltfLoader.loadAsync(path, onProgres);

          gltf.scene.children.forEach(object => {
            object.traverse((n: any) => {
              if (n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
              }
            });
          });
          let helper: Box3Helper | undefined = undefined;


          if (this._debug === true) {
            let bbox = new Box3().setFromObject(gltf.scene || gltf.scenes[0]);
            helper = new Box3Helper(bbox, new Color(0, 255, 0));
            let size = bbox.getSize(new Vector3());
            console.log(size);
          }
          resolve({ gltf, helper });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  public addPerspectiveCamera(config: Partial<CameraConfig> = {}) {

    let { position, lookAt } = config;

    if (!position) {
      position = INITIAL_CAMERA_PROSITION;
    }
    if (!lookAt) {
      lookAt = [0, 0, 0];
    }

    if (!this._perspectiveCamera) {
      this._perspectiveCamera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);

      this._perspectiveCamera.position.set(...position);

      if (Array.isArray(lookAt)) {
        this._perspectiveCamera.lookAt(...lookAt);
      } else {
        this._perspectiveCamera.lookAt(lookAt);

        this._scene?.add(this._perspectiveCamera);
      }
    }
  }

  public get perspectiveCamera() {
    return this._perspectiveCamera;
  }

  public get lights() {
    return {
      hemispheric: this._hemisphereLight,
      spot: this._spotLight,
      ambiant: this._ambiantLight,
    };
  }

  // TODO replace/toggle
  public addLights() {

    if (!this._hemisphereLight) {
      this._hemisphereLight = new HemisphereLight('#ffeeb1', '#000000', .5);
      this._scene?.add(this._hemisphereLight);
    }
    if (!this._ambiantLight) {
      this._ambiantLight = new AmbientLight('#3AA8C2', .6);
      this._scene?.add(this._ambiantLight);
    }
    if (!this._spotLight) {
      this._spotLight = new SpotLight('#3a01dc', 30);
      this._spotLight.distance = 50;
      this._spotLight.castShadow = true;
      this._spotLight.shadow.bias = -0.001;
      this._spotLight.shadow.mapSize.width = 40;
      this._spotLight.shadow.mapSize.height = 40;
      this._spotLight.position.set(5, 40, -5);
      this._spotLight.angle = Math.PI / 12;


      const sp2 = this._spotLight.clone();

      sp2.position.set(-10, 40, -5);
      sp2.color.set(new Color('#ff263f'));
      sp2.intensity = 45;

      sp2.shadow.bias = -0.01;

      this._scene?.add(this._spotLight, sp2);

      if (this._debug === true) {
        const spotLightHelper = new SpotLightHelper(this._spotLight);
        this._scene?.add(spotLightHelper);
      }
    }


  }

  // TODO remove/toggle smoke
  public async addSmoke() {
    if (this._smokeParticles.length === 0) {
      const l = new TextureLoader();
      const smokeTexture = await l.loadAsync('/assets/texture/smoke2.png');
      const smokeTexture2 = await l.loadAsync('./assets/texture/smoke.png');
      const smokeGeometry = new PlaneGeometry(45, 45);
      for (let i = 0; i < 120; i++) {
        const smokeMaterial = new MeshLambertMaterial({
          map: getRandomInt(0, 1) ? smokeTexture : smokeTexture2,
          opacity: 0.7,
          transparent: true,
        });
        const smoke_element = new Mesh(smokeGeometry, smokeMaterial);
        smoke_element.scale.set(2, 2, 2);
        smoke_element.position.set(getRandomArbitrary(-60, 60), getRandomArbitrary(-45, -50), getRandomArbitrary(-50, 40));

        const axis = new Vector3(0, 0, 1);
        if (this._perspectiveCamera) smoke_element.quaternion.setFromUnitVectors(axis, this._perspectiveCamera.position.clone().normalize());
        smoke_element.rotation.z = Math.random() * 360;
        this._smokeParticles.push(smoke_element);
        this._scene?.add(smoke_element);
      }
    }
  }

  public addPhysics() {
    if (!this._scene) return;
    if (!this._physics) {
      this._physics = new AmmoPhysics(this._scene);
    }
  }

  public get physics() {
    return this._physics;
  }

  addControls() {
    // orbit controls
    if (!this._controls && this.perspectiveCamera) {
      this._controls = new OrbitControls(this.perspectiveCamera, this.renderer.domElement);
      this._controls.minDistance = 10;
      this._controls.maxDistance = 60;
      this._controls.maxPolarAngle = Math.PI / 2.1;
      this._controls.maxAzimuthAngle = Math.PI / 3;
      this._controls.minAzimuthAngle = -Math.PI / 3;

      this._controls.update();

      this._controls.addEventListener('change', () => {

        if (this.perspectiveCamera) {
          for (const smokeParticle of this._smokeParticles) {
            const axis = new Vector3(0, 0, 1);
            smokeParticle.quaternion.setFromUnitVectors(axis, this.perspectiveCamera.position.clone().normalize());
          }
        }
      });
    }
  }

  public play() {
    this.running = true;
  }

  public pause() {
    this.running = false;
  }

  onWindowsResize() {
    this.width = this._container.offsetWidth;
    this.height = this._container.offsetHeight;
    if (this._perspectiveCamera) {
      this._perspectiveCamera.aspect = this.width / this.height;
      this._perspectiveCamera.updateProjectionMatrix();
    }

    this._renderer?.setSize(this.width, this.height);
  }

  public start() {
    this.renderer.setAnimationLoop(this._animate);
  }


  private _animate = () => {
    if (this._isCleaning || !this.running || !this._isWindowVisible || !document.hasFocus()) {
      return; //TODO add config: power-saving, auto-pause...
    }
    const delta = this._clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (!!this._perspectiveCamera && !!this.lights.spot) {
      // this.lights.spot.position.set(
      //   this._perspectiveCamera.position.x + 10,
      //   this._perspectiveCamera.position.y + 10,
      //   this._perspectiveCamera.position.z + 10,
      // );
    }

    if (this._scene && this.animation) this.animation(this._scene, this._clock, parseFloat(time.toFixed(3)), parseInt(delta.toString()));

    this._animationsObjects.forEach(mesh => {

      if (mesh.userData.mixer) {
        mesh.body.needUpdate = true;
        mesh.userData.mixer.update(this._clock.getDelta());
      }
    });

    if (this._physics) {


      for (let smokeParticle of this._smokeParticles) {
        smokeParticle.rotation.z += (delta * 0.2);
      }

      this.physics?.update(delta * this._delta);

      this.physics?.updateDebugger();

      this._mixers.mixers.update(delta);

      // you have to clear and call render twice because there are 2 scenes
      // one 3d scene and one 2d scene
      this._renderer?.clear();
      if (this._scene && this._renderer && this._perspectiveCamera) this._renderer.render(this._scene, this._perspectiveCamera);
      //     renderer.clearDepth()
      //     renderer.render(scene2d, camera2d)
    }

    // requestAnimationFrame(this._animate);

  };

}

/**
 * ref: https://refactoring.guru/design-patterns/singleton/typescript/example
 */
