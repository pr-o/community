import { useEffect, useState, useRef } from 'react';
import { gsap, Power2 } from 'gsap';

import styled from '@emotion/styled';

import {
	Clock,
	Scene,
	Camera,
	Light,
	PerspectiveCamera,
	AmbientLight,
	Renderer,
	TextureLoader,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	ShaderMaterial,
	Mesh,
	Vector2
} from 'three';
import { Canvas } from 'lib/hooks/Canvas'
import { getRatio } from 'utils/three'
import Scrollbar from 'smooth-scrollbar';
import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'

// import Figure from '../scenes/figure2';
// import useScene from 'scenes/scene2'
// import useLight from 'scenes/light'
// import useRenderer from 'scenes/renderer'
import { Update } from '@material-ui/icons';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import OrbitControls from 'three-orbitcontrols'
import Element from 'components/Slideshow/Element'

// import OrbitControls from 'orbit-controls-es6';
import vertexShader from 'lib/glsl/vertexShader.glsl';
import fragmentShader from 'lib/glsl/fragmentShader.glsl';
const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'
const PERSPECTIVE = 800;

const length = 6
const clock = new Clock()

const loader = new TextureLoader()

const Slidshow = () => {
	// const { h = 600, w = 600, d = 1, color = 0x00ff00 } = props;

	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const progressWrapperRef = useRef<HTMLDivElement>(null)
	const progressRef = useRef<HTMLSpanElement>(null)
	const [progress, setProgress] = useState<number>(0)
	const [isHovering, setIsHovering] = useState<boolean[]>(new Array(length).fill(false))
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const sceneRef = useRef<Scene | null>(null);
	const cameraRef = useRef<Camera | null>(null);
	const lightRef = useRef<Light | null>(null);
	const rendererRef = useRef<WebGLRenderer | null>(null);
	const controlsRef = useRef<typeof OrbitControls | null>(null);

	const images = [
		{ image: img, hoverImage: hoverImg },
		{ image: img, hoverImage: hoverImg },
		{ image: img, hoverImage: hoverImg },
		{ image: img, hoverImage: hoverImg },
		{ image: img, hoverImage: hoverImg },
		{ image: img, hoverImage: hoverImg },
	]

	const mouse = new Vector2(0, 0);
	const sizes = new Vector2(0, 0);
	const offset = new Vector2(0, 0);


	const initScrollbar = () => {
		Scrollbar.use(HorizontalScrollPlugin)
		Scrollbar.detachStyle()

		const scrollbar = Scrollbar.init((scrollAreaRef.current as HTMLDivElement), {
			delegateTo: document,
			continuousScrolling: false,
			damping: 0.1,
			plugins: { horizontalScroll: { events: [/wheel/] } }
		})

		scrollbar.track.xAxis.element.remove()
		scrollbar.track.yAxis.element.remove()
		scrollbar.addListener((scroll) => onScroll(scroll))
	}

	const createMesh = (texture: any, hoverTexture: any) => {


		const initialUniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			u_ratio: { value: getRatio(sizes, { width: 600, height: 800 }) },
			u_hovermap: { type: 't', value: hoverTexture },
			u_hoverratio: { value: getRatio(sizes, { width: 600, height: 800 }) },
			u_shape: { value: hoverTexture },
			u_mouse: { value: mouse },
			u_progressHover: { value: 0 },
			u_progressClick: { value: 0 },
			u_time: { value: clock.getElapsedTime() },
			u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
		};


		const geometry = new BoxGeometry(10, 10, 3);
		const material = new ShaderMaterial({
			uniforms: initialUniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			defines: {
				PR: window.devicePixelRatio.toFixed(1),
			},
			// side: THREE.DoubleSide,
		});

		const mesh = new Mesh(geometry, material);
		mesh.scale.set(30, 30, 1);
		mesh.position.set(0, 0, 0)
		mesh.castShadow = true;
		return mesh
	}

	const onScroll = ({ offset, limit }: { offset: { x: number }, limit: { x: number } }) => {
		setProgress(Math.round(offset.x / limit.x * 100))
	}




	const init = () => {

		const texture = loader.load(img);
		const hoverTexture = loader.load(hoverImg)


		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

		cameraRef.current = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
		cameraRef.current.position.set(0, 0, PERSPECTIVE);

		lightRef.current = new AmbientLight(0xffffff, 2);

		rendererRef.current = new WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});

		rendererRef.current.setSize(window.innerWidth, window.innerHeight);
		rendererRef.current.setPixelRatio(window.devicePixelRatio);

		sceneRef.current = new Scene();
		sceneRef.current.add(cameraRef.current)
		sceneRef.current.add(lightRef.current);

		const mesh = createMesh(texture, hoverTexture)
		sceneRef.current.add(mesh)

		controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
		controlsRef.current.enableZoom = false
		controlsRef.current.enableDamping = true

		window.addEventListener('mousemove', (e) => onMouseMove(e));
	}

	useEffect(() => {
		initScrollbar()

		init()

		update()

		return () => Scrollbar.destroyAll()
	}, []);

	const update = () => {
		requestAnimationFrame(update)
		const time = clock.getElapsedTime()
		controlsRef.current!.update()
		rendererRef.current!.render(sceneRef.current!, cameraRef.current!)
	}




	const onMouseMove = (event: MouseEvent) => {

		gsap.to(mouse, {
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
			duration: 0.5,
		});
	}

	return (
		<ScrollableSection>

			<ScrollArea ref={scrollAreaRef}>
				<SlideShowList>
					<Element
						scene={sceneRef.current}
						images={images}
						mouse={mouse}
						sizes={sizes}
						offset={offset}
						clock={clock} />
					{/* {[1, 2, 3, 4, 5, 6, 7].map((el, index) => (
						<Element scene={sceneRef.current}  key={`${index}`}
						//  className={'image-tiles'}
						>

						</Element>
					))} */}
					{/* {[1, 2, 3, 4, 5, 6, 7].map((el, index) => (
						<SlideShowListEl key={`${index}`} className={'image-tiles'}>

							<ArticleTile>
								<a href="#">
									<FigureTile>
										<ImageTile
											id='image-tile'
											// src={blankSVG}
											src={img}
											data-src={img}
											data-hover={hoverImg}
											alt="Woods Forests" />
									</FigureTile>
									<TileContent>
										<TileTitle>{`${index}: Woods &`}<TitleOffset>Forests</TitleOffset></TileTitle>
										<TitleCTA>
											<ButtonInline>See more</ButtonInline>
										</TitleCTA>
									</TileContent>
								</a>
							</ArticleTile>
						</SlideShowListEl>
					))} */}

				</SlideShowList >
			</ScrollArea >
			<SlideshowProgressWrapper ref={progressWrapperRef}>
				<SlideshowProgress ref={progressRef} progress={progress ?? 0} />
			</SlideshowProgressWrapper>
			<Canvas ref={canvasRef} />

		</ScrollableSection>
	);
};

