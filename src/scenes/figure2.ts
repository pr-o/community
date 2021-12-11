import * as THREE from 'three';
import { gsap, Power2 } from 'gsap';
// import vertexShader from './glsl/vertexShader.glsl';
import vertexShader from './glsl/vertexShader.glsl';
import fragmentShader from './glsl/fragmentShader.glsl';

export default class Figure {
	$image!:
		| HTMLElement
		| (HTMLElement & {
				dataset: { src: string; hover: string; focus: boolean };
				getBoundingClientRect: () => DOMRect;
		  });
	scene: THREE.Scene;
	loader: THREE.TextureLoader;
	image?: THREE.Texture;
	hoverImage?: THREE.Texture;
	sizes: THREE.Vector2;
	offset: THREE.Vector2;
	geometry!: THREE.PlaneBufferGeometry;
	material!: THREE.MeshBasicMaterial | THREE.ShaderMaterial;
	mesh!: THREE.Mesh;
	mouse: THREE.Vector2;
	uniforms: any;
	callback?: any;
	clock: THREE.Clock;
	isHovering: boolean = false;
	raycaster: THREE.Raycaster;
	delta: number = 0;
	scroll: number = 0;
	prevScroll: number = 0;
	camera: THREE.Camera;
	INTERSECTED: any = null;

	el: any;

	constructor(el: any, scene: THREE.Scene, camera: THREE.Camera, cb: any = () => {}) {
		// this.$image = document.querySelector('.tile__image') as Element;

		// this.$image = document.getElementById(id);
		this.$image = el.querySelector('img')!;

		this.el = el;
		this.scene = scene;
		this.camera = camera;
		this.callback = cb;
		this.clock = new THREE.Clock();
		this.loader = new THREE.TextureLoader();
		this.raycaster = new THREE.Raycaster();

		this.image = this.loader.load(this.$image?.dataset.src as string, () => this.start());
		// this.image.center.set(0.5, 0.5);

		this.hoverImage = this.loader.load(this.$image?.dataset.hover as string);
		// this.hoverImage.center.set(0.5, 0.5);

		this.sizes = new THREE.Vector2(0, 0);
		this.offset = new THREE.Vector2(0, 0);

		this.mouse = new THREE.Vector2(0, 0);

		window.addEventListener('mousemove', (e) => this.onMouseMove(e));

		// this.$els = document.querySelectorAll('image-tiles')!;
		window!.onload = () => {
			el.addEventListener('mouseenter', () => this.onPointerEnter());
			el.addEventListener('mouseleave', () => this.onPointerLeave());
		};

		// const link = el.querySelector('a');
		// link.addEventListener('mouseenter', () => {
		// 	this.onPointerEnter();
		// });
		// link.addEventListener('mouseleave', () => {
		// 	this.onPointerLeave();
		// });
	}

	start() {
		this.getSizes();
		this.createMesh();
		this.callback();
	}

	move() {
		if (!this.mesh) return;

		this.getSizes();

		gsap.to(this.mesh.position, {
			x: this.offset.x,
			y: this.offset.y,
			// duration: 0.5,
		});

		gsap.to(this.mesh.scale, {
			x: this.sizes.x - this.delta,
			y: this.sizes.y - this.delta,
			z: 1,
			duration: 0.3,
		});
	}

	getSizes() {
		const { width, height, top, left }: DOMRect = this.$image.getBoundingClientRect();

		this.sizes.set(width, height);

		this.offset.set(
			left - window.innerWidth / 2 + width / 2,
			-top + window.innerHeight / 2 - height / 2
		);
	}

	getRatio = (
		{ x: w, y: h }: { x: number; y: number },
		{ width, height }: { width: any; height: any },
		r = 0
	) => {
		const m = this.multiplyMatrixAndPoint(this.rotateMatrix(THREE.MathUtils.degToRad(r)), [w, h]);
		const originalRatio = {
			w: m[0] / width,
			h: m[1] / height,
		};

		const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h);

