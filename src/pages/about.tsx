import { useEffect, useState, useRef, Fragment, ReactElement } from 'react';
import dynamic from 'next/dynamic';
import CanvasLayout from 'layouts/CanvasLayout'
import styled from '@emotion/styled';

const Frames = dynamic<{}>(() => import('components/Demo/ThreeDonut/Frames'), { ssr: false });

const AboutPage = () => {
	return (
		<CanvasLayout>
			<Frames />;
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

