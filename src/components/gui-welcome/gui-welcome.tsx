import { Component, Element, h, Host, Listen, Prop, Watch } from '@stencil/core';
import WEBGL from 'three/examples/jsm/capabilities/WebGL';
import { ThreeDService } from '../../services/threeDService';
// import { CSG } from 'three-csg-ts';
import { CSG } from '@enable3d/three-graphics/jsm/csg';
import { ExtendedMesh, ExtendedObject3D } from 'enable3d';
import {
  BackSide,
  BoxBufferGeometry,
  BoxGeometry, DirectionalLight,
  IcosahedronGeometry,
  Mesh, MeshBasicMaterial, MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshPhysicalMaterialParameters,
  MeshStandardMaterial, RepeatWrapping,
  SphereGeometry, Vector3,
} from 'three';
import { getRandomArbitrary } from '../../utils';
import { randInt } from 'three/src/math/MathUtils';
import { SoundLibraryService } from '../../services/soundLibraryService';
import _debounce from 'lodash/debounce';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

@Component({
  tag: 'gui-welcome',
  styleUrl: 'gui-welcome.scss',
  shadow: true,
})
export class GuiWelcome {
  isWebGLAvailable = false;
  my3d: ThreeDService;
  @Prop() menuWidth!: number;
  @Element() el: HTMLElement;
  private ready: boolean;
  private clicked: boolean;
  private balls: Array<ExtendedObject3D> = [];
  private _box: ExtendedMesh;
  private noise = new SimplexNoise();
  private analyser: AnalyserNode;
  private ctx: AudioContext;
  private dataArray: Uint8Array;
  private _discoBall: Mesh;

  async componentDidLoad() {

    this.ctx = Howler.ctx;
    this.analyser = this.ctx.createAnalyser();
    Howler.masterGain.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    if (WEBGL.isWebGLAvailable()) {
      this.isWebGLAvailable = true;
      this.my3d = ThreeDService.instance();
    } else {
      const warning = WEBGL.getWebGLErrorMessage();
      console.warn(warning);
      this.isWebGLAvailable = false;
    }
    if (this.isWebGLAvailable) {
      await this.loadWorld();
    } else {
      console.log('unavailable', true);
    }
    this.resize();
  }

  async disconnectedCallback() {
    await this.my3d.clearScene();
    this._box.remove();
  }

  loadWorld = async () => {
    console.log('starting...');
    await this.my3d.init(
      {
        debug: false,
        controls: false,
        container: this.el.shadowRoot.host as HTMLElement,
        animation: (scene, _c, _t, _d) => {
          const newArray = [];

          this.analyser.getByteFrequencyData(this.dataArray);

          const lowerHalfArray = this.dataArray.slice(0, (this.dataArray.length / 2) - 1);
          const upperHalfArray = this.dataArray.slice((this.dataArray.length / 2) - 1, this.dataArray.length - 1);
          const lowerMax = this.max(lowerHalfArray);
          const upperAvg = this.avg(upperHalfArray);

          const lowerMaxFr = lowerMax / lowerHalfArray.length;
          const upperAvgFr = upperAvg / upperHalfArray.length;

          if (this._discoBall) {
            this.makeRoughBall(
              this._discoBall,
              this.modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
              this.modulate(upperAvgFr, 0, 1, 0, 4),
            );

            this._discoBall.rotation.y += 0.0005;
          }

          this._box.position.y += Math.sin(_t) * 0.01;
          this._box.position.x += Math.sin(_t) * 0.005;
          // this._box.position.z += Math.cos( _t ) * 0.008;

          this._box.rotation.x += Math.cos(_t) * 0.0004 * Math.PI;
          this._box.rotation.z += Math.cos(_t) * 0.0004 * Math.PI;

          this._box.body.needUpdate = true;

          this.balls.forEach(value => {
            if (value.position.y <= -100) {
              const { x, y, z } = value.position;
              const sounds = SoundLibraryService.instance().sounds;
              const sound = value.userData.objectType === 'sphere' ? sounds.bottlePop1 : sounds.bottlePop2;

              const id = sound.play();
              scene.remove(value);
              sound.volume(0.9, id);
              sound.pos(x / 20, y / 20, z / 20, id);
            } else {
              newArray.push(value);
            }
          });

          this.balls = newArray;
        },
      });
    this.el.shadowRoot.appendChild(this.my3d.renderer.domElement);
    await this.addBox();
    this.my3d.start();
    this.ready = true; // TODO replace by RXJS
  };