		return new THREE.Vector2(originalRatio.w * coverRatio, originalRatio.h * coverRatio);
	};

	multiplyMatrixAndPoint = (matrix, point) => {
		const c0r0 = matrix[0];
		const c1r0 = matrix[1];
		const c0r1 = matrix[2];
		const c1r1 = matrix[3];
		const x = point[0];
		const y = point[1];
		return [Math.abs(x * c0r0 + y * c0r1), Math.abs(x * c1r0 + y * c1r1)];
	};

	rotateMatrix = (a) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];

	createMesh() {
		// this.uniforms = {
		// 	u_mouse: { value: this.mouse },
		// 	u_time: { value: this.clock.getElapsedTime() },
		// 	u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		// 	u_image: { type: 't', value: this.image },
		// 	u_imagehover: { type: 't', value: this.hoverImage },
		// 	u_progressHover: { value: 1 },
		// };

		const texture = this.image;
		const hoverTexture = this.hoverImage;

		this.uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			u_ratio: { value: this.getRatio(this.sizes, { width: 600, height: 800 }) },
			u_hovermap: { type: 't', value: hoverTexture },
			u_hoverratio: { value: this.getRatio(this.sizes, { width: 600, height: 800 }) },
			u_shape: { value: hoverTexture },
			u_mouse: { value: this.mouse },
			u_progressHover: { value: 0 },
			u_progressClick: { value: 0 },
			u_time: { value: this.clock.getElapsedTime() },
			u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		};

		this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
		this.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			defines: {
				PR: window.devicePixelRatio.toFixed(1),
			},
			// side: THREE.DoubleSide,
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.position.set(this.offset.x, this.offset.y, 0);
		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

		this.scene.add(this.mesh);
	}

	onMouseMove(event: MouseEvent) {
		// console.log('move');
		// console.log('el =>', this.el);

		gsap.to(this.mouse, {
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
			duration: 0.5,
		});

		if (this.$image?.dataset.focus) {
			gsap.to(this.mesh?.rotation, {
				x: -this.mouse.y * 0.3,
				y: this.mouse.x * (Math.PI / 8),
				duration: 0.5,
			});
		}

		if (this.isHovering) {
			gsap.to(this.uniforms.u_progressHover, {
				value: 1,
				ease: Power2.easeInOut,
				duration: 0.1,
				onStart: () => {
					this.isHovering = true;
				},
			});

			gsap.to(this.mesh.rotation, {
				x: -this.mouse.y * 0.3,
				y: this.mouse.x * (Math.PI / 8),
				duration: 0.5,
			});
		}

		// if (this.isHovering) {
		// 	gsap.to(this.mesh?.rotation, {
		// 		x: -this.mouse.y * 0.2,
		// 		y: this.mouse.x * (Math.PI / 16),
		// 		duration: 0.3,
		// 	});
		// }
	}

	onPointerEnter() {
		console.log('enter');
		this.isHovering = true;

		// this.mesh.position.set(this.offset.x, this.offset.y, 0);

		gsap.to(this.uniforms.u_progressHover, {
			value: 1,
			ease: Power2.easeInOut,
			duration: 0.5,
			onStart: () => {
				this.isHovering = true;
			},
		});
	}

	onPointerLeave() {
		console.log('leave');

		this.isHovering = false;
		// }

		gsap.to(this.uniforms.u_progressHover, {
			value: 0,
			ease: Power2.easeInOut,
			duration: 0.5,
			onComplete: () => {
				this.isHovering = false;
			},
		});
	}

	update() {
		if (!this.mesh) return;

		this.delta = Math.abs((this.scroll - this.prevScroll) * 2000);

		this.move();
		this.prevScroll = this.scroll;

		// if (!this.isHovering) return;
		this.uniforms.u_time.value += this.clock.getDelta();
	}
}