export default Slidshow;


const ScrollableSection = styled.section`
	position: relative;
	display: block;
	z-index: 5;
	height: 100%;
	/* width: 100%; */
	background-color: #2b3242;
`

const ScrollArea = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	height: 100%;
	width: 100%;

	& div {
		width: 100%;
		height: 100%;
	}
`

const SlideShowList = styled.ul`
	display: flex;
	margin: 0 60rem 0 30rem;
	list-style: none;
	height: 100%;
`

const SlideShowListEl = styled.li`
	flex: 0 0 auto;
	width: 100%;
	z-index: 933;
	min-width: 25rem;
	max-width: 40vmin;
	margin-left: 20rem;
	cursor: pointer;
	&:last-child {
		padding-right: 20rem;
		box-sizing: content-box;
	}

	&:nth-child(1n) {
		.tile__content {
			color: red;
		}
	}
`

const ArticleTile = styled.section`
	position: relative;
`

const FigureTile = styled.section`
	position: relative;
	width: 90%;

	&::before {
		content: '';
		display: block;
		padding-top: 136.36%;
	}
`

const TileContent = styled.div`
	position: absolute;
	bottom: 3.6rem;
	right: 0;
	/* width: 100%; */
	width: 100%;

	font-size: 1.4rem;

	transition: color .3s;
	color: #990000;
		&:hover {
		color: #004040;
	}
`

const TileTitle = styled.h2`
	margin-left: -10%;
	white-space: nowrap;
	position: relative;
	z-index: 9999999;
	font-size: calc(2rem + 2.5vw);
	/* font-size: calc(10rem + 3vw); */
`

const TitleOffset = styled.span`
	display: block;
	margin-left: 15%;
`

const TitleCTA = styled.div`
	display: block;
	margin-top: 2rem;
	margin-left: 6.4%;
	line-height: 1.5;
`
const ButtonInline = styled.span`
	display: inline-block;
	line-height: 1.5;
	border-bottom: .1rem solid;
`

const SlideshowProgressWrapper = styled.div`
	overflow: hidden;
	position: absolute;
	bottom: 5%;
	left: calc(50% - 6.5rem);
	width: 10rem;
	height: .5rem;
	background-color:#ffffff80;
	border-radius: .4rem;
`

interface SlideshowProgressProps {
	progress: number;
}

const SlideshowProgress = styled.span<SlideshowProgressProps>`
	position: absolute;
	top: 0;
	left: -.25rem;
	width: 10.5rem;
	height: 100%;
	background-color: #006060;
	border-radius: .5rem;
	transition: transform .1s;
	transform: ${({ progress }) => `translateX(${-100 + progress}%)`};
`

const ImageTile = styled.img`
	/* display: block; */
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	object-fit: cover;
	object-position: center;
	/* transition: opacity .3s; */
	/* border: 4px dotted #008080; */
`

