import * as THREE from 'three';
import React, { RefObject } from 'react'
import mergeRefs from "react-merge-refs";
import styled from '@emotion/styled';


export const Light = ({ scene }) => {

	const containerRef = React.useRef<HTMLElement | null>(null)

	const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.15);
	scene.add(ambientLight);


	// // const [containerRef, { width, height }] = useMeasure({ scroll: true, debounce: { scroll: 50, resize: 0 }, ...resize })
	// const canvasRef = React.useRef<HTMLCanvasElement>(null!)
	// const [block, setBlock] = React.useState<SetBlock>(false)
	// const [error, setError] = React.useState<any>(false)
	// // Suspend this component if block is a promise (2nd run)
	// if (block) throw block
	// // Throw exception outwards if anything within canvas throws
	// if (error) throw error


	// return ()
}
