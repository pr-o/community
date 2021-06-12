import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { css } from '@emotion/react'

const image = '/images/clint-mckoy.jpg';

const pageHeader = css`
	min-height: 100vh;
	height: auto;
	display: inherit;
	position: relative;
	margin: 0;
	padding: 0;
	border: 0;
	align-items: center;
	background-image: url(${image});
	background-size: cover;
	background-position: top center;
	&:before: {
		background: rgba(255, 0, 0, 0.5, 0.5);
	},
	&:before, &:after: {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		display: block;
		left: 0;
		top: 0;
		content: '';
	}
`

const contentCenter = css`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 3;
	transform: translate(-50%,-50%);
	text-align: center;
	color: whiteColor;
	padding: 0 15px;
	width: 100%;
	max-width: 880px;
`

const title = css`
	color: #fff;
	text-decoration: none;
	font-size: 13.7em;
	letter-spacing: 14px;
	font-weight: 700;
	margin-top: 30px;
	margin-bottom: 25px;
	min-height: 32px;
	font-family: 'Roboto Slab', 'Times New Roman', serif;
`;

const subTitle = css`
	color: #fff;
	font-size: 3em;
	padding-top: 10px;
	margin-bottom: 8px;
`

const description = css`
	color: #fff;
	font-size: 1.125rem;
	margin-top: 0;
	margin-bottom: 8px;
`

export default function ErrorPage() {
	React.useEffect(() => {
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
	});

	// const classes = useStyles();

	return (
		<>
			<div
			css={pageHeader}
				// className={classes.pageHeader}
				// style={{
				// 	backgroundImage: `url(${image})`,
				// 	backgroundSize: 'cover',
				// 	backgroundPosition: 'top center'
				// }}
			>
				<div css={contentCenter}>
					<Grid container>
						<Grid md={12}>
							<h1 css={title}>404</h1>
							<h2 css={subTitle}>Page not found :(</h2>
							<h4 css={description}>
								Looks like you got lost.
							</h4>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
}
