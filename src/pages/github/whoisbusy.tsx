import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link'
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { getOrdinalSuffix, reduceReviewers } from 'utils/utils'
import { Octokit } from '@octokit/core';
interface CaptionRankingProps {
	place: number;
}


interface IData {
	login: string;
	avatarUrl: string;
	count: number;
}

const repos: Array<string | undefined> = [
	process.env.GITHUB_LEMONADE_REPO_1,
	process.env.GITHUB_LEMONADE_REPO_2,
	process.env.GITHUB_LEMONADE_REPO_3,
	process.env.GITHUB_LEMONADE_REPO_4,
	process.env.GITHUB_LEMONADE_REPO_5,
	process.env.GITHUB_LEMONADE_REPO_6,
	process.env.GITHUB_LEMONADE_REPO_7,
	process.env.GITHUB_LEMONADE_REPO_8,
	process.env.GITHUB_LEMONADE_REPO_9,
	process.env.GITHUB_LEMONADE_REPO_10,
	process.env.GITHUB_LEMONADE_REPO_11,
	process.env.GITHUB_LEMONADE_REPO_12,
	process.env.GITHUB_LEMONADE_REPO_13,
];

const centerImgPath = '/images/a-platform-for-builders.webp';


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
		?.filter((resp: any) => resp.data.length > 0)
		.map((resp: any) => resp.data.length > 0 && resp.data);

	// const regex =
	// 	/(\"https?:\/\/(api.)?github.com\/(repos\/)?fastlanguage\/fastlanguage-)(.*?)(\/.+?\")/g;
	// const truncateURLs = (data: object) => JSON.parse(JSON.stringify(data).replace(regex, '"$4"'));
	// const newData = await truncateURLs(data);

	return { props: { data } };
}

const WhoIsBusy = ({ data }: any) => {
	const [requesters, setRequesters] = useState<Array<IData | string | number>>([]);
	const [reviewers, setReviewers] = useState<Array<IData | string | number>>([]);
	const theme: any = useTheme();

	useEffect(() => {
		const [sortedReviewers, sortedRequesters] = reduceReviewers(data)
		setReviewers(sortedReviewers);
		setRequesters(sortedRequesters);
	}, [data]);

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
						{reviewers?.map((rev: any, index) => (
							<Row key={`${rev}-${index}`}>
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
										<CaptionTooltip>
											<CaptionCount>
												<span>{`${rev.count} `}</span>
												{`${rev.count > 1 ? 'reviews' : 'review'} pending`}
											</CaptionCount>
											<div>
												<span>
													{
														rev.repo.map((r: string, i: number) => (
															<a key={`${i}${r}`} href={r} target="_blank" rel="noopener noreferrer">
																{`${r}\n`}
															</a>
														)
														)
													}
												</span>
											</div>
										</CaptionTooltip>
									</Captions>
								</Card>
							</Row>
						))}
					</TopReviewers>
					<ImageWrapper>
						<Image
							src={centerImgPath}
							width={400}
							height={400}
							alt="placeholder"
						/>
					</ImageWrapper>
					<TopRequesters>
						<Title>Requesters</Title>
						{requesters?.map((req: any, index) => (
							<Row key={`${req}-${index}`}>
								<CaptionRanking place={index}>
									{`${index + 1}${getOrdinalSuffix(index + 1)}`}
								</CaptionRanking>
								<Card>
									<StyledImage
										src={req.avatarUrl}
										alt={`${req.login}'s avatar`}
										width={'64px'}
										height={'64px'}
									/>
									<Captions>
										<CaptionLogin>{`${req.login}`}</CaptionLogin>
										<CaptionTooltip data-tooltip={`${req.repo.join('\n')}`}>
											<CaptionCount>
												<span>{`${req.count} `}</span>
												{`${req.count > 1 ? 'requests' : 'request'} pending`}
											</CaptionCount>
											<div>
												<span>
													{
														req.repo.map((r: string, i: number) => (
															<a key={`${i}${r}`} href={r} target="_blank" rel="noopener noreferrer">
																{`${r}\n`}
															</a>
														)
														)
													}
												</span>
											</div>
										</CaptionTooltip>
									</Captions>
								</Card>
							</Row>
						))}
					</TopRequesters>
				</LeaderBoards>
			</Container>
			<Footer />
		</div >
	);
};

export default WhoIsBusy;

const Container = styled.div`
	display: flex;
	padding: 10rem 5rem 10rem 10rem;
	min-height: 100%;
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

const CaptionTooltip = styled.div`
	position: relative;
	& > div {
		visibility: hidden;
		position: absolute;
		display: block;
		border-radius: 6px;
		padding: 1em;
		width: max-content;
		top: 100%;
		left: 0;
		font-size: .75rem;
		white-space: pre;
		color: #fff;
		z-index: 999;
		background-color: #444;
	}
	&:hover > div {
		visibility: visible;
	}
	&:hover > div > span a:hover {
		color: #008080;
	}
`
