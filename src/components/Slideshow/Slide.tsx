import { gsap } from 'gsap';
import {
	Clock,
	Scene,
	TextureLoader,
	Texture,
	PlaneBufferGeometry,
	ShaderMaterial,
	Mesh,
	MeshPhongMaterial,
	Vector2
} from 'three';
import Scrollbar from 'smooth-scrollbar'
import { getRatio } from 'utils/three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export interface OnClickTileDetail {
	target: Slide | null;
	open: boolean;
}

export default class Slide {
	scene: Scene;
	anchorElement: HTMLAnchorElement;
	mainImage: HTMLImageElement;
	detailsElement: HTMLDivElement;
	title: string;
	subtitle: string;
	text: HTMLSpanElement;
	images: Array<Texture> = [];
	sizes: any;
	offset: any;
	vertexShader: string;
	fragmentShader: string;
	clock: any;
	mouse: any;
	delta: number = 0;
	hasClicked: boolean = false;
	selected: boolean = false;
	isZoomed: any = false;
	loader: any;
	mesh: any;
	uniforms: any;
	scroll: number = 0;
	scrollbar: any;
	prevScroll: number = 0;
	isHovering: boolean = false;
	detailView: boolean = false;
	font: any;
	titleMesh: any;
	subtitleMesh: any;

	constructor($el: any, scene: any, imagePaths: Array<string | null>, fragmentShader: string, vertexShader: string, title: string, subtitle: string) {
		this.scene = scene
		this.anchorElement = $el.querySelector('a')
		this.mainImage = $el.querySelector('img')
		this.title = title
		this.subtitle = subtitle
		this.detailsElement = $el.querySelector('#details')

		this.text = $el.querySelector('h4')
		this.loader = new TextureLoader()
		this.sizes = new Vector2(0, 0)
		this.offset = new Vector2(0, 0)

		this.vertexShader = vertexShader
		this.fragmentShader = fragmentShader

		this.clock = new Clock()
		this.mouse = new Vector2(0, 0)

		this.bindEvent()

		this.preload(imagePaths, () => { this.init() })
	}


	createText() {
		const fontLoader = new FontLoader();

		const size = 70
		const height = 20
		const curveSegments = 4;
		const bevelThickness = 2
		const bevelSize = 1.5;
		const bevelEnabled = true;

		const materials = [
			new MeshPhongMaterial({ color: 0x004040, flatShading: true }), // front
			new MeshPhongMaterial({ color: 0x002020 }) // side
		];


		fontLoader.load('/fonts/optimer_bold.typeface.json',
			(font) => {
				const titleGeometry = new TextGeometry(this.title, {
					font,
					size: 60,
					height,
					curveSegments,
					bevelThickness,
					bevelSize,
					bevelEnabled,
				});

				const titleMesh = new Mesh(titleGeometry, materials);

				titleMesh.position.x = -window.innerWidth * .45;
				titleMesh.position.y = window.innerHeight * .05;
				titleMesh.position.z = 1;

				titleMesh.rotation.x = 0;
				titleMesh.rotation.y = 0; //Math.PI * 2.2;

				titleMesh.visible = false
				this.titleMesh = titleMesh
				this.scene.add(titleMesh)

				const subtitleGeometry = new TextGeometry(this.subtitle, {
					font,
					size: 30,
					height,
					curveSegments,
					bevelThickness,
					bevelSize,
					bevelEnabled,
				});
				const subtitleMesh = new Mesh(subtitleGeometry, materials);

				subtitleMesh.position.x = -window.innerWidth * .40;
				subtitleMesh.position.y = window.innerHeight * -0.05;
				subtitleMesh.position.z = 1;

				subtitleMesh.rotation.x = 0;
				subtitleMesh.rotation.y = Math.PI * 4;

				subtitleMesh.visible = false
				this.subtitleMesh = subtitleMesh
				this.scene.add(subtitleMesh)
			});



	}


	bindEvent() {
		document.addEventListener('onClickTile', (({ detail }: CustomEvent) => this.zoom(detail)) as EventListener)

		document.addEventListener('onClickClose', () => this.zoom({ target: null, open: false }))


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

	zoom({ target, open }: OnClickTileDetail) {

		const shouldZoom = target === this

		const delay = shouldZoom ? 0.4 : 0
		const duration = 1.2

		const newScale = {
			x: shouldZoom ? window.innerWidth * 0.45 : this.sizes.x,
			y: shouldZoom ? window.innerHeight - 150 : this.sizes.y,
		}

		const newPosition = {
			x: shouldZoom ? window.innerWidth / 2 - window.innerWidth * 0.05 - this.sizes.x * 0.95 : this.offset.x,
			y: shouldZoom ? -20 : this.offset.y,
		}

		const newRatio = getRatio(newScale, this.images[1].image)


		this.hide(!shouldZoom, !open)


		setTimeout(() => {
			this.titleMesh.visible = shouldZoom ? true : false
			this.subtitleMesh.visible = shouldZoom ? true : false
		}, shouldZoom ? 1000 : 500)



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
			x: newScale.x,
			y: newScale.y,
			ease: 'expo.inOut',
			onUpdate: () => { this.getBounds() },
		})


		gsap.to(this.mesh.position, {
			delay,
			duration,
			x: newPosition.x,
			y: newPosition.y,
			ease: 'expo.inOut',
		})

		gsap.to(this.uniforms.u_hoverratio.value, {
			delay,
			duration,
			x: newRatio.x,
			y: newRatio.y,
			ease: 'expo.inOut',
		})

	}

	onMouseEnter() {
		if (!this.mesh) return;

		if (this.isZoomed || this.hasClicked) return;

		gsap.to(this.uniforms.u_progressHover, {
			value: 1,
			duration: 1,
			ease: 'power2.inout',
			onUpdate: () => { this.isHovering = true }
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


	preload(imagePaths: Array<string | null>, allImagesLoadedCallback: any) {
		let loadedCounter = 0
		const toBeLoadedNumber = imagePaths.length
		const preloadImage = (imagePath: any, anImageLoadedCallback: any) => {
			const texture = this.loader.load(imagePath, anImageLoadedCallback)
			texture.center.set(0.5, 0.5)
			this.images.push(texture)
		}

		imagePaths.forEach((path: any, i: number) => {
			preloadImage(path, () => {
				loadedCounter += 1
				if (loadedCounter === toBeLoadedNumber) {
					allImagesLoadedCallback()
				}
			})
		})
	}

	init() {
		this.createText()

		const [texture, hoverTexture, shape] = this.images

		this.getBounds()

		this.uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			u_ratio: { value: getRatio(this.sizes, texture.image) },
			u_hovermap: { type: 't', value: hoverTexture },
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
			vertexShader: this.vertexShader,
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


