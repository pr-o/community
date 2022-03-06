import { useEffect, useState, useRef, Fragment } from 'react';
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
	PlaneBufferGeometry,
	BoxGeometry,
	MeshBasicMaterial,
	ShaderMaterial,
	Mesh,
	Vector2, Object3D
} from 'three';
import { Canvas } from 'lib/hooks/Canvas'
import { getRatio } from 'utils/three'
import Scrollbar from 'smooth-scrollbar';
import HorizontalScrollPlugin from 'lib/utils/HorizontalScrollPlugin'

import { Update } from '@material-ui/icons';
import OrbitControls from 'three-orbitcontrols'
import Element from 'components/Demo/ThreeDonut/Element'

// import OrbitControls from 'orbit-controls-es6';

import vertexShader from 'scenes/glsl/vertexShader.glsl';
import fragmentShader from 'scenes/glsl/fragmentShader.glsl';

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'
const PERSPECTIVE = 800;

const length = 6
const clock = new Clock()

const loader = new TextureLoader()

const FrameTiles = (src, dataSrc, dataHover) => {

	const img = '/images/a-thousand-paths-dark.jpg';
	const hoverImg = '/images/clint-mckoy.jpg'



	const onMouseEnter = () => {
		console.log('enter')

	}

	return (
		<div onMouseEnter={onMouseEnter}>
			<ArticleTile >
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
						<TileTitle>{` Woods &`}<TitleOffset>Forests</TitleOffset></TileTitle>
						<TitleCTA>
							<ButtonInline>See more</ButtonInline>
						</TitleCTA>
					</TileContent>
				</a>
			</ArticleTile>
		</div>
	);
};

export default FrameTiles;


const ScrollableSection = styled.div`
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
	position: relative;

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
	position: relative;

`

const SlideShowListEl = styled.li`
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	z-index: 933;
	min-width: 25rem;
	max-width: 40vmin;
	margin-left: 20rem;
	position: relative;
	cursor: pointer;
	&:last-child {
		padding-right: 20rem;
		box-sizing: content-box;
	}

	&:nth-of-type(1n) {
		.tile__content {
			color: red;
		}
	}
`

const ArticleTile = styled.div`
	position: relative;
	z-index: 934;
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
	z-index: 999;
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
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	min-width: 25rem;
	min-height: 25rem;

	height: 100%;
	z-index: 9999;
	object-fit: cover;
	object-position: center;
	/* transition: opacity .3s; */
	/* border: 4px dotted #008080; */
`
