import React, { useRef, MutableRefObject, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import Image from 'next/image'
import Link from 'next/link'
import { ThumbUpAlt, Update } from '@material-ui/icons';
import Slidshow from 'components/Slideshow/List';
import * as THREE from 'three';

import { css, useTheme } from '@emotion/react';

const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'
const headerImage = '/images/a-thousand-paths-dark.jpg';
const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`

import Scrollbar from 'smooth-scrollbar';

import { Canvas } from 'lib/hooks/Canvas'
import { gsap, Power2 } from 'gsap';


const length = 8

const AboutCopy = () => {
	const theme: any = useTheme();
	// const scrollbarRef = React.useRef<any>(null)
	// const sceneRef = React.useRef<any>(null)
	// const renderersRef = React.useRef<any>(null)
	// const cameraRef = React.useRef<any>(null)

	// let scene, camera,



	useEffect(() => {

		// const scene = new Scene();

		// const container = document.getElementById('stage');

		// const els = document.getElementById('image-tile')
		// const els = document.querySelectorAll('#image-tile')

		// console.log('els', els)
		// els[0].addEventListener('mouseenter', (e) => { console.log('enter', e) });
		// els?.addEventListener('mouseenter', (e) => { console.log('enter', e) })
		// els.forEach((el) => el.addEventListener('mouseenter', () => onPointerEnter()))

	}, [])




	return (
		<Wrapper>
			<Slidshow />
		</Wrapper>
	)
}

export default AboutCopy;


const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: hidden;
`
