<script>
  import { onMount } from "svelte";
  import * as THREE from "three";

  // Variables for animation control
  let canvas;
  let animationId;

  // Mouse position tracking
  let mouseX = 0;
  let mouseY = 0;

  onMount(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create central planet
    const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: 0x3498db,
      specular: 0x555555,
      shininess: 30,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Add planet rings
    const ringGeometry = new THREE.RingGeometry(2, 2.8, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xf1c40f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Create smaller planets
    const createSmallPlanet = (color, size) => {
      const geometry = new THREE.SphereGeometry(size, 24, 24);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    };

    const smallPlanet1 = createSmallPlanet(0x9b59b6, 0.4);
    smallPlanet1.position.set(3, 0.8, -2);
    scene.add(smallPlanet1);

    const smallPlanet2 = createSmallPlanet(0xe74c3c, 0.5);
    smallPlanet2.position.set(-3, -0.8, -1);
    scene.add(smallPlanet2);

    // Create nebula cloud
    const nebulaGeometry = new THREE.SphereGeometry(4, 32, 32);
    const nebulaMaterial = new THREE.MeshPhongMaterial({
      color: 0x2980b9,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 8;

    // Mouse move event listener
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate central planet
      planet.rotation.y += 0.003;

      // Rotate rings
      ring.rotation.z += 0.002;

      // Rotate small planets
      smallPlanet1.rotation.y += 0.006;
      smallPlanet2.rotation.y += 0.008;

      // Nebula animation
      nebula.rotation.x += 0.0008;
      nebula.rotation.y += 0.001;

      // Move camera based on mouse position
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  });
</script>

<div class="space-container">
  <canvas bind:this={canvas} class="space-canvas"></canvas>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .space-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.25;
    user-select: none;
  }

  .space-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
  }
</style>
