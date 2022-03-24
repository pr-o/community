import React from 'react'
// import ReactDOM from 'react-dom';
// import { createRoot, hydrateRoot } from 'react-dom/client';
// import Router from "next/router";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppProps } from 'next/app'
import { useSelector, shallowEqual } from 'react-redux';
import { wrapper } from 'lib/redux/store';
import { RootState } from 'lib/redux/modules';
import { ThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from 'assets/jss/themes';
// import RouteChange from "components/RouteChange/RouteChange";
import Head from 'components/Head/Head';
import 'styles/globals.css'

// const showTransitionAnimation = (path: string) => {
// ReactDOM.create .render(
// 		<RouteChange path={path} />,
// 		document.getElementById('route-transition')
// 	);
// }

// const hideTransitionAnimation = () => {
// 	ReactDOM.unmountComponentAtNode(
// 		document.getElementById('route-transition')!
// 	);
// }

// Router.events.on('routeChangeStart', (path) => showTransitionAnimation(path))
// Router.events.on('routeChangeComplete', () => hideTransitionAnimation())
// Router.events.on('routeChangeError', () => hideTransitionAnimation())

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { theme } = useSelector(
		(state: RootState) => ({ theme: state.theme }),
		shallowEqual
	);

	const [queryClient] = React.useState(() => new QueryClient());
	queryClient.setDefaultOptions({
		queries: { staleTime: Infinity }
	});

	const createComment = () => {
		const comment = document.createComment(`
      =========================================================
      * Unnamed (yet) community
      =========================================================
			* Coded by Sung
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
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<ThemeProvider theme={theme.theme === 'light' ? lightTheme : darkTheme}>
						<Head />
						<Component {...pageProps} />
					</ThemeProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</Hydrate>
			</QueryClientProvider>
		</React.StrictMode>
	);
};

export default wrapper.withRedux(MyApp);
