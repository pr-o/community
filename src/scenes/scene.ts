import * as THREE from 'three';
import Figure from './figure';

export default class Scene {
	container!: HTMLElement | null;
	scene!: THREE.Scene;
	renderer!: THREE.WebGLRenderer;
	camera!: THREE.PerspectiveCamera;
	perspective!: number;
	figure?: Figure;
	figuresEl: NodeListOf<Element>;
	figures: Figure[] = [];
	mouse: any;
	canvasRef?: any;

	constructor() {
		this.perspective = 800;
		this.container = document.getElementById('stage');

		this.scene = new THREE.Scene();
		this.mouse = new THREE.Vector2(0, 0);

		// this.initLights();
		// this.initCamera();

		this.figuresEl = document.querySelectorAll('.image-tiles');
		this.start();

		// this.figure = new Figure('image-tile', this.scene, () => {
		// 	this.update();
		// });
	}

	start() {
		this.initCamera();
		this.initLights();

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container as HTMLCanvasElement,
			alpha: true,
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.figures = Array.from(this.figuresEl).map((el) => new Figure(el, this.scene, this.camera));

		this.update();
	}

	getScene() {
		return this.scene;
	}

	getRenderer() {
		return this.renderer;
	}

	getCamera() {
		return this.camera;
	}

	initLights() {
		const ambientlight = new THREE.AmbientLight(0xffffff, 2);
		this.scene.add(ambientlight);
	}

	initCamera() {
		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI;

		this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0, 0, this.perspective);
	}

	update() {
		// this.figure.update();

		requestAnimationFrame(this.update.bind(this));
		// this.figures?.forEach((figure) => figure.update());

		this.renderer.render(this.scene, this.camera);
	}
}
