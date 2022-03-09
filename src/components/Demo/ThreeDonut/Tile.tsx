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

export default class Tile {
	scene: Scene;
	mainImage: any;
	images: any;
	sizes: any;
	offset: any;
	vertexShader: any;
	fragmentShader: any;
	clock: any;
	mouse: any;
	delta: any;
	hasClicked: any;
	isZoomed: any;
	loader: any;
	// preload: any;
	mesh: any;
	uniforms: any;
	scroll: number = 0;
	Scroll: any;
	prevScroll: number = 0;
	isHovering: boolean = false;
	image: any;
	hoverImage: any;
	texture: any;
	hoverTexture: any;
	loadedCounter: number = 0
	toLoadCounter: number = 2
	anchorElement: any;
	shape: any = null;
	shapeTexture: any;
	textureImage: any;
	hoverTextureImage: any;
	t: any;
	ht: any;
	index: string;
	detailsView: boolean = false;


	constructor($el: any, index: string, scene: any, image: string, hoverImage: string, duration: any, fragmentShader: any, t: any, ht: any) {
		this.scene = scene

		this.anchorElement = $el.querySelector('a')
		this.mainImage = $el.querySelector('img')
		this.images = []
		this.sizes = new Vector2(0, 0)
		this.offset = new Vector2(0, 0)

		this.vertexShader = vertexShader
		this.fragmentShader = fragmentShader

		this.clock = new Clock()

		this.mouse = new Vector2(0, 0)

		this.scroll = 0
		this.prevScroll = 0
		this.delta = 0
		this.hasClicked = false
		this.isZoomed = false

		this.loader = new TextureLoader()

		this.image = image
		this.hoverImage = hoverImage

		this.texture = this.loader.load(image, (image: any) => { this.t = image; });
		this.hoverTexture = this.loader.load(hoverImage, (image: any) => { this.ht = image; })
		this.shape = this.loader.load('/images/shapes/sung.jpeg')

		// this.t = t
		// this.ht = ht
		this.index = index
		this.bindEvent()

		// this.preload(this.init())

		// if (this.texture.image)

		// this.init()
		this.preload([this.image, this.hoverImage, '/images/shapes/sung.jpeg'], () => { this.init() })


	}

	bindEvent() {
		// document.addEventListener('tile:zoom', ({ detail }) => { this.zoom(detail) })

		document.addEventListener('onClickClose', ({ detail }: any) => {

			this.hasClicked = false
			this.zoom({ index: 1, open: true })
			console.log('recccc')
		})


		// window.addEventListener('resize', () => { this.onResize() })

		window.addEventListener('mousemove', (e) => { this.onMouseMove(e) })
		window.addEventListener('resize', () => { this.onResize() })
		// window.addEventListener('wheel', (e) => { this.onScroll(e) })

		this.anchorElement.addEventListener('click', (e: any) => { this.onClick(e) })
		this.anchorElement.addEventListener('mouseenter', () => { this.onMouseEnter() })
		this.anchorElement.addEventListener('mouseleave', () => { this.onMouseLeave() })


		this.Scroll = Scrollbar.get(document.querySelector('#scrollarea') as HTMLElement)

		this.Scroll.addListener((scroll: any) => this.onScroll(scroll))
	}

	disableScroll() { this.Scroll.updatePluginOptions('horizontalScroll', { events: [] }) }
	enableScroll() { this.Scroll.updatePluginOptions('horizontalScroll', { events: [/wheel/] }) }

	onClick(e: any) {
		e.preventDefault()

		// if (APP.Layout.isMobile) return

		if (this.detailsView) return;
		if (!this.mesh) return

		this.hasClicked = !this.hasClicked

		const index = this.mesh.name;


		this.zoom({ index, open: true })

	}


