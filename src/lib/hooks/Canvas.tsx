import React, { useEffect } from 'react'
import mergeRefs from "react-merge-refs";
import styled from '@emotion/styled';


export const Canvas = React.forwardRef<HTMLCanvasElement, any>(function Canvas(
	{ children, fallback, tabIndex, resize, id, style, className, events, ...props },
	forwardedRef,
) {

	const containerRef = React.useRef<HTMLElement | null>(null)

	const canvasRef = React.useRef<HTMLCanvasElement>(null!)

	useEffect(() => { }, [])

	return (
		// <StyledDiv
		// 	id={id}
		// 	className={className}
		// 	tabIndex={tabIndex}
		// >
		<StyledCanvas id="stage" ref={mergeRefs([canvasRef, forwardedRef])}>
			{fallback}
		</StyledCanvas>
		// </StyledDiv >
	)
})



const StyledDiv = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	z-index: 20;
	overflow-x: hidden;
	overflow-y: hidden;
	border: 3px solid blue;
`

const StyledCanvas = styled.canvas`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: -6;
	border: 1px solid red;
`
