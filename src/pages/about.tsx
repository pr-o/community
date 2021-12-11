import React, { useRef, MutableRefObject, useEffect, useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { ThumbUpAlt, Update } from '@material-ui/icons';
import Parallax from 'components/Parallax/Parallax';
import * as THREE from 'three';

import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Figure from '../scenes/figure';

const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'
const headerImage = '/images/a-thousand-paths-dark.jpg';
const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
import vertexShader from 'lib/glsl/vertexShader.glsl';
import fragmentShader from 'lib/glsl/fragmentShader.glsl';
import Scrollbar from 'smooth-scrollbar';
import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'

import { Canvas } from 'lib/hooks/Canvas'
import { gsap, Power2 } from 'gsap';
import dynamic from 'next/dynamic'
import Scene from 'scenes/scene'

const length = 8

const About = () => {
	const theme: any = useTheme();
	// const scrollbarRef = React.useRef<any>(null)
	const scrollAreaRef = React.useRef<HTMLDivElement>(null)
	const progressWrapperRef = React.useRef<HTMLDivElement>(null)
	const progressRef = React.useRef<HTMLSpanElement>(null)
	// const sceneRef = React.useRef<any>(null)
	// const renderersRef = React.useRef<any>(null)
	// const cameraRef = React.useRef<any>(null)
	const [progress, setProgress] = useState<number>(0)
	const [isHovering, setIsHovering] = useState<boolean[]>(new Array(length).fill(false))

	const initScrollbar = () => {
		Scrollbar.use(HorizontalScrollPlugin)

		const scrollbar = Scrollbar.init((scrollAreaRef.current as HTMLDivElement), {
			delegateTo: document,
			continuousScrolling: false,
			damping: 0.1,
			plugins: {
				horizontalScroll: { events: [/wheel/] }
			}
		})
		Scrollbar.detachStyle()

		scrollbar.track.xAxis.element.remove()
		scrollbar.track.yAxis.element.remove()
		scrollbar.addListener((scroll) => onScroll(scroll))
	}

	const PERSPECTIVE = 800;


	useEffect(() => {
		initScrollbar()

		const scene = new Scene();

		const container = document.getElementById('stage');

		// const els = document.getElementById('image-tile')
		// const els = document.querySelectorAll('#image-tile')

		// console.log('els', els)
		// els[0].addEventListener('mouseenter', (e) => { console.log('enter', e) });
		// els?.addEventListener('mouseenter', (e) => { console.log('enter', e) })
		// els.forEach((el) => el.addEventListener('mouseenter', () => onPointerEnter()))

		return () => Scrollbar.destroyAll()
	}, [])


	const onScroll = ({ offset, limit }: { offset: { x: number }, limit: { x: number } }) => {
		setProgress(Math.round(offset.x / limit.x * 100))
	}


	return (
		<>

			<ScrollableSection>

				<ScrollArea ref={scrollAreaRef}>
					<SlideShowList>

						{[1, 2, 3, 4, 5, 6, 7].map((el, index) => (
							<SlideShowListEl key={`${index}`} className={'image-tiles'}>

								<ArticleTile>
									<a href="#">
										<FigureTile>
											<ImageTile
												id='image-tile'
												src={blankSVG}
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
						))}

						<SlideShowListEl className={'image-tiles'}>
							<ArticleTile>
								<a href="#">
									<FigureTile>
										{/* <ImageTile
											id='image-tile'
											src={blankSVG}
											data-src={img}
											data-focus={isHovering}
											data-hover={hoverImg}
											onMouseEnter={onMouseEnter}
											onMouseLeave={onMouseLeave}
											alt="Woods Forests" /> */}
									</FigureTile>
									<TileContent>
										<TileTitle>{'ASAP &'}<TitleOffset>Forests</TitleOffset></TileTitle>
										<TitleCTA>
											<ButtonInline>See more</ButtonInline>
										</TitleCTA>
									</TileContent>
								</a>
							</ArticleTile>
						</SlideShowListEl>
					</SlideShowList >
				</ScrollArea >
				<SlideshowProgressWrapper ref={progressWrapperRef}>
					<SlideshowProgress ref={progressRef} progress={progress ?? 0} />
				</SlideshowProgressWrapper>
				<Canvas />

			</ScrollableSection>

		</>
	)
}

export default About;

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
	height: 100%;
	width: 100%;
	position: relative;
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
	width: 12rem;
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
	left: 0;
	width: 100%;
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
