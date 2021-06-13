import React, { useState } from 'react'
import Link from 'next/link';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from 'lib/redux/modules';
import { setTheme, Theme } from 'lib/redux/modules/theme';

// import { useRouter } from 'next/router';
// import HeaderLinks from './HeaderLinks';

import { makeStyles, Theme as MuiTheme, createStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Menu, MenuItem, Button, IconButton, Badge } from '@material-ui/core';
import {
	Mail as MailIcon,
	MoreVert as MoreIcon,
	Brightness4 as DarkThemeIcon,
	Brightness7 as LightThemeIcon,
	AccountCircle as AccountCircleIcon,
	Notifications as NotificationsIcon,
} from '@material-ui/icons';

const BRAND = 'Community'

const useStyles = makeStyles((muiTheme: MuiTheme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
		toolbar: {
			backgroundColor: '#008080',
			padding: '0 1rem',
			[muiTheme.breakpoints.up('sm')]: {
				padding: '0 5rem',
      },
		},
		button: {
			borderRadius: '10px',
		},
    title: {
			'&, & a': {
				display: 'block',
				color: '#fff',
				fontSize: '18px',
				fontWeight: 700,
				lineHeight: '30px',
				minWidth: 'unset',
				letterSpacing: 'unset',
				whiteSpace: 'nowrap',
				textTransform: 'none',
			}
    },
    sectionDesktop: {
      display: 'none',
      [muiTheme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [muiTheme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);

export default function PrimarySearchAppBar() {

	const dispatch = useDispatch();

	const { theme } = useSelector(
		(state: RootState) => ({
			theme: state.theme
		}),
		shallowEqual
	);

	const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const toggleTheme = () => {
		theme.theme === Theme.light
			? dispatch(setTheme(Theme.dark)) && document.body.classList.replace('light', 'dark')
			: dispatch(setTheme(Theme.light)) && document.body.classList.replace('dark', 'light')
	}

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show mails" color="inherit">
          <Badge badgeContent={3} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show notifications" color="inherit">
          <Badge badgeContent={7} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Button className={classes.button}>
						<Link href="/">
							<a className={classes.title}>
								{`${BRAND}`}
							</a>
						</Link>
					</Button>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show mails" color="inherit">
              <Badge badgeContent={3} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show notifications" color="inherit">
              <Badge badgeContent={7} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
						<IconButton onClick={toggleTheme} aria-label="Toggle theme" color="inherit">
							{theme.theme === 'light' ? <LightThemeIcon /> : <DarkThemeIcon />}
						</IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      { renderMobileMenu }
      { renderMenu }
    </div>
  );
}