  addBox = async () => {
    const phyMatParams: MeshPhysicalMaterialParameters = {
      roughness: .6,
      transmission: .6,
      color: '#001cad',
      // @ts-ignore
      thickness: 1,
    };
    const mat = new MeshPhysicalMaterial(phyMatParams);

    const boxRes = 10;

    const meshA = new ExtendedMesh(new BoxBufferGeometry(22, 10, 22, boxRes, boxRes, boxRes));
    const meshB = new ExtendedMesh(new BoxBufferGeometry(21, 10, 21, boxRes, boxRes, boxRes));
    meshA.position.set(0, 0, 0);
    meshB.position.set(0, 1, 0);
    this._box = CSG.subtract(meshA, meshB) as ExtendedMesh;
    this._box.material = mat;
    this._box.position.y = -5;
    this._box.receiveShadow = true;
    this._box.castShadow = true;
    this._box.name = 'main-box';
    this._box.userData = {
      x: 0, y: 0, z: 0, a: 0, b: 0, c: 0,
    };

    this.my3d.scene.add(this._box);
    this.my3d.physics.add.existing(this._box as any, {
      shape: 'concave',
      breakable: false,
      collisionFlags: 2,
      mass: 0,
    });

    this._box.body.setRestitution(.8);
    this._box.body.checkCollisions = true;

    // const material = new MeshLambertMaterial({
    //   color: '#dcdcdc',
    //   wireframe: true,
    // });


    const moonTexture = await this.my3d.loadTexture('/assets/texture/moon/texture.jpg');
    const moonDisplacementMap = await this.my3d.loadTexture('/assets/texture/moon/displacement.jpg');
    const worldTexture = await this.my3d.loadTexture('/assets/images/stars.png');

    worldTexture.wrapS = RepeatWrapping;
    worldTexture.wrapT = RepeatWrapping;
    worldTexture.repeat.set(4, 4);

    const worldGeometry = new SphereGeometry(1000, 60, 60);
    const worldMaterial = new MeshBasicMaterial(
      {
        transparent: true,
        color: '#3AA8C2',
        map: worldTexture,
        side: BackSide,
      },
    );
    const world = new Mesh(worldGeometry, worldMaterial);

    const material = new MeshPhongMaterial(
      {
        color: '#ffffff',
        map: moonTexture,
        displacementMap: moonDisplacementMap,
        displacementScale: .6,
        bumpMap: moonDisplacementMap,
        bumpScale: .4,
        reflectivity: 1,
        shininess: 0,
      },
    );

    const radius = 30;

    let moon = new Mesh(new SphereGeometry(radius, 32, 32), material);
    moon.receiveShadow = true;
    moon.castShadow = true;
    moon.scale.multiplyScalar(.9);

    const geometry = new IcosahedronGeometry(radius, 5);
    this._discoBall = new Mesh(geometry, new MeshPhysicalMaterial({
      color: '#5bd4ff',
      metalness: 1,
      roughness: .3,
      envMapIntensity: 0.9,
      clearcoat: 1,
      transparent: true,
      // transmission: .1,
      opacity: .8,
      reflectivity: 1,
      ior: 0.9,
      // side: BackSide,
    }));
    this._discoBall.receiveShadow = true;
    this._discoBall.castShadow = true;

    this._discoBall.add(moon);
    // this._discoBall.rotation.x = -Math.PI / 4;
    // this._discoBall.position.z = -30;

    this._discoBall.position.set(-100, -30, -100);

    const light = new DirectionalLight(0xFFFFFF, 1);

    light.position.set(0, 1, .5);


    this.my3d.scene.add(this._discoBall, light, world);

  };

