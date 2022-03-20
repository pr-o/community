const IMAGES_DIR = '/images/about/images';
const HOVER_IMAGES_DIR = '/images/about/hover-images';
const SHAPE_IMAGES_DIR = '/images/about/shapes';

export const imagePaths = [
	'lemonade.jpeg',
	'sk.jpeg',
	'vr-ar-healthcare.jpeg',
	'trojan.jpeg',
	'dropcare.jpeg',
	'sds-system.jpeg',
	'matlab.jpeg',
	'league-of-legends.jpeg',
	'overwatch.jpeg',
].map((path) => `${IMAGES_DIR}/${path}`);

export const hoverImagePaths = [
	'day1-company.jpeg',
	'sk-my-suni.jpeg',
	'cnuh.jpeg',
	'university-of-california.jpeg',
	'doctors-fab.jpeg',
	'mediazen.jpeg',
	'korea-university.jpeg',
	'league-of-legends-teams.jpeg',
	'overwatch-teams.jpeg',
].map((path) => `${HOVER_IMAGES_DIR}/${path}`);

export const fragmentShaderNames = [
	'shapeShader',
	'trippyShader',
	'trippyShader',
	'trippyShader',
	'waveShader',
	'gooeyShader',
	'revealShader',
	'waveShader',
	'waveShader',
];

export const shapeImagePaths = [
	'sung-cursive.jpeg',
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
].map((path) => (path ? `${SHAPE_IMAGES_DIR}/${path}` : null));

export const titles = [
	'title',
	'title',
	'title',
	'title',
	'title',
	'title',
	'title',
	'title',
	'title',
];

export const texts = ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'];
