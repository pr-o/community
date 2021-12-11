import { Vector2, MathUtils } from 'three';

export const getRatio = (
	{ x: w, y: h }: { x: number; y: number },
	{ width, height }: { width: any; height: any },
	r = 0
) => {
	const m = multiplyMatrixAndPoint(rotateMatrix(MathUtils.degToRad(r)), [w, h]);
	const originalRatio = {
		w: m[0] / width,
		h: m[1] / height,
	};

	const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h);

	return new Vector2(originalRatio.w * coverRatio, originalRatio.h * coverRatio);
};

export const multiplyMatrixAndPoint = (
	matrix: Array<any> | Array<Array<any>>,
	point: Array<any>
) => {
	const c0r0 = matrix[0];
	const c1r0 = matrix[1];
	const c0r1 = matrix[2];
	const c1r1 = matrix[3];
	const x = point[0];
	const y = point[1];
	return [Math.abs(x * c0r0 + y * c0r1), Math.abs(x * c1r0 + y * c1r1)];
};

export const rotateMatrix = (a: any) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];
