import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import OrbitControls from 'three-orbitcontrols'
import { Canvas } from 'lib/hooks/Canvas'
import styled from '@emotion/styled';
import * as CANNON from 'cannon-es'
import * as dat from 'lil-gui'

const gui = new dat.GUI()
const guiObject = {}

const ThreeDonut = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// const textureLoader = new THREE.TextureLoader()
	const cubeTextureLoader = new THREE.CubeTextureLoader()

	const environmentMapTexture = cubeTextureLoader.load([
		'/textures/environmentMaps/0/px.png',
		'/textures/environmentMaps/0/nx.png',
		'/textures/environmentMaps/0/py.png',
		'/textures/environmentMaps/0/ny.png',
		'/textures/environmentMaps/0/pz.png',
		'/textures/environmentMaps/0/nz.png'
	])

	useEffect(() => {
		const scene = new THREE.Scene();
		const hitSound = new Audio('/sounds/hit.mp3')

		const playHitSound = (collision: any) => {
			const impactMagnitude = collision.contact.getImpactVelocityAlongNormal()
			if (impactMagnitude > 1.5) {
				hitSound.volume = Math.random()
				hitSound.currentTime = 0
				hitSound.play()
			}
		}

		const world = new CANNON.World()
		world.broadphase = new CANNON.SAPBroadphase(world)
		world.allowSleep = true
		world.gravity.set(0, - 9.82, 0)

		const defaultMaterial = new CANNON.Material('default')
		const defaultContactMaterial = new CANNON.ContactMaterial(
			defaultMaterial,
			defaultMaterial,
			{
				friction: 0.1,
				restitution: 0.7
			}
		)
		world.defaultContactMaterial = defaultContactMaterial

		const floorShape = new CANNON.Plane()
		const floorBody = new CANNON.Body()
		floorBody.mass = 0
		floorBody.addShape(floorShape)
		floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
		world.addBody(floorBody)

		const objectsToUpdate: any[] = []


		const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
		const sphereMaterial = new THREE.MeshStandardMaterial({
			metalness: 0.3,
			roughness: 0.4,
			envMap: environmentMapTexture,
			envMapIntensity: 0.9
		})


		const createSphere = () => {

			const radius = Math.random() * 0.5
			const position = [
				(Math.random() - 0.5) * 3,
				3,
				(Math.random() - 0.5) * 3
			]

			const threePosition = new THREE.Vector3(...position)
			const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
			mesh.castShadow = true
			mesh.scale.set(radius, radius, radius)
			mesh.position.copy(threePosition)
			scene.add(mesh)


			const cannonPosition = new CANNON.Vec3(...position)
			const shape = new CANNON.Sphere(radius)

			const body = new CANNON.Body({
				mass: 1,
				position: new CANNON.Vec3(0, 3, 0),
				shape: shape,
				material: defaultMaterial
			})

			body.position.copy(cannonPosition)
			body.addEventListener('collide', playHitSound)
			world.addBody(body)

			objectsToUpdate.push({ mesh, body })
		}

		const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
		const boxMaterial = new THREE.MeshStandardMaterial({
			metalness: 0.3,
			roughness: 0.4,
			envMap: environmentMapTexture,
			envMapIntensity: 0.5
		})


		const createBox = () => {

			const whd = [Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5] // width, height, depth
			const position = [Math.random() * 0.5, 3, Math.random() * 0.5]


			const threePosition = new THREE.Vector3(...position)
			const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
			mesh.scale.set(whd[0], whd[1], whd[2])
			mesh.castShadow = true
			mesh.position.copy(threePosition)
			scene.add(mesh)

			const cannonPosition = new CANNON.Vec3(...position)
			const shape = new CANNON.Box(new CANNON.Vec3(whd[0] * 0.5, whd[1] * 0.5, whd[2] * 0.5))

			const body = new CANNON.Body({
				mass: 1,
				position: new CANNON.Vec3(0, 3, 0),
				shape: shape,
				material: defaultMaterial
			})
			body.position.copy(cannonPosition)
			body.addEventListener('collide', playHitSound)
			world.addBody(body)

			objectsToUpdate.push({ mesh, body })
		}

		const reset = () => {
			for (const object of objectsToUpdate) {
				object.body.removeEventListener('collide', playHitSound)
				world.removeBody(object.body)

				scene.remove(object.mesh)
			}

			objectsToUpdate.splice(0, objectsToUpdate.length)
		}


		createBox()
		createSphere()
		createBox()
		createSphere()
		createBox()
		createSphere()


		const guiObject = {
			createSphere: () => createSphere(),
			createBox: () => createBox(),
			reset: () => reset()
		}

		gui.add(guiObject, 'createSphere')
		gui.add(guiObject, 'createBox')
		gui.add(guiObject, 'reset')

		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 10),
			new THREE.MeshStandardMaterial({
				color: '#777777',
				metalness: 0.3,
				roughness: 0.4,
				envMap: environmentMapTexture,
				envMapIntensity: 0.5
			})
		)
		floor.receiveShadow = true
		floor.rotation.x = - Math.PI * 0.5
		scene.add(floor)

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
		directionalLight.castShadow = true
		directionalLight.shadow.mapSize.set(1024, 1024)
		directionalLight.shadow.camera.far = 15
		directionalLight.shadow.camera.left = - 7
		directionalLight.shadow.camera.top = 7
		directionalLight.shadow.camera.right = 7
		directionalLight.shadow.camera.bottom = - 7
		directionalLight.position.set(5, 5, 5)
		scene.add(directionalLight)

		scene.rotation.set(0, -Math.PI * 3.2, 0)
		scene.position.y = -1

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
		camera.position.set(- 3, 3, 3)

		camera.lookAt(0, 0, 0)
		scene.add(camera)


		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		const clock = new THREE.Clock()
		let oldElapsedTime = 0


		const controls = new OrbitControls(camera, renderer.domElement)

		const animate = () => {
			requestAnimationFrame(animate);
			const elapsedTime = clock.getElapsedTime()
			const deltaTime = elapsedTime - oldElapsedTime
			// const deltaTime = clock.getDelta()
			oldElapsedTime = elapsedTime

			world.step(1 / 60, deltaTime, 3) // update CANNON world

			for (const object of objectsToUpdate) {
				object.mesh.position.copy(object.body.position)
				object.mesh.quaternion.copy(object.body.quaternion)
			}

			controls.update()

			renderer.render(scene, camera);
		};

		animate();

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
