import React, { FC } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { COLORS } from 'constants/university'

interface AnchorProps {
	color: string;
}

const StyledFooter = styled.footer`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
`
const Brand = styled.div`
	display: flex;
	justify-content: flex-start;
	width: clamp(5rem, 10ch, 10rem);
	font-size: 1.25rem;
	font-weight: 100;
	line-height: 2rem;
	@media (max-width: 807px) {
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
	}
`;

const Center = styled.div`
	display: flex;
	@media (max-width: 807px) {
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
	}
`;
const Copyright = styled.div`
	display: flex;
	justify-content: flex-end;
	align-content: center;
	width: clamp(10rem, 30ch, 20rem);
	font-size: .75rem;
	line-height: 2rem;
	& > a {
		display: flex;
		position: relative;
		font-size: .9375rem;
		line-height: .75rem;
		font-style: italic;
		font-weight: 900;
		color: #008080;
		margin-left: 0.375rem;
		padding: .25rem .25rem;
		line-height: 1.25rem;
		z-index: 0;
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			transform-origin: bottom;
			transform: scaleY(0.1);
			background: #008080;
			mix-blend-mode: difference;
			transition: transform .35s;
			z-index: 1;
		}
		&:focus, &:hover {
			&::after {
				transform: none;
			}
		}
	}
	@media (max-width: 807px) {
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
	}
`;
const Anchor = styled.a<AnchorProps>`
	color: ${props => props.color};
`

const Item = styled.div`
	display: flex;
	width: clamp(5rem, 5ch, 10rem);
	margin: 0 clamp(0.25rem, 0.5rem, 1rem);
	font-size: .875rem;
	line-height: 1rem;
`;

const Footer: FC = () => {
	return (
		<StyledFooter>
			<Brand>
				<Link href="/" passHref>
					Community
				</Link>
			</Brand>
			<Center>
				<Item>
					<Anchor
						href="https://www.usc.edu"
						target="_blank"
						rel="noopener noreferrer"
						color={COLORS['USC'].primary}
					>
						USC
					</Anchor>
				</Item>
				<Item>
					<Anchor
						href="https://www.ucla.edu"
						target="_blank"
						rel="noopener noreferrer"
						color={COLORS['UCLA'].primary}
					>
						UCLA
					</Anchor>
				</Item>
				<Item>
					<Anchor
						href="https://www.caltech.edu"
						target="_blank"
						rel="noopener noreferrer"
						color={COLORS['CalTech'].primary}
					>
						CalTech
					</Anchor>
				</Item>
			</Center>
			<Copyright>
				&copy; {`${new Date().getFullYear()}. made with  ❤️  by`}
				<a
					// href="https://www.sunghah.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					{'Sung'}
				</a>
			</Copyright>
		</StyledFooter>
	);
};

export default Footer;
