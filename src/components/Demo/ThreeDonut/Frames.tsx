import { useEffect, useState, useRef, Fragment } from 'react';
import { gsap, Power2 } from 'gsap';
import { fromEvent, of } from 'rxjs';
import { throttle, distinctUntilKeyChanged, filter, pluck } from 'rxjs/operators';

import styled from '@emotion/styled';

import {
	Clock,
	Scene,
	Camera,
	Light,
	PerspectiveCamera,
	AmbientLight,
	Renderer,
	LoadingManager,
	TextureLoader,
	WebGLRenderer,
	BoxBufferGeometry,
	PlaneBufferGeometry,
	BoxGeometry,
	DoubleSide,
	MeshBasicMaterial,
	ShaderMaterial,
	Mesh,
	Vector2, Object3D,
	Raycaster
} from 'three';
import { Canvas } from 'lib/hooks/Canvas'
import { getRatio } from 'utils/three'
// import Scrollbar from 'smooth-scrollbar';
// import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'

import OrbitControls from 'three-orbitcontrols'

import vertexShader from 'lib/glsl/vertexShader.glsl';
import trippyShader from 'lib/glsl/trippyShader.glsl';
import waveShader from 'lib/glsl/waveShader.glsl';
import revealShader from 'lib/glsl/revealShader.glsl';
import gooeyShader from 'lib/glsl/gooeyShader.glsl';

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'
const PERSPECTIVE = 800;

const clock = new Clock()

const loader = new TextureLoader()
const texture = loader.load(img);
const hoverTexture = loader.load(hoverImg)
const xLim = [-2000, 2000]

interface ScrollEvent extends Event {
	deltaY: number;
	clientX: number;
}

