import React, { useEffect, useState, useRef, FC } from 'react';
import { gsap } from 'gsap';
import { fromEvent, of } from 'rxjs'; // fromEvent 를 통해 화살표 이용한 navigation ㄱㄱ
import { throttle, distinctUntilKeyChanged, filter, pluck } from 'rxjs/operators';

import styled from '@emotion/styled';

import {
	Scene,
	Camera,
	PerspectiveCamera,
	AmbientLight,
	WebGLRenderer,
	BoxBufferGeometry,
} from 'three';
import { Canvas } from 'lib/hooks/Canvas'

import vertexShader from 'lib/glsl/vertexShader.glsl';
import shapeShader from 'lib/glsl/shapeShader.glsl';
import trippyShader from 'lib/glsl/trippyShader.glsl';
import waveShader from 'lib/glsl/waveShader.glsl';
import revealShader from 'lib/glsl/revealShader.glsl';
import gooeyShader from 'lib/glsl/gooeyShader.glsl';
import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'
import Scrollbar from 'smooth-scrollbar'
import { imagePaths, hoverImagePaths, fragmentShaderNames, shapeImagePaths } from 'components/Slideshow/imagePaths'

import Slide, { OnClickTileDetail } from 'components/Slideshow/Slide'
import FastRewind from 'components/assets/FastRewind'

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`

const PERSPECTIVE = 800;

interface ScrollEvent extends Event {
	deltaY: number;
	clientX: number;
}

const Slideshow: FC = () => {

	const [progress, setProgress] = useState<number>(0)
	const progressWrapperRef = useRef<HTMLElement | null>(null)
	const progressRef = useRef<HTMLSpanElement>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const sceneRef = useRef<Scene | null>(null);
	const scrollbarRef = useRef<Scrollbar | null | undefined>(null)
	const backButtonRef = useRef<HTMLDivElement | null>(null)

	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const onScroll = ({ offset, limit }: { offset: { x: number }, limit: { x: number } }) => {
		const prog = offset.x / limit.x * 100
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
		scrollbarRef.current = scrollbar
	}


	const toggleScroll = (lock: boolean) => {
		const duration = lock ? 0 : 1.5
		const delay = lock ? 0 : 1
		const alpha = lock ? 0 : 1

		gsap.to(progressWrapperRef.current, { delay, duration, alpha, force3D: true })

		gsap.delayedCall(duration, () => {
			scrollbarRef.current?.updatePluginOptions('horizontalScroll', {
				events: lock ? false : [/wheel/],
			})
		})
	}

	const onClickClose = () => {
		const e = new CustomEvent('onClickClose')
		document.dispatchEvent(e)

		toggleScroll(false)
	}

	const onToggleView = (detail: OnClickTileDetail) => {
		const e = new CustomEvent('onClickTile', { detail })
		document.dispatchEvent(e)

		toggleScroll(detail.open)
	}



	const fragmentShaderObj: { [key: string]: string } = {
		'shapeShader': shapeShader,
		'trippyShader': trippyShader,
		'waveShader': waveShader,
		'revealShader': revealShader,
		'gooeyShader': gooeyShader,
	}


	useEffect(() => {
		scrollbarRef.current = Scrollbar.get(document.querySelector('#scrollarea') as HTMLElement)

		window.addEventListener('resize', () => { onResize() })
		document.addEventListener('toggleDetail', (({ detail }: CustomEvent) => onToggleView(detail)) as EventListener)


		initScrollbar()
		sceneRef.current = new Scene();
		const $tiles = document.querySelectorAll('.slideshow-list__el')

		progressWrapperRef.current = document.getElementById('progress-wrapper')




		const slides = Array.from($tiles).map(($el, i) => {

			const images =
				[imagePaths[i], hoverImagePaths[i], shapeImagePaths[i]].filter((path) => path)

			return new Slide($el, sceneRef.current, images, fragmentShaderObj[fragmentShaderNames[i]], vertexShader)
		}
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

			slides.forEach((slide) => slide.update())

			renderer.render(sceneRef.current as Scene, camera as Camera)
		}

		update()

		return () => { Scrollbar.destroyAll() }
	}, [])


	return (
		<main>
			<Wrapper>
				<ScrollAreaCtn>
					<ScrollArea id='scrollarea' data-scrollbar className={'scrollarea'} ref={scrollAreaRef}>
						<SlideShowList>
							{imagePaths?.map((path, i) =>
								<SlideShowEl data-frame className="slideshow-list__el" key={`frame-${i}`}>
									<article className="tile | js-tile">
										<a href="#">
											<figure className="tile__fig">
												<img src={blankSVG} alt="Woods & Forests" className="tile__img" />
											</figure>
										</a>
									</article>
								</SlideShowEl>
							)}
						</SlideShowList>
					</ScrollArea>
					<SlideshowProgressWrapper id='progress-wrapper'>
						<SlideshowProgress ref={progressRef} progress={progress ?? 0} />
					</SlideshowProgressWrapper>
				</ScrollAreaCtn>
				<Aside>
					<BackButtonWrapper ref={backButtonRef}>
						<button onClick={() => { onClickClose() }}>
							<FastRewind className={'animated-svg'} width={'4vw'} height={'4vw'} fill={'#008080'} />
						</button>
					</BackButtonWrapper>
				</Aside>
				<Canvas ref={canvasRef} >
				</Canvas>
			</Wrapper>
		</main>

	)
};

export default Slideshow;

const Aside = styled.aside`
	border: 2px solid red;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 99999;

	@keyframes pulse {
		  0% { fill: #002020; transform: scale(0.8); }
		 50% { fill: #005050; transform: scale(1.2); }
		100% { fill: #008080; transform: scale(1.1); }
	}

	.animated-svg {
		animation: pulse .8s linear infinite;
	}
`

const BackButtonWrapper = styled.div`
	display: block;
	width: 100%;
	height: 100%;
	padding: 3vw;
	color: #fff;

	button {
		position: relative;
		background: transparent;
		border: none;
		&:hover { cursor: pointer; transform: skewY(15deg) }
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
	width: 100vw;
`


const ScrollArea = styled.div`
	position: relative;
	/* width: 100vw; */
	width: 100%;
`

const SlideShowList = styled.ul`
	display: flex;
	align-items: center;
	list-style: none;
	/* display: block;
			position: absolute; */


`

const SlideShowEl = styled.li`
	width: 100%;
	min-width: 30rem;
	max-width: 40vmin;
	margin-right: 20vw;
position: relative;


&:nth-child(2n + 1) {
	padding-top: 200px;
}

&:nth-child(2n) {
	padding-bottom: 200px;
}

	&:first-child {
		margin-left: 40vw;
		box-sizing: content-box;
	}

	&:last-child {
		padding-right: 10vw;
		box-sizing: content-box;
	}

	img {
		width: 500px;
		height: 500px;

		.tile__img {
			display: block;
			position: absolute;
			top: 100px;
			left: 100px;
			/* width: 100%;
			height: 100%; */
			object-fit: contain;
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
