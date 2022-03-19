import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import OrbitControls from 'three-orbitcontrols'
import { Canvas } from 'lib/hooks/Canvas'
import styled from '@emotion/styled';

const ThreeDonut = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const loader = new GLTFLoader();
	const group = new THREE.Group();

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
	loader.setDRACOLoader(dracoLoader);

	const wander = (lowerLim: number, upperLim: number, value: number, adder: number) => {
		if ((value + adder) > upperLim) return adder * -1
		if ((value - adder) < lowerLim) return adder
		return adder
	}

	useEffect(() => {
		const scene = new THREE.Scene();

		loader.load('/glb/room.glb', (gltf) => onLoad(gltf))

		const onLoad = (gltf: GLTF) => {

			let c: { [key: string]: THREE.Mesh } = {}
			gltf.scene.children.map((child: any) => Object.assign(c, { [child.name]: child }))

			// Sudo
			let sudoMesh = new THREE.Mesh(c.Sudo.geometry, c.Sudo.material)
			sudoMesh.position.set(0.683, 0.33, -0.67)
			sudoMesh.rotation.set(Math.PI / 2, 0, 0.29)
			group.add(sudoMesh)

			// Camera on tripod
			c.Camera001.position.set(-0.58, 0.83, -0.03)
			c.Camera001.rotation.set(Math.PI / 2, 0, 0.47)
			group.add(c.Camera001)

			// Sudo Head
			let sudoHeadMesh = new THREE.Mesh(c.SudoHead.geometry, c.SudoHead.material)
			sudoHeadMesh.position.set(0.68, 0.33, -0.67)
			sudoHeadMesh.rotation.set(Math.PI / 2, 0, 0.29)
			group.add(sudoHeadMesh)
			console.log('sudoHeadMesh', sudoHeadMesh)

			// Floor
			let floorMesh = new THREE.Mesh(c.Level.geometry, c.Level.material)
			floorMesh.position.set(-0.38, 0.69, 0.62)
			floorMesh.rotation.set(Math.PI / 2, -Math.PI / 9, 0)
			group.add(floorMesh)

			// Pyramid
			let pyramidMesh = new THREE.Mesh(c.Pyramid.geometry, c.Pyramid.material)
			pyramidMesh.position.set(-0.8, 1.33, 0.25)
			pyramidMesh.rotation.set(Math.PI / 2, -Math.PI / 9, 0)
			group.add(pyramidMesh)

			// React
			let reactMesh = new THREE.Mesh(c.React.geometry, c.React.material)
			reactMesh.position.set(-0.79, 1.3, 0.62)
			reactMesh.rotation.set(0.8, 1.1, -0.4)
			group.add(reactMesh)

			// Cactus
			let cactusMesh = new THREE.Mesh(c.Cactus.geometry, c.Cactus.material)
			cactusMesh.position.set(-0.42, 0.51, -0.62)
			cactusMesh.rotation.set(Math.PI / 2, 0, 0)
			group.add(cactusMesh)

			scene.add(group)

			scene.rotation.set(0, -Math.PI * 3.2, 0)
			scene.position.y = -1

			const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, innerHeight / - 2, 1, 1000);
			camera.zoom = 200;
			camera.position.set(-0.5, 5, -5)
			camera.updateProjectionMatrix();
			camera.lookAt(0, 0, 0)

			const renderer = new THREE.WebGLRenderer({
				canvas: canvasRef.current as HTMLCanvasElement,
				alpha: true,
			});
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

			const controls = new OrbitControls(camera, renderer.domElement)

			const animate = () => {
				requestAnimationFrame(animate);

				const yAdder = (Math.random() - .5) * 0.025
				const zAdder = (Math.random() - .5) * 0.025

				sudoHeadMesh.rotation.y += wander(-.5, .5, sudoHeadMesh.rotation.y, yAdder)
				sudoHeadMesh.rotation.z += wander(-.5, .5, sudoHeadMesh.rotation.y, zAdder)

				const pyAdder = (Math.random() - .5) * 0.001

				pyramidMesh.rotation.x += 0.02
				pyramidMesh.position.y += pyAdder

				reactMesh.rotation.x += 0.02
				reactMesh.rotation.y += 0.04
				reactMesh.rotation.z += 0.06

				controls.update()

				renderer.render(scene, camera);
			};

			animate();
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
	z-index: 9998;
	background-color: #000;
`
