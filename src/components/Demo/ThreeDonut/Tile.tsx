import React, { useEffect, useState, useRef, Fragment, FC } from 'react';
import { gsap } from 'gsap';

import styled from '@emotion/styled';

import THREE, {
	Clock,
	Scene,
	Camera,
	Light,
	PerspectiveCamera,
	AmbientLight,
	Renderer,
	LoadingManager,
	TextureLoader,
	WebGLRenderer,
	BoxBufferGeometry,
	PlaneBufferGeometry,
	BoxGeometry,
	DoubleSide,
	MeshBasicMaterial,
	ShaderMaterial,
	Mesh,
	Vector2, Object3D,
} from 'three';
import vertexShader from 'lib/glsl/vertexShader.glsl';
import Scrollbar from 'smooth-scrollbar'
import { getRatio } from 'utils/three';
import { Collapse } from '@material-ui/core';

export default class Tile {
	scene: Scene;
	mainImage: any;
	images: any = [];
	sizes: any;
	offset: any;
	vertexShader: any;
	fragmentShader: any;
	clock: any;
	mouse: any;
	delta: number = 0;
	hasClicked: boolean = false;
	index: number;
	selectedIndex: number = -1;
	selected: boolean = false;
	isZoomed: any = false;
	loader: any;
	mesh: any;
	uniforms: any;
	scroll: number = 0;
	scrollbar: any;
	prevScroll: number = 0;
	isHovering: boolean = false;
	anchorElement: any;
	detailView: boolean = false;

	constructor($el: any, index: number, scene: any, image: string, hoverImage: string, fragmentShader: any) {
		this.scene = scene

		this.anchorElement = $el.querySelector('a')
		this.mainImage = $el.querySelector('img')
		// this.images = []
		this.sizes = new Vector2(0, 0)
		this.offset = new Vector2(0, 0)

		this.vertexShader = vertexShader
		this.fragmentShader = fragmentShader

		this.clock = new Clock()
		this.mouse = new Vector2(0, 0)

		this.loader = new TextureLoader()

		this.index = index
		this.bindEvent()

		this.preload([image, hoverImage, '/images/shapes/sung.jpeg'], () => { this.init() })

	}

	bindEvent() {
		document.addEventListener('onClickTile', ({ detail }) => {
			this.zoom(detail)
		})


		document.addEventListener('onClickClose', () => {
			this.zoom({ target: null, open: false })
		})


		window.addEventListener('mousemove', (e) => { this.onMouseMove(e) })
		window.addEventListener('resize', () => { this.onResize() })

		this.anchorElement.addEventListener('click', (e: any) => { this.onClick(e) })
		this.anchorElement.addEventListener('mouseenter', () => { this.onMouseEnter() })
		this.anchorElement.addEventListener('mouseleave', () => { this.onMouseLeave() })


		this.scrollbar = Scrollbar.get(document.querySelector('#scrollarea') as HTMLElement)

		this.scrollbar.addListener((scroll: any) => { this.onScroll(scroll) })
	}


	onClick(e: any) {
		e.preventDefault()
		if (this.hasClicked || !this.mesh) return;

		this.hasClicked = true

		const data = { target: this, open: true }
		const ev = new CustomEvent('toggleDetail', { detail: data })
		document.dispatchEvent(ev)

	}

	hide(shouldHide: boolean, open: boolean) {
		const delay = shouldHide && !open ? 0 : 1.2
		const duration = 0.5

		gsap.to(this.uniforms.u_alpha, {
			delay,
			duration,
			value: shouldHide && !open ? 0 : 1,
			ease: 'power3.easeIn',
		})

		gsap.to(this.anchorElement, {
			delay,
			duration,
			alpha: shouldHide && !open ? 0 : 1,
			force3D: true,
		})
	}

