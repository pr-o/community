import { css } from '@emotion/react';

export const whiteColor = '#ffffff';
export const blackColor = '#000000';
export const uscPrimaryColor = '#990000';
export const uscSecondaryColor = '#ffcc00';
export const uclaPrimaryColor = '#2774ae';
export const uclaSecondaryColor = '#ffd100';
export const caltechPrimaryColor = '#ff6c0c';
export const caltechSecondaryColor = '#76777b';

export const tealColors = [
	'#008080',
	'#007373',
	'#006666',
	'#005959',
	'#004c4c',
	'#004040',
	'#003333',
	'#002626',
	'#001919',
	'#000c0c',
];
export const cardinalColors = ['#990000', '#890000', '#7a0000', '#6b0000', '#5b0000', '#4c0000'];
export const goldColors = ['#ffcc00', '#e5b700', '#cca300', '#b28e00', '#997a00', '#7f6600'];
export const grayColors = [
	'#f4f4f4',
	'#ececec',
	'#e4e4e4',
	'#dcdcdc',
	'#d4d4d4',
	'#ccc',
	'#c3c3c3',
	'#bbb',
	'#b3b3b3',
	'#ababab',
	'#a3a3a3',
	'#9b9b9b',
	'#929292',
	'#8a8a8a',
	'#828282',
	'#7a7a7a',
	'#727272',
	'#6a6a6a',
	'#616161',
	'#595959',
	'#515151',
	'#494949',
	'#414141',
	'#393939',
	'#303030',
];
export const warningColors = [
	'#ff9800',
	'#ffa726',
	'#fb8c00',
	'#ffa21a',
	'#fcf8e3',
	'#faf2cc',
	'#ffe0b2',
	'#ffb74d',
];
export const dangerColors = [
	'#f44336',
	'#ef5350',
	'#e53935',
	'#f55a4e',
	'#f2dede',
	'#ebcccc',
	'ef9a9a',
	'#ef5350',
];
export const successColors = [
	'#4caf50',
	'#66bb6a',
	'#43a047',
	'#5cb860',
	'#dff0d8',
	'#d0e9c6',
	'#a5d6a7',
	'#66bb6a',
];
export const infoColors = [
	'#00acc1',
	'#26c6da',
	'#00acc1',
	'#00d3ee',
	'#d9edf7',
	'#c4e3f3',
	'#b2ebf2',
	'#4dd0e1',
];
export const roseColors = ['#e91e63', '#ec407a', '#d81b60', '#f8bbd0', '#f06292'];

export const twitterColor = '#55acee';
export const facebookColor = '#3b5998';
export const googleColor = '#dd4b39';
export const linkedinColor = '#0976b4';
export const pinterestColor = '#cc2127';
export const youtubeColor = '#e52d27';
export const tumblrColor = '#35465c';
export const behanceColor = '#1769ff';
export const dribbbleColor = '#ea4c89';
export const redditColor = '#ff4500';
export const instagramColor = '#125688';

export const primaryColors = tealColors;
export const secondaryColors = cardinalColors;
export const tertiaryColors = goldColors;

export const hexToRgb = (input) => {
	input = input + '';
	input = input.replace('#', '');
	let hexRegex = /[0-9A-Fa-f]/g;
	if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
		throw new Error('input is not a valid hex color.');
	}
	if (input.length === 3) {
		let f = input[0]; // first
		let s = input[1]; // second
		let l = input[2]; // last
		input = f + f + s + s + l + l;
	}
	input = input.toUpperCase(input);
	let f = input[0] + input[1];
	let s = input[2] + input[3];
	let l = input[4] + input[5];
	return `${parseInt(f, 16)}, ${parseInt(s, 16)}, ${parseInt(l, 16)}`;
};

export const body = (theme) => css`
	color: ${theme.text};
	background: ${theme.bodyBackground};
	width: 100%;
	transition-duration: 1s;
	transition-property: background-color, color;
`;

export const containerFluid = css`
	padding: 0 15px;
	margin: 0 auto;
	width: 100%;
	z-index: 1;
`;

export const container = (theme) => css`
	@media (min-width: 576px) {
		max-width: 540px;
	}
	@media (min-width: 768px) {
		max-width: 720px;
	}
	@media (min-width: 992px) {
		max-width: 960px;
	}
	@media (min-width: 1200px) {
		max-width: 1140px;
	}
	padding: 0 15px;
	margin: 0 auto 60px;
	width: 100%;
	z-index: 1;
`;

export const main = (theme) => css`
	color: ${theme.text};
	background: ${theme.background};
	position: relative;
	text-align: center;
	z-index: 3;
	transition-duration: 0.5s;
	transition-property: background-color, color;
`;

export const mainRaised = (theme) => css`
	@media (max-width: 576px) {
		margin-top: -30px;
	}
	@media (max-width: 830px) {
		margin: 0 10px;
	}
	color: ${theme.text};
	background: ${theme.background};
	position: relative;
	z-index: 3;
	text-align: center;
	padding: 50px 0;
	margin: -20px 40px 40px;
	border-radius: 10px;
	box-shadow: 0 16px 24px 2px rgba(${hexToRgb(theme.background)}, 0.14),
		0 6px 30px 5px rgba(${hexToRgb(theme.background)}, 0.12),
		0 8px 10px -5px rgba(${hexToRgb(theme.background)}, 0.2);
	transition-duration: 0.5s;
	transition-property: background-color, color;
`;

export const preFooter = (theme) => css`
	color: ${theme.text};
	background: ${theme.background};
	text-align: center;
	padding: 100px 0px;
	margin: 50px 0;
	h2 {
		font-weight: 500;
		margin-bottom: 50px;
	}
	transition-duration: 0.5s;
	transition-property: background-color, color;
`;

export const footer = (theme) => css`
	color: ${theme.text};
	background: ${theme.background};
	display: flex;
	justify-content: center;
	align-items: center;
	transition-duration: 0.5s;
	transition-property: background-color, color;
`;
