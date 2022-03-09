import React, { FC, ReactChild, ReactChildren, ReactElement } from 'react';
import styled from '@emotion/styled';

interface Props {
	children?: (string | Element)[] | Element | ReactElement;
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

				}
			`
		}
	</style>
)

const Layout = styled.div`
  /* overflow: hidden; */
`;
