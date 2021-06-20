import React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { Grid, Button } from '@material-ui/core';
import { ThumbUpAlt } from '@material-ui/icons';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header'

const BRAND = 'Community'
const img = '/images/a-platform-for-builders.webp';

const Brand = styled.p`
	text-align: center;
	font-size: 4rem;
	font-weight: 600;
`

const Home = () => {
	const theme: any = useTheme();

	return (
		<>
		<Header />
		<div css={theme.body}>
			<div css={theme.container}>
				<Grid container justify="center">
					<Grid item>
						<div>
							<Brand>{`${BRAND}`}</Brand>
							<h2>
								A badass {' 😎 '} online community
							</h2>
							<h4>
								Based on Next.js &amp; React &amp; Material Design
							</h4>
							<h4>
								Blazing fast{' ⚡️ '} with server-side rendering
							</h4>
						</div>
					</Grid>
				</Grid>
			</div>
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
									 Cheer &nbsp; <ThumbUpAlt/>
								</Button>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
			{/*
				// TODO
				// Footer
			 */}
		</div>
		</>
	);
}

export default Home;
