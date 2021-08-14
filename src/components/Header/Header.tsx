import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from 'lib/redux/modules';
import { setTheme, Theme } from 'lib/redux/modules/theme';
import styled from '@emotion/styled';

import {
	Menu as MenuIcon,
	GitHub as GitHubIcon,
	ViewDay as ViewDayIcon,
	ViewCarousel as ViewCarouselIcon,
	Brightness4 as DarkThemeIcon,
	Brightness7 as LightThemeIcon,
	AccountCircle as AccountCircleIcon,
	Mail as MailIcon,
	MoreVert as MoreIcon,
	Notifications as NotificationsIcon,
} from '@material-ui/icons';

interface Props {
	fixed?: boolean;
	color: string;
	changeColorOnScroll: {
		height: number;
		color: string;
	}
};

interface HeaderProps {
	color?: string;
	padding?: string;
}

const BRAND = 'Community'

const StyledHeader = styled.header<HeaderProps>`
	position: fixed;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	width: 100%;
	min-height: 3rem;
	padding: .75rem clamp(1rem, 4%, 10rem);
	padding-top: ${props => props.padding ? props.padding : '.75rem'};
	padding-bottom: ${props => props.padding ? props.padding : '.75rem'};
	margin-bottom: 1rem;
	color: #fff;
	background-color: ${props => props.color};
	box-shadow: 0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15);
	transition: all 300ms ease 0s;
	z-index: 999;
	& nav > ul {
		list-style: none;
		& > li {
			display: inline-block;
		}
	}
`;

const Left = styled.div`
	display: grid;
	grid-column: 1 / 3;
	justify-content: start;

`;
const Center = styled.div`
	display: grid;	
	grid-column: 3 / 4;
`;
const Right = styled.div`
	display: grid;
	grid-column: 4 / 6;
	justify-content: end;
`;
const Brand = styled.div`
	font-size: 1.25rem;
	font-weight: 100;
	line-height: 2rem;
	@media (max-width: 807px) {
		display: none;
	}
`;
const HamburgerMenu = styled.div`
	display: none;
	align-items: center;
	line-height: 2rem;
	@media (max-width: 807px) {
		display: flex;
	}
`
const Menus = styled.div`
	display: flex;
	@media (max-width: 807px) {
		display: none;
	}
`
const Menu = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin: 0 .5rem;
	font-size: .875rem;
	line-height: 1rem;
	color: #fff;
`;

const Header = ({ fixed, color, changeColorOnScroll }: Props) => {

	const [headerColor, setHeaderColor] = useState(color);
	const [padding, setPadding] = useState('1.5rem');

	useEffect(() => {
		if (!changeColorOnScroll) return;
		window.addEventListener('scroll', changeHeaderColor);
		return () => window.removeEventListener('scroll', changeHeaderColor);
	})

	const changeHeaderColor = () => {
		const windowsScrollTop = window.pageYOffset;
		if (windowsScrollTop > changeColorOnScroll.height) {
			setHeaderColor(changeColorOnScroll.color)
			setPadding('.75rem')
		}
		if (windowsScrollTop <= changeColorOnScroll.height) {
			setHeaderColor(color)
			setPadding('1.25rem')
		}
	}

	const dispatch = useDispatch();

	const { theme } = useSelector(
		(state: RootState) => ({
			theme: state.theme
		}),
		shallowEqual
	);

	const toggleTheme = () => {
		theme.theme === Theme.light
			? dispatch(setTheme(Theme.dark)) && document.body.classList.replace('light', 'dark')
			: dispatch(setTheme(Theme.light)) && document.body.classList.replace('dark', 'light')
	}


	return (
		<StyledHeader color={headerColor} padding={padding}>
			<Left>
				<Brand>
					<Link href="/" >
						{BRAND}
					</Link>
				</Brand>
				<HamburgerMenu>
					<MenuIcon />
				</HamburgerMenu>
			</Left>
			<Center>
				{/*
					TODO: SearchBox
				*/}
			</Center>
			<Right>
				<Menus>
				<nav>
					<ul>
						<li>
							<Menu>
								<ViewDayIcon />
								AAA
							</Menu>
						</li>
						<li>
							<Menu>
								<ViewCarouselIcon />
								BBB
							</Menu>
						</li>
						<li>
							<Menu onClick={() => toggleTheme()}>
								<Link href="/github/whoisbusy" passHref>
									<a><GitHubIcon /></a>
								</Link>
							</Menu>
						</li>
						<li>
							<Menu onClick={() => toggleTheme()}>
								{theme.theme === 'light' ? <LightThemeIcon /> : <DarkThemeIcon />}
							</Menu>
						</li>
						<li>
							<Menu>
								<AccountCircleIcon />
							</Menu>
						</li>
					</ul>
				</nav>
				</Menus>
			</Right>
		</StyledHeader>
	)
}
export default Header;
