import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { jsx, css, useTheme } from '@emotion/react';

const wrapperDiv = css`
	margin: 50px auto;
	padding: 0px;
	max-width: 500px;
	text-align: center;
	position: relative;
	z-index: 9999;
	top: 0;
`;

const title = css`
	color: #008080;
	text-decoration: none;
	font-weight: 700;
	margin-top: 30px;
	margin-bottom: 25px;
	min-height: 32px;
	font-family: 'Roboto Slab', 'Times New Roman', serif;
`;

const useStyles = makeStyles({
	progress: {
		color: '#008080',
		width: '7rem',
		height: '7rem',
	},
});

const PATHS = ['/p/', '/edit/'];

const truncatePath = (dest) => {
	PATHS.forEach((PATH) => {
		if (dest.startsWith(PATH)) return `${dest.substring(0, PATH.length)} - `;
		else return dest;
	});
};

const RouteChange = ({ path }) => {
	const classes = useStyles();

	const destination = truncatePath(path);

	return (
		// <div>
		// 	<div className={classes.wrapperDiv}>
		// 		<CircularProgress className={classes.progress} />

		// 		<h4 className={classes.title}>Loading page: {destination}</h4>
		// 	</div>
		// </div>
		<div>
			<div css={wrapperDiv}>
				<CircularProgress className={classes.progress} />

				<h4 css={title}>Loading page: {destination}</h4>
			</div>
		</div>
	);
};

export default RouteChange;
