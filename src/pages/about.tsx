import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import CanvasLayout from 'layouts/CanvasLayout'
import styled from '@emotion/styled';

const Slideshow = dynamic(import('components/Slideshow/Slideshow'), { ssr: false });

const AboutPage = () => {
	useEffect(() => { }, [])

	return (
		<CanvasLayout>
			<Slideshow />
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