	zoom({ index, open }: any) {
		// this.hasClicked = true

		// const shouldZoom = true
		const shouldZoom = this.hasClicked

		const newScl = {
			x: shouldZoom ? window.innerWidth * 0.44 : this.sizes.x,
			y: shouldZoom ? window.innerHeight - 140 : this.sizes.y,
		}

		const newPos = {
			x: shouldZoom ? window.innerWidth / 2 - window.innerWidth * 0.05 - this.sizes.x * 0.95 : this.offset.x,
			y: shouldZoom ? -20 : this.offset.y,
		}

		const newRatio = getRatio(newScl, this.images[1].image)

		this.hasClicked ? this.disableScroll() : this.enableScroll()

		this.hasClicked ?
			this.scene.traverse((obj) => {
				console.log('xx =>>', obj)
				if (obj.type === 'Mesh' && obj.name !== `${index}`)
					// obj.visible = false;
					obj.position.z = 10000;
			})
			: this.scene.traverse((obj) => {
				console.log('xx =>>', obj)
				if (obj.type === 'Mesh')
					// obj.visible = true;
					// obj.position.z = 1;
					gsap.to(obj.position, {
						duration: 0.8,
						z: 1,
						ease: 'power2.inout',
					})
			})

		gsap.to(this.uniforms.u_progressClick, {
			duration: 1.2,
			value: shouldZoom ? 1 : 0,
			// value: 1,
			// ease: Power2.easeInOut,
			ease: 'power2.inout',

			onComplete: () => {
				this.isZoomed = shouldZoom
				// this.hasClicked = true

				gsap.to(this.uniforms.u_progressHover, {
					duration: 1.2,
					value: shouldZoom ? 1 : 0,
					ease: 'power2.inout'
				})

				// ev('view:toggle', { shouldOpen: shouldZoom, target: this })
			},
		})


		gsap.to(this.mesh.scale, {
			duration: 1.2,
			// delay: 0.3,
			x: newScl.x,
			y: newScl.y,
			// ease: Expo.easeInOut,
			ease: 'power2.inout',

			onUpdate: () => { this.getBounds() },
		})


		gsap.to(this.mesh.position, {
			duration: 1.2,
			delay: 0.3,
			x: newPos.x,
			y: newPos.y,
			// ease: Expo.easeInOut,
			ease: 'power2.inout',
		})

		gsap.to(this.uniforms.u_hoverratio.value, {
			duration: 1.2,
			// delay: 0.3,
			x: newRatio.x,
			y: newRatio.y,
			// ease: Expo.easeInOut,
			ease: 'power2.inout',
		})

		// gsap.staggerTo(this.stgs.lines, {
		// 	duration: 1,
		// 		yPercent: shouldZoom ? 100 : 0,
		// 		ease: Expo.easeInOut,
		// 		force3D: true,
		// }, 0.35 / this.stgs.lines.length)
	}


	onMouseEnter() {
		this.isHovering = true

		if (this.isZoomed || this.hasClicked) return


		if (!this.mesh) return

		gsap.to(this.uniforms.u_progressHover, {
			value: 1,
			duration: 1,
			ease: 'power2.inout'
		});
	}

	onMouseLeave() {
		if (!this.mesh || this.isZoomed || this.hasClicked) return
		// if (!this.mesh) return


		gsap.to(this.uniforms.u_progressHover, {
			value: 0,
			// duration: 1,
			ease: 'power2.inout',
			onComplete: () => {
				this.isHovering = false
			},
		});
	}

	onMouseMove = (event: MouseEvent) => {
		if (this.isZoomed || this.hasClicked) return

		gsap.to(this.mouse, {
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
			duration: 0.5,
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
		this.getBounds()

		// const texture = this.images[0]
		// const hoverTexture = this.images[1]
		// const shape = this.images[2]

		const [texture, hoverTexture, shape] = this.images


		this.uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: this.texture },
			u_ratio: { value: getRatio(this.sizes, texture.image) },
			u_hovermap: { type: 't', value: this.hoverTexture },
			u_hoverratio: { value: getRatio(this.sizes, hoverTexture.image) },
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

		this.mesh.name = `${this.index}`

		this.scene.add(this.mesh);

	}

	onResize() {
		// location.reload()

		this.getBounds()


		if (!this.mesh) return

		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
		this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
	}

	move() {
		// if (!this.mesh) return;
		if (!this.mesh || this.isZoomed || this.hasClicked) return

		this.getBounds()

		gsap.set(this.mesh.position, {
			x: this.offset.x,
			y: this.offset.y,
		})

		gsap.to(this.mesh.scale, {
			x: this.sizes.x - this.delta,
			y: this.sizes.y - this.delta,
			z: 3,
			duration: 0.5
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