const Slidshow = () => {
	// const { h = 600, w = 600, d = 1, color = 0x00ff00 } = props;

	const mouse = new Vector2(0, 0);
	const sizes = new Vector2(0, 0);
	const offset = new Vector2(0, 0);
	const raycaster = new Raycaster();

	const progressWrapperRef = useRef<HTMLDivElement>(null)
	const progressRef = useRef<HTMLSpanElement>(null)
	const [progress, setProgress] = useState<number>(0)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const cameraRef = useRef<Camera | null>(null);
	const sceneRef = useRef<Scene | null>(null);
	const scrollXRef = useRef(0)
	const meshRef = useRef<Mesh | null>(null)
	const clicked = useRef<number | null>(null)

	let uniforms = {
		u_alpha: { value: 1 },
		u_map: { type: 't', value: texture },
		u_ratio: { value: new Vector2(1, 1) },
		u_hovermap: { type: 't', value: hoverTexture },
		u_hoverratio: { value: new Vector2(1, 1) },
		u_shape: { value: hoverTexture },
		u_mouse: { value: mouse },
		u_progressHover: { value: .0 },
		u_progressClick: { value: .0 },
		u_time: { value: .0 },
		u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
	}


	const createFrame = (texture: any, index: number) => {
		const geometry = new PlaneBufferGeometry(1, 1, 1, 1);
		const material = new MeshBasicMaterial({ map: texture })
		const mesh = new Mesh(geometry, material)
		mesh.scale.set(500, 500, 1);
		mesh.position.set((index) * 800, 0, -1);
		return mesh
	}

	// useEffect(() => { console.log('U', uniforms) }, [uniforms])

	const onMouseClick = () => {
		// raycaster.setFromCamera(mouse, cameraRef.current as Camera);
		const intersected = raycaster.intersectObjects((sceneRef.current as Scene).children, false);

		let frame: any = null;

		if (intersected?.length > 0) {
			frame = intersected[0].object.name !== 'mesh' ? intersected[0] : null

			if (frame) {
				const index = Number(frame.object.name)

				console.log('index', index)

				console.log('clicked 0', clicked)

				// gsap.to(frame.object.position, { y: -10000, duration: 1 })
				if (clicked.current !== index) {
					console.log('clicked 1', clicked)
					clicked.current = index


					gsap.to(uniforms.u_progressClick, { value: 1.2, duration: 1 })
					// gsap.to(uniforms.u_alpha, { value: 0, duration: 1 })


					// gsap.to(frame.object!.position, { x: 600, y: 300, duration: 1.5 })
					// meshRef.current!.position.set(100, 100, 1)
					gsap.to(meshRef.current!.position, { x: 200, duration: 1 })
				} else {
					console.log('clicked 2', clicked)
					gsap.to(uniforms.u_progressClick, { value: 0, duration: .5 })
					clicked.current = null
				}

			}
		}
	}

	useEffect(() => {
		window?.addEventListener('mousemove', (e) => { onMouseMove(e) })

		const scroll = fromEvent<ScrollEvent>(window, 'wheel').pipe(
			distinctUntilKeyChanged('deltaY'),
			pluck('deltaY'),
			filter((deltaY) => {
				scrollXRef.current += deltaY
				return scrollXRef.current > xLim[0] && scrollXRef.current < xLim[1]
			})
		)
		const subscription = scroll.subscribe((deltaY) => (cameraRef.current as Camera).position.x += deltaY)

		window?.addEventListener('click', () => { onMouseClick() })


		const createMesh = (texture: any, hoverTexture: any, texturePath: string) => {


			const geometry = new PlaneBufferGeometry(1, 1, 1, 1);
			const material = new ShaderMaterial({
				uniforms: uniforms,
				vertexShader: vertexShader,
				fragmentShader: trippyShader,
				// fragmentShader: revealShader,
				transparent: true,
				defines: {
					PI: Math.PI,
					PR: window.devicePixelRatio.toFixed(1),
					// PR: window.devicePixelRatio.toFixed(2)
				},
				side: DoubleSide
			});

			const mesh = new Mesh(geometry, material);
			mesh.scale.set(500, 500, 1);
			// mesh.position.set(0, 0, 0);
			// mesh.position.x = offset.x
			// mesh.position.y = offset.y
			mesh.position.set(offset.x, offset.y, 1)
			// mesh.castShadow = true;
			// mesh.name = 'frame'

			return mesh
		}



		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

		cameraRef.current = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
		cameraRef.current.position.set(0, 0, PERSPECTIVE);

		sceneRef.current = new Scene();

		const light = new AmbientLight(0xffffff, 2);

		const renderer = new WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});
		renderer.setClearAlpha(1)
		// const controls = new OrbitControls(camera, renderer.domElement)


		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);


		sceneRef.current.add(cameraRef.current)
		sceneRef.current.add(light);


		const m1 = createFrame(texture, 0); m1.name = '0'
		const m2 = createFrame(texture, 1); m2.name = '1'
		const m3 = createFrame(texture, 2); m3.name = '2'
		sceneRef.current.add(m1)
		sceneRef.current.add(m2)
		sceneRef.current.add(m3)

		meshRef.current = createMesh(texture, hoverTexture, img);
		sceneRef.current!.add(meshRef.current);

		let frame: any = null;

		const update = () => {
			requestAnimationFrame(update)
			gsap.to(uniforms.u_time, { value: clock.getElapsedTime(), duration: 1, ease: "power2.inout" })

			// uniforms.u_time.value = clock.getDelta()

			// controls.update()
			renderer.render(sceneRef.current as Scene, cameraRef.current as Camera)

		}

		update()

		return () => subscription.unsubscribe()
	}, [])


	const onMouseMove = (event: MouseEvent) => {

		let frame;
		gsap.to(mouse, {
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
			duration: 0.5,
		});
		raycaster.setFromCamera(mouse, cameraRef.current as Camera);
		const intersected = raycaster.intersectObjects((sceneRef.current as Scene).children, false);

		// let frame: any = null;

		if (intersected?.length > 0) {
			frame = intersected[0].object ? intersected[0] : null

			if (frame) {
				// frame.object.visible = false;
				meshRef.current!.position.set(frame.object.position.x, 0, 0)
				onMouseEnter()
			}

		} else {

			// if (frame) {
			onMouseLeave()
			// }
		}
	}

	const onMouseEnter = () => {
		gsap.to(uniforms.u_progressHover, { value: 1, duration: 1, ease: "power2.inout" })
		// gsap.to(uniforms.u_time, { value: clock.getElapsedTime(), duration: 1, ease: "power2.inout" })
		// gsap.to(uniforms.u_progressClick, { value: 1., duration: 1 })

	}

	const onMouseLeave = () => {

		gsap.to(uniforms.u_progressHover, {
			value: 0,
			duration: 1,
			ease: "power2.inout",
		})
		clicked.current = null

		gsap.to(uniforms.u_progressClick, { value: 0, duration: 0.1 })

		// gsap.to(uniforms.u_progressClick, { value: .0, duration: .5 })
	}


	return <Canvas ref={canvasRef} />
};

export default Slidshow;

