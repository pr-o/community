import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from 'lib/redux/modules';
import { setTheme, Theme } from 'lib/redux/modules/theme';
import styled from '@emotion/styled';

import {
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
	paddingTop?: string;
}

const BRAND = 'Community'

const StyledHeader = styled.header<HeaderProps>`
	position: fixed;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	min-height: 3rem;
	padding: 1.725rem 10rem 1rem;
	padding-top: ${props => props.paddingTop ? props.paddingTop : '1.725rem'};
	margin-bottom: 1rem;
	color: #fff;
	background-color: ${props => props.color};
	box-shadow: 0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15);
	transition: all 250ms ease 0s;
	z-index: 999;
`;
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
const RightMenus = styled.div`
	display: flex;
	justify-content: flex-end;
`;
const Menu = styled.div`
	display: flex;
	width: clamp(5rem, 5ch, 10rem);
	margin: 0 clamp(0.25rem, 0.5rem, 1rem);
	font-size: .875rem;
	line-height: 1rem;
	color: #fff;

`;

const Header = ({ fixed, color, changeColorOnScroll }: Props) => {

	const [headerColor, setHeaderColor] = useState(color);
	const [paddingTop, setPaddingTop] = useState('2rem');

	useEffect(() => {
		if (!changeColorOnScroll) return;
		window.addEventListener('scroll', changeHeaderColor);
		return () => window.removeEventListener('scroll', changeHeaderColor);
	}, [])

	const changeHeaderColor = () => {
		const windowsScrollTop = window.pageYOffset;
		if (windowsScrollTop > changeColorOnScroll.height) {
			setHeaderColor(changeColorOnScroll.color)
			setPaddingTop('1rem')
		}
		if (windowsScrollTop <= changeColorOnScroll.height) {
			setHeaderColor(color)
			setPaddingTop('1.725rem')
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
		<StyledHeader color={headerColor} paddingTop={paddingTop}>
			<Brand>
				<Link href="/" >
					Community
				</Link>
			</Brand>
			<RightMenus>
				<Menu>
					<ViewDayIcon />
					A
				</Menu>
				<Menu>
					<ViewCarouselIcon />
					B
				</Menu>
				<Menu onClick={() => toggleTheme()}>
					{theme.theme === 'light' ? <LightThemeIcon /> : <DarkThemeIcon />}
				</Menu>
				<Menu>
					<AccountCircleIcon />
				</Menu>
			</RightMenus>
		</StyledHeader>
	)
}
export default Header;
