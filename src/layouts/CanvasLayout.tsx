import React, { FC, ReactChild, ReactChildren, ReactElement } from 'react';
import styled from '@emotion/styled';

interface Props {
	children?: any;
};

const CanvasLayout: FC<Props> = ({ children }) => {
	return (
		<Layout>
			<GlobalStyles />
			{children}
		</Layout>
	)
}

export default CanvasLayout;

const GlobalStyles = () => (
	<style jsx global>
		{
			`
				html,
				body {
					overflow: hidden;
				}
			`
		}
	</style>
)

const Layout = styled.div`
  /* overflow: hidden; */
`;