  async startBalls() {
    await SoundLibraryService.instance().preload(['bump1', 'bump2', 'ioBump', 'groundBump', 'bottlePop1', 'bottlePop2']);
    if (this.clicked === true || !this.ready) {
      return;
    }
    this.clicked = true;

    const { bump1, bump2, groundBump: bump4, ioBump: bump5 } = SoundLibraryService.instance().sounds;


    // const materialsParam: Array<MeshStandardMaterialParameters> = loadFruitPalette()
    // const colors = ['pink', '#009158', '#fffc05', '#ff716c', '#9b21a4', '#4e3b7b'];

    const colors = [
      '#1cbdec', '#63ff6e', '#f9fb21',
      '#ff9c59', '#f46b86', '#009158',
      '#fffc05', '#ff716c', '#9b21a4',
      '#4e3b7b',
    ];
    let j = 0, k = 0;
    let radius = 0;
    const width = 2,
      widthSegments = 64,
      height = 2.5,
      heightSegments = 64;
    let numbers = {
      s: 0,
      r: 0,
    };


    for (let i = 0; i < 100; i++) {
      // const selectedMat = materialsParam[randomIntFromInterval(0, 9)]
      const objectType = randInt(0, 1) ? 'sphere' : 'bar';

      if (objectType === 'sphere') {
        radius = getRandomArbitrary(25, 35) / 10;
        numbers.s++;
      } else {
        numbers.r++;
      }

      const x = getRandomArbitrary(-5, 5),
        y = 40 + getRandomArbitrary(0, 500),
        z = getRandomArbitrary(-5, 5),
        color = colors[randInt(0, 9)],
        depth = getRandomArbitrary(25, 40) / 4;

      const ball = objectType === 'sphere' ? this.my3d.physics.add.sphere({
          x,
          y,
          z,
          radius,
          breakable: false,
          mass: 10,
          name: `o-${j++}`,
          heightSegments,
          widthSegments,
        }, {
          phong: {
            color,
            side: BackSide,
            opacity: .7,
            transparent: true,
            reflectivity: 100,
            shininess: 200,
          },
        }) :
        this.my3d.physics.add.box({
          x,
          y,
          z,
          width,
          height,
          name: `i-${k++}`,
          depth,
          breakable: false,
          heightSegments,
          widthSegments,
          mass: 10,
        }, {
          phong: {
            color,
            side: BackSide,
            opacity: .7,
            transparent: true,
            reflectivity: 100,
            shininess: 200,
          },
        });


      ball.receiveShadow = true;
      ball.castShadow = true;
      ball.body.checkCollisions = true;
      ball.body.setBounciness(0.25);
      ball.body.setRestitution(.25);
      ball.body.isSoftBody = false;

      let outlineMesh1: Mesh;
      let outlineMaterial1 = new MeshStandardMaterial({
        color: colors.filter(c => c !== color)[randInt(0, 8)],
      });
      // outlineMaterial1.map.anisotropy = 16;

      if (objectType === 'sphere') {
        outlineMesh1 = new Mesh(new SphereGeometry(radius), outlineMaterial1);
      } else {
        outlineMesh1 = new Mesh(new BoxGeometry(width, height, depth, widthSegments, heightSegments, heightSegments), outlineMaterial1);
      }

      outlineMesh1.position.set(0, 0, 0);
      outlineMesh1.scale.multiplyScalar(.9);
      ball.add(outlineMesh1);
      ball.userData = {
        objectType,
      };
      this.balls.push(ball);

    }

    this.my3d.physics.collisionEvents.on('collision', data => {
      const { bodies } = data;

      let b1: ExtendedObject3D = bodies[0];
      let b2: ExtendedObject3D = bodies[1];


      if (b2.name === 'main-box' || b1.name === 'main-box') {
        let otherBod: ExtendedObject3D;
        let og: ExtendedObject3D;
        if (b2.name === 'main-box') {
          otherBod = b1;
          og = b2;
        } else {
          otherBod = b2;
          og = b1;
        }


        og.body.impact.forEach(async imp => {
          const { x, y, z } = imp.normal;
          const impulse = Math.floor(imp.impulse);
          const velocity = Math.floor(otherBod.body.ammo.getLinearVelocity().length());
          if (impulse >= 6 && velocity > 3) {
            if ((imp.normal.y || 0) > .98) {
              const id = bump4.play();
              bump4.volume(.05, id);
              bump4.pos(x / 2, y / 2, z / 2, id);
            }

            if ((imp.normal.x || 0) > .98) {
              bump2.play();
              const id = bump2.play();
              bump2.volume(0.02, id);
              bump2.pos(x / 2, y / 2, z / 2, id);
            }
            if ((imp.normal.z || 0) > .98) {
              bump1.play();
              const id = bump1.play();
              bump1.volume(0.02, id);
              bump1.pos(x / 2, y / 2, z / 2, id);
            }


          }
        });


      } else {
        b1.body.impact.forEach(async imp => {
          const impulse = Math.floor(imp.impulse);
          const velocity = Math.floor(b1.body.ammo.getLinearVelocity().length());

          if (impulse >= 6 && velocity > 4) {
            const { x, y, z } = imp.normal;
            const id = bump5.play();
            bump5.volume(.01, id);
            bump5.pos(x / 2, y / 2, z / 2, id);
          }

        });
      }

    });
  }

