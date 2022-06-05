import React, { useEffect } from 'react'
import mergeRefs from "react-merge-refs";
import styled from '@emotion/styled';


export const Canvas = React.forwardRef<HTMLCanvasElement, any>(function Canvas(
	{ children, fallback, tabIndex, resize, id, style, className, events, ...props },
	forwardedRef,
) {

	const canvasRef = React.useRef<HTMLCanvasElement>(null!)

	return (

		<StyledCanvas id="stage" ref={mergeRefs([canvasRef, forwardedRef])} {...props}>
			{fallback}
		</StyledCanvas>
	)
})

const StyledCanvas = styled.canvas`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
`