	zoom({ target, open }) {


		const shouldZoom = target === this

		const delay = shouldZoom ? 0.4 : 0
		const duration = 1.2

		const newScl = {
			x: shouldZoom ? this.sizes.x * 1.5 : this.sizes.x,
			// y: shouldZoom ? window.innerHeight - 140 : this.sizes.y,
			y: shouldZoom ? this.sizes.y * 1.5 : this.sizes.y,
		}

		const newPos = {
			x: shouldZoom ? window.innerWidth / 2 - window.innerWidth * 0.05 - this.sizes.x * 0.95 : this.offset.x,
			y: shouldZoom ? -20 : this.offset.y,
		}

		const newRatio = getRatio(newScl, this.images[1].image)


		this.hide(!shouldZoom, !open)


		gsap.to(this.uniforms.u_progressClick, {
			duration: 1.2,
			value: shouldZoom ? 1 : 0,
			ease: 'power2.inOut',
			onComplete: () => {

				this.isZoomed = shouldZoom
				this.hasClicked = open

				gsap.to(this.uniforms.u_progressHover, {
					duration: 1,
					value: shouldZoom ? 1 : 0,
					ease: 'power2.inOut',
				})

			},
		})


		gsap.to(this.mesh.scale, {
			delay,
			duration,
			x: newScl.x,
			y: newScl.y,
			ease: 'expo.inOut',
			onUpdate: () => { this.getBounds() },
		})


		gsap.to(this.mesh.position, {
			delay,
			duration,
			x: newPos.x,
			y: newPos.y,
			ease: 'expo.inOut',
		})

		gsap.to(this.uniforms.u_hoverratio.value, {
			delay,
			duration,
			x: newRatio.x,
			y: newRatio.y,
			ease: 'expo.inOut',
		})

		// gsap.to(this.stgs.lines, {
		//    duration,
		// 		yPercent: shouldZoom ? 100 : 0,
		// 		ease: expo.InOut,
		// 		force3D: true,
		// stagger: 0.25
		// }, 0.255 / this.stgs.lines.length)
	}


	onMouseEnter() {
		if (!this.mesh) return;
		this.isHovering = true

		if (this.isZoomed || this.hasClicked) return;

		gsap.to(this.uniforms.u_progressHover, {
			value: 1,
			duration: 1,
			ease: 'power2.inout'
		});
	}

	onMouseLeave() {

		if (!this.mesh || this.isZoomed || this.hasClicked) return;


		gsap.to(this.uniforms.u_progressHover, {
			value: 0,
			duration: 1,
			ease: 'power2.inout',
			onComplete: () => { this.isHovering = false },
		});
	}

	onMouseMove = (event: MouseEvent) => {

		if (this.isZoomed || this.hasClicked) return;

		gsap.to(this.mouse, {
			duration: 0.5,
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
		});

	}

	getBounds() {
		const { width, height, left, top } = this.mainImage.getBoundingClientRect()

		if (!this.sizes.equals(new Vector2(width, height))) {
			this.sizes.set(width, height)
		}

		if (!this.offset.equals(new Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
			this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
		}
	}

	onScroll({ offset, limit }: any) {
		if (this.hasClicked) return;
		this.scroll = offset.x / limit.x
	}


	preload(images: any, allImagesLoadedCallback: any) {
		let loadedCounter = 0
		const toBeLoadedNumber = images.length
		const preloadImage = (image: any, anImageLoadedCallback: any) => {
			const texture = this.loader.load(image, anImageLoadedCallback)
			texture.center.set(0.5, 0.5)
			this.images.push(texture)
		}

		images.forEach((image: any) => {
			preloadImage(image, () => {
				loadedCounter += 1
				if (loadedCounter === toBeLoadedNumber) {
					allImagesLoadedCallback()
				}
			})
		})
	}

	init() {

		const [texture, hoverTexture, shape] = this.images

		this.getBounds()

		this.uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			// u_ratio: { value: getRatio(this.sizes, texture.image) },
			u_ratio: { value: new Vector2(1, 1) },
			u_hovermap: { type: 't', value: hoverTexture },
			// u_hoverratio: { value: getRatio(this.sizes, hoverTexture.image) },
			u_hoverratio: { value: new Vector2(1, 1) },
			u_shape: { value: shape },
			u_mouse: { value: this.mouse },
			u_progressHover: { value: .0 },
			u_progressClick: { value: .0 },
			u_time: { value: this.clock.getElapsedTime() },
			u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
		}

		const geometry = new PlaneBufferGeometry(1, 1, 1, 1);

		const material = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: vertexShader,
			fragmentShader: this.fragmentShader,
			transparent: true,
			defines: {
				PI: Math.PI,
				PR: window.devicePixelRatio.toFixed(1),
			},
		});

		this.mesh = new Mesh(geometry, material);

		this.mesh.position.x = this.offset.x
		this.mesh.position.y = this.offset.y

		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

		this.scene.add(this.mesh);
	}

	onResize() {

		this.getBounds()

		if (!this.mesh) return

		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
		this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
	}

	move() {
		if (!this.mesh || this.isZoomed || this.hasClicked) return;

		this.getBounds()

		gsap.set(this.mesh.position, {
			x: this.offset.x,
			y: this.offset.y,
		})

		gsap.to(this.mesh.scale, {
			x: this.sizes.x - this.delta,
			y: this.sizes.y - this.delta,
			z: 3,
			duration: 1
		})

	}

	update() {
		this.delta = Math.abs((this.scroll - this.prevScroll) * 2000)

		if (!this.mesh) return

		this.move()

		this.prevScroll = this.scroll

		if (!this.isHovering) return
		this.uniforms.u_time.value += this.clock.getDelta()
	}
}


