import { useRef, useState, useEffect, MutableRefObject } from 'react';
// import * as THREE from 'three';

import { AmbientLight, Light } from 'three';
// import Figure from './figure';

const useLight = () => {
	const [light, setLight] = useState<any>(null);

	const lightRef = useRef<Light | null>(null);

	useEffect(() => {
		lightRef.current = new AmbientLight(0xffffff, 2);
		setLight(lightRef.current);

		return () => {
			lightRef.current = null;
		};
	}, []);

	return lightRef.current;
};

export default useLight;
