import React from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import CardList from 'components/Demo/Card/CardList'

const BRAND = 'Community'
const img = '/images/a-platform-for-builders.webp';
const headerImage = '/images/a-thousand-paths-dark.jpg';

const Brand = styled.p`
	text-align: center;
	font-size: 4rem;
	font-weight: 600;
`

const Home = () => {
	const theme: any = useTheme();

	return (
		<div css={theme.body}>
			<Header
				color={'#005050'}
				changeColorOnScroll={{
					height: 200,
					color: '#008080',
				}}
			/>
			<Container>

				<div css={theme.mainRaised}>
					{/* <div css={theme.container}> */}
					<main>
						<CardList />
					</main>

				</div>
				{/* </div> */}
			</Container>
			<Footer />
		</div>
	);
}

export default Home;

const Container = styled.div`
	display: flex;
	padding: 10rem 5rem 10rem 10rem;
	min-height: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: space-around;
	@media (max-width: 807px) {
		padding: 10rem 1rem;
		align-items: center;
	}
`;
