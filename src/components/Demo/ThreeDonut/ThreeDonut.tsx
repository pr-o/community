import { useRef, useEffect } from "react";
import { Canvas } from 'lib/hooks/Canvas'
import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'lil-gui'
import { interval } from 'rxjs';
import styled from '@emotion/styled';

const randomHexColor = () => {
	const n = (Math.random() * 0xfffff * 1000000).toString(16);
	return '#' + n.slice(0, 6);
};

const ThreeDonut = () => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	let parameters = {
		wireframe: true,
		color: '#008080',
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

		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});
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


		const observable = interval(500);
		const subscription = observable.subscribe(() => {
			parameters.color = randomHexColor();
			material.color.set(parameters.color);
		});

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
			.onChange(() => {
				material.color.set(parameters.color);
				subscription.unsubscribe();
			});


		const animate = () => {
			requestAnimationFrame(animate);
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.01;
			mesh.rotation.z += 0.005;
			controls.update()

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			canvasRef.current?.removeChild(renderer.domElement);
			subscription.unsubscribe();
		}
	}, []);

	return (
		<Wrapper>
			<Canvas ref={canvasRef} />
		</Wrapper>
	)
};

export default ThreeDonut;

const Wrapper = styled.div`
	position: relative;
	flex-direction: column;
	display: flex;
	width: 100%;
	min-height: 100vh;
	align-items: center;
	justify-content: center;
	z-index: 9;
	background-color: #525252;
`