  @Listen('drop.balls', { target: 'document', capture: true })
  start() {
    this.startBalls();
  }

  @Listen('resize', { target: 'window', capture: true })
  onWindowResize() {
    this.resize();
  }

  resize = _debounce(() => {
    this.my3d.onWindowsResize();
  }, 200);

  @Watch('menuWidth')
  validateName(_newValue: string, _oldValue: string) {
    this.resize();
  }

  avg(arr) {
    var total = arr.reduce(function(sum, b) {
      return sum + b;
    });
    return (total / arr.length);
  }

  makeRoughBall(mesh: Mesh, bassFr, treFr) {
    const geometry: IcosahedronGeometry = mesh.geometry as IcosahedronGeometry;
    const offset = geometry.parameters.radius;
    const rf = 0.00001;
    const amp = 30;

    const count: number = geometry.attributes.position.count;

    for (let i = 0; i < count; i++) {
      const vertex = new Vector3();
      vertex.fromBufferAttribute(geometry.attributes.position, i);
      vertex.normalize();
      const time = window.performance.now();
      const distance = (offset + bassFr) + this.noise.noise3d(vertex.x + time * rf * 7, vertex.y + time * rf * 9, vertex.z + time * rf * 10) * amp * treFr;
      vertex.multiplyScalar(distance);

      geometry.attributes.position.setX(i, vertex.x);
      geometry.attributes.position.setY(i, vertex.y);
      geometry.attributes.position.setZ(i, vertex.z);

    }


    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;


    // mesh.geometry.computeFaceNormals();
  }

  fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
  }

  modulate(val, minVal, maxVal, outMin, outMax) {
    const fr = this.fractionate(val, minVal, maxVal);
    const delta = outMax - outMin;
    return outMin + (fr * delta);
  }

  max(arr) {
    return arr.reduce(function(a, b) {
      return Math.max(a, b);
    });
  }

  render() {
    return (
      <Host style={{ width: `calc(100vw - ${this.menuWidth}px)` }}></Host>
    );
  }

}
