import React, { useEffect, useState, useRef, Fragment, FC } from 'react';
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
	ConeGeometry,
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

import OrbitControls from 'three-orbitcontrols'

import vertexShader from 'lib/glsl/vertexShader.glsl';
import shapeShader from 'lib/glsl/shapeShader.glsl';
import trippyShader from 'lib/glsl/trippyShader.glsl';
import waveShader from 'lib/glsl/waveShader.glsl';
import revealShader from 'lib/glsl/revealShader.glsl';
import gooeyShader from 'lib/glsl/gooeyShader.glsl';
import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'
import Scrollbar from 'smooth-scrollbar'

import Tile from './Tile'
import FastRewind from 'components/assets/FastRewind'

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`

const PERSPECTIVE = 800;
interface ScrollEvent extends Event {
	deltaY: number;
	clientX: number;
}

const map = (value: number, min1: number, max1: number, min2: number, max2: number) =>
	min2 + (max2 - min2) * (value - min1) / (max1 - min1)


const Slideshow: React.FC = () => {

	const [progress, setProgress] = useState<number>(0)
	const progressRef = useRef<HTMLSpanElement>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const sceneRef = useRef<Scene | null>(null);

	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const onScroll = ({ offset, limit }: { offset: { x: number }, limit: { x: number } }) => {
		const prog = map(offset.x / limit.x * 100, 0, 100, 5, 100)
		setProgress(prog)
	}


	const initScrollbar = () => {
		Scrollbar.use(HorizontalScrollPlugin)
		Scrollbar.detachStyle()

		const scrollbar = Scrollbar.init(document.querySelector('#scrollarea') as HTMLDivElement, {
			delegateTo: document,
			continuousScrolling: false,
			damping: 0.05,
			plugins: { horizontalScroll: { events: [/wheel/] } }
		})

		scrollbar.track.xAxis.element.remove()
		scrollbar.track.yAxis.element.remove()
		scrollbar.addListener((scroll) => onScroll(scroll))
	}



	const onToggleView = (detail) => {

		const ev = new CustomEvent('onClickTile', { detail })
		document.dispatchEvent(ev)
	}

	useEffect(() => {

		window.addEventListener('resize', () => { onResize() })
		document.addEventListener('toggleDetail', ({ detail }) => { onToggleView(detail) })

		initScrollbar()
		sceneRef.current = new Scene();
		const $tiles = document.querySelectorAll('.slideshow-list__el')

		const images = [
			'/images/a-thousand-paths-dark.jpg',
			'/images/a-thousand-paths-dark.jpg',
			'/images/a-thousand-paths-dark.jpg',
			'/images/a-thousand-paths-dark.jpg',
			'/images/a-thousand-paths-dark.jpg',
		]

		const hoverImages = [
			'/images/clint-mckoy.jpg',
			'/images/clint-mckoy.jpg',
			'/images/clint-mckoy.jpg',
			'/images/clint-mckoy.jpg',
			'/images/clint-mckoy.jpg',
		]

		const fragmentShaders = [
			trippyShader,
			shapeShader,
			gooeyShader,
			waveShader,
			revealShader,
		]



		const tiles = Array.from($tiles).map(($el, i) =>
			new Tile($el, i, sceneRef.current, images[i], hoverImages[i], fragmentShaders[i])
		)

		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

		const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.set(0, 0, PERSPECTIVE);



		const light = new AmbientLight(0xffffff, 2);

		const renderer = new WebGLRenderer({
			canvas: canvasRef.current as HTMLCanvasElement,
			alpha: true,
		});
		renderer.setClearAlpha(1)

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : window.devicePixelRatio)


		sceneRef.current.add(camera)
		sceneRef.current.add(light);

		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()

			renderer.setSize(window.innerWidth, window.innerHeight)
			renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : window.devicePixelRatio)
		}


		const update = () => {
			requestAnimationFrame(update)

			tiles.forEach((tile) => tile.update())

			renderer.render(sceneRef.current as Scene, camera as Camera)

		}

		update()

		return () => { Scrollbar.destroyAll() }
	}, [])

	const onClickClose = () => {
		const e = new CustomEvent('onClickClose')
		document.dispatchEvent(e)
	}


	return (
		<main>
			<Wrapper>
				<ScrollAreaCtn>
					<ScrollArea id='scrollarea' data-scrollbar className={'scrollarea'} ref={scrollAreaRef}>
						<SlideShowList>
							<SlideShowEl data-frame className="slideshow-list__el">
								<article className="tile | js-tile">
									<a href="#">
										<figure className="tile__fig">
											<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
										</figure>
									</a>
								</article>
							</SlideShowEl>
							<SlideShowEl data-frame className="slideshow-list__el">
								<article className="tile | js-tile">
									<a href="#">
										<figure className="tile__fig">
											<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
										</figure>
									</a>
								</article>
							</SlideShowEl>
							<SlideShowEl data-frame className="slideshow-list__el">
								<article className="tile | js-tile">
									<a href="#">
										<figure className="tile__fig">
											<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
										</figure>
									</a>
								</article>
							</SlideShowEl>
							<SlideShowEl data-frame className="slideshow-list__el">
								<article className="tile | js-tile">
									<a href="#">
										<figure className="tile__fig">
											<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
										</figure>
									</a>
								</article>
							</SlideShowEl>
							<SlideShowEl data-frame className="slideshow-list__el">
								<article className="tile | js-tile">
									<a href="#">
										<figure className="tile__fig">
											<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
										</figure>
									</a>
								</article>
							</SlideShowEl>
						</SlideShowList>
					</ScrollArea>
					<SlideshowProgressWrapper>
						<SlideshowProgress ref={progressRef} progress={progress ?? 0} />
					</SlideshowProgressWrapper>
				</ScrollAreaCtn>
				<Aside>
					<div >
						<button onClick={() => { console.log('onClose'); onClickClose() }}>

							<div>
								<FastRewind className={'animated-svg'} width={'4vw'} height={'4vw'} fill={'#008080'} />
							</div>
						</button>
					</div>
				</Aside>
				<Canvas ref={canvasRef} >
				</Canvas>
			</Wrapper>
		</main>

	)

};


const Aside = styled.aside`
	border: 2px solid red;
	position: fixed;
	top: 0;
    left: 0;
    z-index: 99999;
