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

export const reduceReviewers = (data: any) => {
	const dataConcat: any[] = [].concat(...data);

	let revs: any[] = [];
	let reqs: any[] = [];

	dataConcat.forEach((pr: any) => {
		reqs = [...reqs, Object.assign(pr.user, { repo: pr.html_url })];
		if (Object.keys(pr.requested_reviewers).length) {
			pr.requested_reviewers.map((reviewer: any) => {
				revs = [...revs, Object.assign(reviewer, { repo: pr.html_url })];
			});
		}
	});

	let reviewersObject: any = {};
	let requestersObject: any = {};

	revs.forEach(({ login, avatar_url, repo }) => {
		reviewersObject = {
			...reviewersObject,
			[login]: {
				login,
				avatarUrl: avatar_url,
				count: reviewersObject[login]?.count ? reviewersObject[login].count + 1 : 1,
				repo: reviewersObject[login]?.repo.length
					? [...new Set([...reviewersObject[login].repo, repo])]
					: [repo],
			},
		};
	});

	reqs.forEach(({ login, avatar_url, repo }) => {
		requestersObject = {
			...requestersObject,
			[login]: {
				login: login,
				avatarUrl: avatar_url,
				count: requestersObject[login]?.count ? requestersObject[login].count + 1 : 1,
				repo: requestersObject[login]?.repo.length
					? [...new Set([...requestersObject[login].repo, repo])]
					: [repo],
			},
		};
	});

	const sortedRevs = sortObjectByCountProp(reviewersObject);
	const sortedReqs = sortObjectByCountProp(requestersObject);

	return [sortedRevs, sortedReqs];
};
