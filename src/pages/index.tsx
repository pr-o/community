import React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { Grid, Button } from '@material-ui/core';
import { ThumbUpAlt } from '@material-ui/icons';
import Parallax from 'components/Parallax/Parallax';

import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'

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
			<Header color={'trasnparent'} changeColorOnScroll={{
				height: 200,
				color: '#008080'
			}} />
			<Parallax image={headerImage}
				title={`Community`}
				subTitle={`A badass 😎  online community`}
				descriptions={[`Built on Next.js`, `Blazing fast ⚡️ with server-side rendering`]}
			/>

			<div css={theme.mainRaised}>
				<div css={theme.container}>
					<Grid container justify="center">
						<Grid item md={12} sm={12}>
							<br />
							<h2 css={theme.title}>Work in progress ...</h2>
							<br />
						</Grid>
						<Grid item md={12} sm={12}>
							<Image src={img} width={600} height={600} alt="" />
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item md={12} lg={12}>
						</Grid>
					</Grid>
				</div>
			</div>
			<div css={theme.preFooter}>
				<Grid container justify="center">
					<Grid item md={12} sm={12}>
						<div>
							<h2>Support</h2>
							<Link href="/b/test" key="test" passHref>
								<Button
									color="secondary"
									variant="contained"
								>
									Cheer &nbsp; <ThumbUpAlt />
								</Button>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
			<Footer />
		</div>
	);
}

export default Home;
