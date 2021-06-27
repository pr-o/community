import React, { FC } from 'react';
import styled from '@emotion/styled';

interface ComponentsProps {
	image: string;
	title: string;
	subTitle: string;
	descriptions: Array<string>;
}

interface ContainerProps {
	image?: string;
	transform?: string;
	backgroundFilter?: string;
}

const ParallaxContainer = styled.div<ContainerProps>`
	height: 90vh;
	max-height: 1600px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	color: #fff;
	background-image: url(${(props) => props.image});
	background-position: center top;
	background-size: cover;
	transform: ${(props) => props.transform};
	z-index: 1;
	&::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 0;
		background: ${(props) => props.backgroundFilter} // apply filters such as "rgba(0, 0, 0, 0.2);"
	}
`;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
`
const Title = styled.h1`
	font-size: 4rem;
	font-weight: 900;
	margin-bottom: 4rem;
`
const SubTitle = styled.h2`
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
`
const Description = styled.h3`
	font-size: 1.25rem;
	font-weight: 500;
	margin-bottom: .125rem;
`
const Badge = styled.span`
	display: inline-block;
	position: relative;
	font-size: 4.25rem;
	font-weight: 500;
`

const Parallax: FC<ComponentsProps> = ({ image, title, subTitle, descriptions }) => {
	let windowScrollTop = 0;
	const [backgroundFilter, setBackgroundFilter] = React.useState('translate3d(0,' + windowScrollTop + 'px, 0)');

	React.useEffect(() => {
		if (window.innerWidth >= 768) {
			window.addEventListener('scroll', resetTransform);
		}
		return function cleanup() {
			if (window.innerWidth >= 768) {
				window.removeEventListener('scroll', resetTransform);
			}
		};
	});

	const resetTransform = () => {
		var windowScrollTop = window.pageYOffset / 3;
		setBackgroundFilter('translate3d(0,' + windowScrollTop + 'px, 0)');
	};

	return (
		<ParallaxContainer image={image} backgroundFilter={backgroundFilter}>
			<Container>
				<Title>
					{title}
				</Title>
				<SubTitle>
					{subTitle}
				</SubTitle>
				{descriptions?.map((description: any, index: number) => <Description key={index}>{description}</Description>)}
			</Container>
		</ParallaxContainer>
	);
}

export default Parallax;
