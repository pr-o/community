import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link'
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { Octokit } from '@octokit/core';

interface CaptionRankingProps {
	place: number;
}

const repos: Array<string | undefined> = [
	process.env.GITHUB_LEMONADE_REPO_1,
	process.env.GITHUB_LEMONADE_REPO_2,
	process.env.GITHUB_LEMONADE_REPO_3,
	process.env.GITHUB_LEMONADE_REPO_4,
	process.env.GITHUB_LEMONADE_REPO_5,
	process.env.GITHUB_LEMONADE_REPO_6,
];

const img = '/images/a-platform-for-builders.webp';

const Container = styled.div`
	display: flex;
	padding: 10rem 10rem 15rem;
	flex-direction: column;
	justify-content: center;
	align-items: space-around;
	@media (max-width: 807px) {
		padding: 10rem 1rem;
		align-items: center;
	}
`;
const ImageWrapper = styled.div`
	display: flex;
	margin-top: auto;
	margin-bottom: auto;
	margin-left: -5rem;
	@media (max-width: 1100px) {
		display: none;
	}
	@media (max-width: 807px) {
		display: none;
	}
`;
const LeaderBoards = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
`;
const TopReviewers = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: clamp(20rem, 20rem, 30%);
`;

const TopRequesters = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: clamp(20rem, 20rem, 30%);
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	margin-bottom: 1.5rem;
`;
const Card = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const Captions = styled.div`
	flex-direction: column;
	margin-left: 1rem;
`;

const StyledImage = styled(Image)`
	display: flex;
	border-radius: 50%;
	border: 0.25rem double #fdce00 !important;
`;
const Title = styled.h1`
	font-size: 1.75rem;
	margin-bottom: 1.25rem;
`;
const CaptionRanking = styled.h2<CaptionRankingProps>`
	font-size: 1.375rem;
	color: ${(props) => {
		switch (props.place) {
			case 0:
				return '#d6af36';
			case 1:
				return '#a7a7ad';
			case 2:
				return '#a77044';
			default:
				return 'inherit';
		}
	}};
	font-weight: ${(props) => (props.place < 3 ? 900 : 500)};
	text-decoration: underline;
	margin-left: 5rem;
	margin-bottom: 0.125rem;
`;
const CaptionLogin = styled.h3`
	font-size: 1.125rem;
	margin-bottom: -0.125rem;
`;
const CaptionCount = styled.h3`
	font-size: 0.75rem;
	margin-left: 1rem;
	color: #7f7f7f;
	& span {
		font-size: 0.875rem;
		color: #666;
	}
`;

export async function getServerSideProps() {
	const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_AUTH_TOKEN });

	const calls: any = repos.map((repo) =>
		octokit.request('GET /repos/{owner}/{repo}/pulls', {
			owner: process.env.GITHUB_LEMONADE_ORGANIZATION_NAME as string,
			repo: repo as string,
		})
	);

	const response = await Promise.all(calls);
	const data = response
		.filter((resp) => resp.data.length > 0)
		.map((resp) => resp.data.length > 0 && resp.data);

	const truncateURLs = (data) => {
		const regex =
			/(\"https?:\/\/(api.)?github.com\/(repos\/)?fastlanguage\/fastlanguage-)(.*?)(\/.+?\")/g;
		return JSON.parse(JSON.stringify(data).replace(regex, '"__$4__"'));
	};

	let newData = await truncateURLs(data);

	return {
		props: {
			data: newData,
		},
	};
}

const getOrdinalSuffix = (n: number) =>
	['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';

const WhoIsBusy = ({ data }: any) => {
	const [requesters, setRequesters] = useState();
	const [reviewers, setReviewers] = useState([]);
	const theme: any = useTheme();

	useEffect(() => {
		setReviewers(reviewers);
		setRequesters(requesters);
	}, [requesters, reviewers]);

	useEffect(() => {
		const ff = reduceReviewers(data);
		console.log(ff);
	}, []);

	const reduceReviewers = (data) => {
		const aggregated = [].concat.apply([], data);

		const revs = aggregated.map((agg) => agg.requested_reviewers);
		const reqs = aggregated.map((agg) => agg.user);

		const rev = [].concat.apply([], revs);
		const req = [].concat.apply([], reqs);

		let reviewersObject = {};
		let requestersObject = {};

		rev.forEach((r) => {
			reviewersObject = {
				...reviewersObject,
				[r.login]: {
					login: r.login,
					avatarUrl: r.avatar_url,
					count: reviewersObject[r.login]?.count ? reviewersObject[r.login].count + 1 : 1,
				},
			};
		});

		req.forEach((r) => {
			requestersObject = {
				...requestersObject,
				[r.login]: {
					login: r.login,
					avatarUrl: r.avatar_url,
					count: reviewersObject[r.login]?.count ? reviewersObject[r.login].count + 1 : 1,
				},
			};
		});

		const sortedRev = Object.entries(reviewersObject)
			.sort((a, b) => b[1].count - a[1].count)
			.map((entry) => entry[1]);
		const sortedReq = Object.entries(requestersObject)
			.sort((a, b) => b[1].count - a[1].count)
			.map((entry) => entry[1]);

		setReviewers(sortedRev);
		setRequesters(sortedReq);
		return;
	};

	return (
		<div css={theme.body}>
			<Header
				color={'#005050'}
				changeColorOnScroll={{
					height: 200,
					color: '#008080',
				}}
			/>
			<Container>
				<LeaderBoards>
					<TopReviewers>
						<Title>Reviewers</Title>
						{reviewers?.map((rev, index) => (
							<Row key={`${index}-${rev}`}>
								<CaptionRanking place={index}>
									{`${index + 1}${getOrdinalSuffix(index + 1)}`}
								</CaptionRanking>

								<Card>
									<StyledImage
										src={rev.avatarUrl}
										alt={`${rev.login}'s avatar`}
										width={'64px'}
										height={'64px'}
									/>
									<Captions>
										<CaptionLogin>{`${rev.login}`}</CaptionLogin>
										<CaptionCount>
											<span>{`${rev.count} `}</span>
											{`${rev.count > 1 ? 'reviews' : 'review'} pending`}
										</CaptionCount>
									</Captions>
								</Card>
							</Row>
						))}
					</TopReviewers>
					<ImageWrapper>
						<Image
							src={'/images/a-platform-for-builders.webp'}
							width={400}
							height={400}
							alt="placeholder"
						/>
					</ImageWrapper>
					<TopRequesters>
						<Title>Requesters</Title>
						{requesters?.map((rev, index) => (
							<Row key={`${index}-${rev}`}>
								<CaptionRanking place={index}>
									{`${index + 1}${getOrdinalSuffix(index + 1)}`}
								</CaptionRanking>

								<Card>
									<StyledImage
										src={rev.avatarUrl}
										alt={`${rev.login}'s avatar`}
										width={'64px'}
										height={'64px'}
									/>
									<Captions>
										<CaptionLogin>{`${rev.login}`}</CaptionLogin>
										<CaptionCount>
											<span>{`${rev.count} `}</span>
											{`${rev.count > 1 ? 'requests' : 'request'} pending`}
										</CaptionCount>
									</Captions>
								</Card>
							</Row>
						))}
					</TopRequesters>
				</LeaderBoards>
			</Container>
			<Footer />
		</div>
	);
};

export default WhoIsBusy;
