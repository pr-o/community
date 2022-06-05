import { useRef, useEffect } from "react";
import { Canvas } from 'lib/hooks/Canvas'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'lil-gui'
import { css } from '@emotion/react';
import { imagePaths } from 'components/Annotation2D/imagePaths'
import {
	Clock,
	Scene,
	Camera,
	PerspectiveCamera,
	AmbientLight,
	WebGLRenderer,
	Texture,
	TextureLoader,
	Vector2,
	PlaneBufferGeometry,
	ShaderMaterial,
	Mesh,
} from 'three';
import vertexShader from 'lib/glsl/annotationVertexShader.glsl';
import fragmentShader from 'lib/glsl/annotationFragmentShader.glsl';

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
const imagePath = imagePaths[0]

const Annotation2D = () => {

	const imgRef = useRef<HTMLImageElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);


	const init = (texture: Texture) => {

		/*
			Scene
		**/
		const scene = new Scene()

		/*
			Light
		**/
		const light = new AmbientLight(0xffffff, 2);

		/*
			Camera
		**/
		const PERSPECTIVE = 800;
		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;
		const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.set(0, 0, PERSPECTIVE);

		/*
			Renderer
		**/
		const renderer = new WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});

		renderer.setClearAlpha(1)
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio)

		scene.add(camera)
		scene.add(light);

		const clock = new Clock()
		var mouse = new Vector2(0, 0)
		const sizes = new Vector2(0, 0)
		const offset = new Vector2(0, 0)

		texture.center.set(0.5, 0.5)

		const getBounds = () => {
			const { width, height, left, top } = (imgRef?.current as HTMLImageElement).getBoundingClientRect()

			if (!sizes.equals(new Vector2(width, height))) {
				sizes.set(width, height)
			}

			if (!offset.equals(new Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
				offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
			}
		}

		getBounds()

		const uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			u_mouse: { value: mouse },
			u_progressHover: { value: .0 },
			u_progressClick: { value: .0 },
			u_time: { value: clock.getElapsedTime() },
			u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
		}

		const geometry = new PlaneBufferGeometry(1, 1, 1, 1);

		const material = new ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true,
			defines: {
				PI: Math.PI,
				PR: window.devicePixelRatio.toFixed(1),
			},
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.x = offset.x
		mesh.position.y = offset.y

		mesh.scale.set(sizes.x, sizes.y, 1)

		scene.add(mesh);



		const update = () => {
			requestAnimationFrame(update)


			renderer.render(scene, camera)
		}

		update()


		const onClick = (e: MouseEvent) => {

			e.preventDefault()

			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth) * 2 - 1;
			const y = -(clientY / window.innerHeight) * 2 + 1;
			mouse.set(x, y)
		}
		document.addEventListener('click', (e: MouseEvent) => { onClick(e) })

	}

	const handleRightClick = (e: MouseEvent) => {
		e.preventDefault()
	}

	useEffect(() => {
		document.addEventListener('contextmenu', handleRightClick)

		return () => document.removeEventListener('contextmenu', handleRightClick)
	})



	useEffect(() => {

		const textureLoader = new TextureLoader()

		textureLoader.load(imagePath, (texture) => init(texture))

	})


	return (
		<div css={
			css`
				position: relative;
				display: flex;
				width: 100%;
				min-height: 100vh;
				align-items: center;
				justify-content: center;
				z-index: 9;
				background-color: #000;
			`
		}>
			<img src={blankSVG} ref={imgRef} alt="" css={imageCSS} width={516} height={583} />
			<canvas id="canvas" ref={canvasRef} css={canvasCSS} />
		</div>
	)
};

export default Annotation2D;

const imageCSS = css`
	pointer-events: none;
	display: flex;
	align-items: center;
`

const canvasCSS = css`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
`
