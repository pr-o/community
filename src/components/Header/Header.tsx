import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from 'lib/redux/modules';
import { setTheme, Theme } from 'lib/redux/modules/theme';
import styled from '@emotion/styled';
import useCheckMobile from 'lib/hooks/useCheckMobile';
// import HeaderLinks from 'components/Header/HeaderLinks';
import Nav from 'components/Header/HeaderLinks';

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
	ThreeDRotation as ThreeDRotationIcon
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

const Header = ({ fixed, color, changeColorOnScroll }: Props) => {

	const isMobile = useCheckMobile();
	const [headerColor, setHeaderColor] = useState(color);
	const [padding, setPadding] = useState('1.5rem');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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


	const { theme } = useSelector(
		(state: RootState) => ({ theme: state.theme }), shallowEqual
	);


	return (
		<StyledHeader color={headerColor} padding={padding}>
			<Left>
				<Brand>
					<Link href="/" >
						{BRAND}
					</Link>
				</Brand>
			</Left>
			<Center>
				{/*
					@TODO: SearchBox
				*/}
			</Center>
			<Right>
				<Nav />
				{/* {isMobile
					? (
						<MobileMenu >
							<MenuIcon onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
							<HeaderLinks mobileMenuOpen={mobileMenuOpen} />
						</MobileMenu>
					)
					: (
						<Menus>
							<HeaderLinks />
						</Menus>
					)
				} */}
			</Right>
		</StyledHeader>
	)
}

export default Header;

const StyledHeader = styled.header<HeaderProps>`
	position: fixed;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	width: 100%;
	min-height: 3rem;
	padding: .75rem clamp(1rem, 4%, 10rem);
	padding-top: ${({ padding }) => padding ? padding : '.75rem'};
	padding-bottom: ${({ padding }) => padding ? padding : '.75rem'};
	margin-bottom: 1rem;
	color: #fff;
	background-color: ${({ color }) => color};
	box-shadow: 0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15);
	transition: all 300ms ease 0s;
	z-index: 999;
	& nav > ul {
		display: flex;
		list-style: none;
	}
`;

const Left = styled.div`
	display: grid;
	grid-column: 1 / 2;
	justify-content: flex-start;
`;

const Center = styled.div`
	display: grid;
	grid-column: 2 / 3;
`;

const Right = styled.div`
	display: grid;
	grid-column: 3 / 4;
	justify-content: flex-end;
`;

const Brand = styled.div`
	font-size: 1.25rem;
	font-weight: 100;
	line-height: 2rem;
	@media (max-width: 807px) {
		display: none;
	}
`;

const MobileMenu = styled.div`
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
