import React, { FC } from 'react'
import ReactDOM from 'react-dom';
import Head from 'next/head';
import Router from "next/router";
import { AppProps } from 'next/app'
import { useSelector, shallowEqual } from 'react-redux';
import { wrapper } from 'lib/redux/store';
import { RootState } from 'lib/redux/modules';
import { ThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from 'assets/jss/themes';
import RouteChange from "components/RouteChange/RouteChange";
import 'styles/globals.css'

const showTransitionAnimation = (path: string) => {
	ReactDOM.render(
		<RouteChange path={path} />,
		document.getElementById('route-transition')
	);
}

const hideTransitionAnimation = () => {
	ReactDOM.unmountComponentAtNode(
		document.getElementById('route-transition')!
	);
}

Router.events.on('routeChangeStart', (path) => showTransitionAnimation(path))
Router.events.on('routeChangeComplete', () => hideTransitionAnimation())
Router.events.on('routeChangeError', () => hideTransitionAnimation())

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { theme } = useSelector(
		(state: RootState) => ({
			theme: state.theme
		}),
		shallowEqual
	);

  const createComment = () => {
    const comment = document.createComment(`
      =========================================================
      * Unnamed (yet) community
      =========================================================

			* Coded by Sung (https://www.sunghah.com)
      * Copyright ${new Date().getFullYear()}

      =========================================================
      `);

		document.insertBefore(comment, document.documentElement);
  }

	React.useEffect(() => {
		createComment()
	}, []);

	return (
		<React.StrictMode>
			<Head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="x-ua-compatible" content="ie=edge" />
				<meta httpEquiv="content-type" content="text/html" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no"
				/>
				<meta
					name="description"
					content="Online community for ..."
				/>
				<meta name="theme-color" content="#008080" />
				<link rel="shortcut icon" href="/favicon.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="apple-icon" />
				<title>{` ❤️ `} Community</title>
			</Head>
			<ThemeProvider theme={theme.theme === 'light' ? lightTheme : darkTheme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</React.StrictMode>
	);
};

export default wrapper.withRedux(MyApp);
