import { useEffect, useState, useRef, Fragment, ReactElement } from 'react';
import dynamic from 'next/dynamic';
import CanvasLayout from 'layouts/CanvasLayout'
import styled from '@emotion/styled';

interface Props {
	image: any;
	hoverImage: any;
}

const FramesCopy = dynamic(import('components/Demo/ThreeDonut/Framescopy'), { ssr: false });

const img = '/images/a-thousand-paths-dark.jpg';
const hoverImg = '/images/clint-mckoy.jpg'


const AboutPage = () => {
	useEffect(() => {
		const $tiles = document.querySelectorAll('.slideshow-list__el')
	}, [])

	return (
		<CanvasLayout>
			<FramesCopy image={img} hoverImage={hoverImg} />
		</CanvasLayout>
	)
};


export default AboutPage;

const Page = styled.div`
	position: relative;
	display: block;
	z-index: 5;
	height: 100%;
	overflow: hidden;
	background-color: #525252;
	cursor: ew-resize;
`