& >div {
	display: block;
    width: 100%;
    height: 100%;
    padding: 5vw;
    color: #fff;

}
		button {
			position: relative;
			background: transparent;
			border: none;
			&:hover { cursor: pointer; }
		}

	@keyframes pulse {
		  0% { fill: #002020; transform: scale(0.8); }
		 50% { fill: #005050; transform: scale(1.2); }
		100% { fill: #008080; transform: scale(1.1); }
	}


.animated-svg {
    animation: pulse .8s linear infinite;
}

`

const Wrapper = styled.div`
position: relative;
flex-direction: column;
display: flex;
width: 100%;
min-height: 100vh;
align-items: center;
justify-content: center;
z-index: 9998;

.detail-view {
    overflow: auto;
    position: fixed;
    z-index: 90009999;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
border: 1px solid red;
    opacity: 0;
}
`

const ScrollAreaCtn = styled.section`
    position: relative;

	z-index: 9997;
`


const ScrollArea = styled.div`
	/* position: relative; */
	width: 100vw;
`

const SlideShowList = styled.ul`
	display: flex;
	align-items: center;

`

const SlideShowEl = styled.li`

display: flex;

	width: 100%;
	min-width: 30rem;
	max-width: 40vmin;
	margin-right: 20vw;

	&:first-child {
		margin-left: 40vw;
		box-sizing: content-box;
	}
	&:last-child {
		padding-right: 10vw;
		box-sizing: content-box;
	}
	& img {
	width: 500px;
	height: 500px;

	.tile__img {

	display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
	}
}

`

const SlideshowProgressWrapper = styled.div`
	overflow: hidden;
	position: fixed;
	bottom: 2.5%;
	left: calc(50% - 6.5rem);
	width: 10rem;
	height: .5rem;
	background-color:#ffffff80;
	border-radius: .4rem;
`

const SlideshowProgress = styled.span<{ progress: number }>`
	position: absolute;
	top: 0;
	left: -.5rem;
	width: 10.5rem;
	height: 100%;
	background-color: #006060;
	border-radius: .5rem;
	transition: transform .1s;
	transform: ${({ progress }) => `translateX(${-100 + progress}%)`};
`

export default Slideshow;
