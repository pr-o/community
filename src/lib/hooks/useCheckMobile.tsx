import { useState, useEffect } from 'react';

export default function useCheckMobile() {
	const [mobile, setMobile] = useState(false);
	const [width, setWidth] = useState<number>(641);

	const THRESHOLD = 807;

	useEffect(() => {
		setWidth(window?.innerWidth);
	}, []);

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		width > THRESHOLD ? setMobile(false) : setMobile(true);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [width]);

	return mobile;
}
