interface IObject {
	[key: string]: string | number;
}

export const getOrdinalSuffix = (n: number) => {
	return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
};

export const sortObjectByCountProp = (obj: IObject) =>
	Object.entries(obj)
		.sort((a: any, b: any) => b[1].count - a[1].count)
		.map((entry) => entry[1]);
