import { makeStyles } from '@material-ui/core/styles';
import styled from '@emotion/styled';
import CircularProgress from '@material-ui/core/CircularProgress';

const image = '/images/a-thousand-paths-365kb.jpg';

const Wrapper = styled.div`
	position: fixed;
	z-index: 9999;
	width: 100%;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	&:after {
		top: 0;
		left: 0;
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 9998;
		content: '';
		background-image: url(${image});
		background-size: cover;
	}
	&:before {
		top: 0;
		left: 0;
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		z-index: 9999;
		content: '';
		background: rgba(0, 0, 0, 0.75);
	}
`;

const Center = styled.div`
	top: 0;
	position: relative;
	max-width: 600px;
	z-index: 9999;
	padding: 0px;
	margin: 50px auto;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

const Title = styled.p`
	color: #008080;
	font-size: 1.5rem;
	font-weight: 600;
	margin-top: 30px;
	min-height: 30px;
	font-family: 'Roboto Slab', 'Times New Roman', serif;
`;

const useStyles = makeStyles({
	progress: {
		color: '#008080',
		width: '9rem !important',
		height: '9rem !important',
	},
});

const PATHS = [
	{ name: 'posts', value: '/p/' },
	{ name: 'edit', value: '/edit/' },
];

const truncatePath = (dest: string) => {
	PATHS.forEach((PATH) => {
		if (dest.startsWith(PATH.value)) return `${dest.substring(0, PATH.value.length)} - `;
	});
	return dest;
};

interface Props { path: string }

const RouteChange: React.FC<Props> = ({ path }) => {
	const classes = useStyles();

	const destination = truncatePath(path);

	return (
		<Wrapper>
			<Center>
				<CircularProgress className={classes.progress} />
				<Title>{`Loading page: ${destination}`}</Title>
			</Center>
		</Wrapper>
	);
};

export default RouteChange;
