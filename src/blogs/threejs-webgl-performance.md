# Optimizing Three.js Performance for Production

Learn essential techniques to optimize your Three.js applications for smooth 60fps performance on all devices.

## The Performance Challenge

Three.js makes 3D graphics accessible, but achieving smooth performance requires understanding how to optimize your scene, geometry, materials, and render loop.

## Key Optimization Strategies

### 1. Geometry Optimization

Reduce polygon count where possible:

```javascript
// Instead of high-poly sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);

// Use appropriate detail level
const geometry = new THREE.SphereGeometry(1, 32, 32);
```

### 2. Texture Compression

Use compressed texture formats and appropriate sizes:

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/texture.jpg');

// Set appropriate filtering
texture.minFilter = THREE.LinearMipMapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// Generate mipmaps
texture.generateMipmaps = true;
```

### 3. Instancing for Repeated Objects

Use `InstancedMesh` for rendering multiple copies:

```javascript
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 1000);

// Set individual instances
const dummy = new THREE.Object3D();
for (let i = 0; i < 1000; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
```

### 4. Frustum Culling

Let Three.js automatically skip rendering objects outside the camera view:

```javascript
mesh.frustumCulled = true; // Enabled by default
```

## Performance Monitoring

Always measure before optimizing:

```javascript
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // Your render loop
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}
```

## Conclusion

Optimizing Three.js applications is about finding the right balance between visual quality and performance. Start with these fundamentals, measure everything, and optimize based on real-world data.

---

**Metadata:**
```json
{
  "title": "Optimizing Three.js Performance for Production",
  "description": "Master essential techniques to optimize Three.js applications for smooth 60fps performance across all devices.",
  "author": "Jeffrey Nicholson Carré",
  "date": "2024-11-12",
  "category": "Web Development",
  "tags": ["Three.js", "WebGL", "Performance", "3D Graphics"],
  "image": "/assets/images/blog/threejs-performance.jpg",
  "readTime": 5
}
```
