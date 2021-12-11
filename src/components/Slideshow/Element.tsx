import { useEffect, useState, useRef, Fragment } from 'react';
import vertexShader from 'scenes/glsl/vertexShader.glsl';
import fragmentShader from 'scenes/glsl/fragmentShader.glsl';

import styled from '@emotion/styled';

import {
	MeshBasicMaterial,
	TextureLoader,
	BoxGeometry,
	Scene,
	Mesh,
	Vector2,
	PlaneBufferGeometry,
	ShaderMaterial,
	MathUtils,
	Clock
} from 'three';

import { getRatio } from 'utils/three'

const blankSVG = `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`
const pathImg = '/images/a-thousand-paths-dark.jpg';
const pathHoverImg = '/images/clint-mckoy.jpg'

const length = 6

interface Props {
	scene: Scene | null,
	images: Array<{ image: string, hoverImage: string }>
	mouse: Vector2;
	sizes: Vector2;
	offset: Vector2
	clock: Clock;
}

const Element: React.FC<Props> = ({ scene, mouse, images, sizes, offset, clock }) => {
	const [isHovering, setIsHovering] = useState<boolean[]>(new Array(length).fill(false))
	const [imageObj, setImageObj] = useState<any[]>([])
	const init = () => {

	}

	// const image = loader.load(this.$image?.dataset.src as string, () => this.start());
	// const hoverImage = loader.load(this.$image?.dataset.hover as string);


	const loader = new TextureLoader()

	const createLineMesh = () => {
		const geometry = new BoxGeometry(10, 10, 3);
		const material = new MeshBasicMaterial({ color: 0x008080 });
		const mesh = new Mesh(geometry, material);
		mesh.scale.set(2.5, 100, 1);
		mesh.position.set(0, 0, 0);
		mesh.castShadow = true;
		return mesh
	}

	const createMesh = (image, hoverImage) => {

		const texture = image;
		const hoverTexture = hoverImage;

		const uniforms = {
			u_alpha: { value: 1 },
			u_map: { type: 't', value: texture },
			u_ratio: { value: getRatio(sizes, { width: 600, height: 800 }) },
			u_hovermap: { type: 't', value: hoverTexture },
			u_hoverratio: { value: getRatio(sizes, { width: 600, height: 800 }) },
			u_shape: { value: hoverTexture },
			u_mouse: { value: mouse },
			u_progressHover: { value: 0 },
			u_progressClick: { value: 0 },
			u_time: { value: clock.getElapsedTime() },
			u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
		};

		const geometry = new PlaneBufferGeometry(1, 1, 1, 1);
		const material = new ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			defines: {
				PR: window.devicePixelRatio.toFixed(1),
			},
			// side: THREE.DoubleSide,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.set(offset.x, offset.y, 0);
		mesh.scale.set(sizes.x, sizes.y, 1);

		return mesh
	}

	useEffect(() => {

		setImageObj(
			images.reduce((acc: any, image) => {
				return [
					...acc,
					{
						image: loader.load(image.image),
						hoverImage: loader.load(image.hoverImage)
					}
				]
			}, [])
		)

		// const meshes = imageObj.map((image) => createMesh(image.image, image.hoverImage))
		// meshes.forEach((mesh) => scene?.add(mesh))


	}, []);

	useEffect(() => {
		const lineMesh = createLineMesh()

		scene?.add(lineMesh)

		console.log('imageObj =>', imageObj)
	}, [scene])


	useEffect(() => {

		console.log('imageObj =>', imageObj)
	}, [imageObj])

	const update = () => {

	}

	return (
		<Fragment>
			{images?.map(({ image, hoverImage }, index) => (
				<Wrapper key={`image-tile-${index}`}>
					<ArticleTile>
						<a href="#">
							<FigureTile>
								<ImageTile
									id='image-tile'
									// src={blankSVG}
									src={image}
									data-src={image}
									data-hover={hoverImage}
									alt="Woods Forests" />

							</FigureTile>
							<TileContent>
								<TileTitle>{` Woods & `}<TitleOffset>Forests</TitleOffset></TileTitle>
								<TitleCTA>
									<ButtonInline>See more</ButtonInline>
								</TitleCTA>
							</TileContent>
						</a>
					</ArticleTile>
				</Wrapper>
			))}
		</Fragment>
	);
};

export default Element;


const Wrapper = styled.li`
	/* flex: 0 0 auto; */
	display: flex;
	align-items: center;
	justify-content: center;
	/* position: relative; */
	width: 100%;
	/* height: 100%; */
	z-index: 933;
	min-width: 25rem;
	max-width: 40vmin;
	margin-left: 20rem;
	cursor: pointer;
	&:last-child {
		padding-right: 20rem;
		box-sizing: content-box;
	}

	&:nth-child(1n) {
		.tile__content {
			color: red;
		}
	}
`

const ArticleTile = styled.section`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

`

const FigureTile = styled.section`
	position: relative;
	width: 100%;

	&::before {
		content: '';
		display: block;
		/* padding-top: 10%; */
	}
`

const TileContent = styled.div`

	position: absolute;
	bottom: 3.6rem;
	right: 0;
	/* width: 100%; */
	width: 100%;

	font-size: 1.4rem;

	transition: color .3s;
	color: #990000;
		&:hover {
		color: #004040;
	}
`

const TileTitle = styled.h2`
	margin-left: -10%;
	white-space: nowrap;
	position: relative;
	z-index: 99;
	font-size: calc(2rem + 2.5vw);
	/* font-size: calc(10rem + 3vw); */
`

const TitleOffset = styled.span`
	display: block;
	margin-left: 15%;
`

const TitleCTA = styled.div`
	display: block;
	margin-top: 2rem;
	margin-left: 6.4%;
	line-height: 1.5;
`
const ButtonInline = styled.span`
	display: inline-block;
	line-height: 1.5;
	border-bottom: .1rem solid;
`

const ImageTile = styled.img`
	/* display: block; */
	position: block;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	object-fit: cover;
	object-position: center;
	/* transition: opacity .3s; */
	/* border: 4px dotted #008080; */
`

