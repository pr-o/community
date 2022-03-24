import Head from 'next/head';

const HeadComponent = () => {
	return (
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
	)
}

export default HeadComponent
