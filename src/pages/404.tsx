import React, { FC } from 'react';
import { css } from '@emotion/react'
import styled from '@emotion/styled'

const image = '/images/clint-mckoy.jpg';

const PageHeader = styled.div`
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
	&:before {
		background: rgba(0, 0, 0, 0.5);
	}
	&:before, &:after {
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

const Center = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 3;
	transform: translate(-50%,-50%);
	text-align: center;
	color: #fff;
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
	margin-top: 20px;
	margin-bottom: 8px;
`

const description = css`
	color: #fff;
	font-size: 1.125rem;
	margin-top: 0;
	margin-bottom: 8px;
`

const ErrorPage: FC = () => {

	return (
		<PageHeader>
			<Center>
				<h1 css={title}>
					{`404`}
				</h1>
				<h2 css={subTitle}>
					{`Page not found :(`}
				</h2>
				<h4 css={description}>
					{`Looks like you got lost.`}
				</h4>
			</Center>
		</PageHeader>
	);
}

export default ErrorPage;
