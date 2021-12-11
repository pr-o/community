import { useRef, useEffect } from "react";
import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols'
import * as dat from "dat.gui";

const ThreeDonut = () => {
  const canvasRef = useRef(null);

  const parameters = {
    wireframe: true,
    color: 0x008080,
    radius: 10,
    tube: 3,
    radialSegments: 20,
    tubularSegments: 20,
    arc: Math.PI * 2,
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(
      parameters.radius,
      parameters.tube,
      parameters.radialSegments,
      parameters.tubularSegments,
      parameters.arc
    );

    const material = new THREE.MeshBasicMaterial({
      color: parameters.color,
      wireframe: parameters.wireframe,
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    camera.position.z = 30;
		const controls = new OrbitControls(camera, renderer.domElement)

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      mesh.rotation.z += 0.005;
			controls.update()

      renderer.render(scene, camera);
    };

    animate();

    const regenGeometry = () => {
      let newGeometry = new THREE.TorusGeometry(
        parameters.radius,
        parameters.tube,
        parameters.radialSegments,
        parameters.tubularSegments,
        parameters.arc
      );
      mesh.geometry.dispose();
      mesh.geometry = newGeometry;
    };

    const gui = new dat.GUI();

    gui.add(material, "wireframe").name("wireframe");

		gui.add(camera.position, "z", -30, 90, 0.1).name("camera depth");

		gui
      .add(parameters, "radius", 1, 30, 0.5)
      .name("radius")
      .onChange(regenGeometry);

		gui.add(parameters, "tube", 1, 20, 1).name("tube").onChange(regenGeometry);

		gui
      .add(parameters, "radialSegments", 1, 100, 1)
      .name("radial seg.")
      .onChange(regenGeometry);

		gui
      .add(parameters, "tubularSegments", 1, 100, 1)
      .name("tubular seg.")
      .onChange(regenGeometry);

		gui
      .add(parameters, "arc", Math.PI * 1, Math.PI * 10, Math.PI * 0.1)
      .name("arc")
      .onChange(regenGeometry);

		gui
      .addColor(parameters, "color")
      .onChange(() => material.color.set(parameters.color));

    return () => canvasRef.current?.removeChild(renderer.domElement);
  }, []);

  return <div ref={canvasRef} />;
};

export default ThreeDonut;
