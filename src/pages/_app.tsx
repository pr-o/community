import React, { FC } from 'react'
import ReactDOM from 'react-dom';
import { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider, css } from '@emotion/react';
import { lightTheme, darkTheme } from 'assets/jss/themes';
import { wrapper } from 'lib/redux/store';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'lib/redux/modules';
import PageChange from "components/RouteChange/RouteChange.js";
import Router from "next/router";


import '../styles/globals.css'

const showTransitionAnimation = (path: string) => {
	document.body.classList.add('body-page-transition');
		ReactDOM.render(
			<PageChange path={path} />,
			document.getElementById('page-transition')
		);
}

const hideTransitionAnimation = () => {
	ReactDOM.unmountComponentAtNode(
		document.getElementById('page-transition')!
	);
	document.body.classList.remove('body-page-transition');
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

	const router = useRouter();

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
				<link rel="shortcut icon" href="/favicon.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="apple-icon" />
				<meta name="theme-color" content="#000000" />
				<link
					rel="stylesheet"
					type="text/css"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
				/>
				<link
					href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
					rel="stylesheet"
				/>
				<title>{` ❤️ `} Community</title>
			</Head>
			<ThemeProvider theme={theme.theme === 'light' ? lightTheme : darkTheme}>
					<Component {...pageProps} />
			</ThemeProvider>
		</React.StrictMode>
	);
};

export default wrapper.withRedux(MyApp);
