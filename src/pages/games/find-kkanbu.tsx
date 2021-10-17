import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link'
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { Close as CloseIcon } from '@material-ui/icons';

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
const Kkanbus = styled.div`
	& > ul {
		border: 1px solid red;
	}
`
const Participants = styled.div`

	& > div > ul {
		border: 1px solid red;
		li {
			display: flex;
			align-items: center;	
			& > span:nth-child(1) {
				margin-right: 1rem;
				border-radius: 50%;
			}
			& > span:nth-of-type(2) {
				display: flex;
				button {
					display: flex;
					align-items: center;
					margin-right: 1rem;
					color: #990000;
					border: 1px solid
					border-radius: 33%;
				}
			}
		}
	}
	& > div {
		margin: 1rem;
		& > div:nth-of-type(1) {
			align-items: center;
			border: 1px solid blue;
			& > div {
				
				label {
					vertical-align: .1rem;
					margin-left: .5rem;
					line-height: 2rem;
				}
			}
		}
		& > div:nth-of-type(2) {
			form {
				display: flex;
				align-items: center;
				& > input {
					height: 3.5rem;
					width: 10rem;
					margin-right: 0.5rem;
					font-size: 2rem;
				}
				& > button {
					height: 3.5rem;
					font-size: 1.25rem;
					font-weight: 700;
					padding: .25rem .75rem;
					color: #ffffff;
					background-color: #006060;
					border-radius: 4px;
				}
			}
		}
		
	}
	
`


const devTeamNames: Array<string> = [
	'김건한', '김남규', '김진기', '박상은',
	'박소영', '박종열', '박준섭', '박지원',
	'심언조', '양민경', '이새글', '정승환',
	'진시우', '최성권', '최종규', '황성하'
]
const devTeamNumberss: Array<number> = [
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]

const FindKkanbu = () => {
	const [participants, setParticipants] = useState<Array<string>>([]);
	const [kkanbus, setKkanbus] = useState<Array<string>>([]);
	const [inputMethod, setInputMethod] = useState<string>('preset-1')
	const [userInput, setUserInput] = useState<string>('')
	const [groupSize, setGroupSize] = useState<number>(4)
	const theme: any = useTheme();

	React.useEffect(() => {
		if (inputMethod === 'preset-1') setParticipants(devTeamNames)
		else setParticipants([])
	}, [inputMethod])
	
	useEffect(() => {
		console.log('xxx', participants)
	}, [participants]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value.trim()
		value !== '' && setUserInput(event.target.value as string)
	}
	
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setParticipants([ ...participants, userInput])
		setUserInput('')
		event.preventDefault();
	}

	const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => setInputMethod(event.target.value)
	
	const onClickRadioDiv = (target: string) => setInputMethod(target)
	
	const onClickClose = (index: Number) => setParticipants(participants.filter((p, _index) => _index !== index))

	const findKkanbus = () => {
		const f1 = participants.slice(0, participants.length / 2)
		const f2 = participants.slice(participants.length / 2)

		const firstHalf= permute(f1, groupSize)
		const secondHalf= permute(f2, groupSize)

		const index = getWeekNumber()
		const group1 = firstHalf[index <= firstHalf.length ? index - 1 : firstHalf.length % index - 1]
		const group2 = secondHalf[index <= secondHalf.length ? index -1 : secondHalf.length % index - 1]

		setKkanbus([...group1, ...group2])
		console.log('111 =>', firstHalf, secondHalf)
		console.log('333 =>', index, secondHalf.length, secondHalf.length % index)
		console.log('aaa =>', group1, group2)

		// console.log('zzz', res[index < res.length ? index -1 : res.length % index - 1])
	}

	const permute = (arr: Array<string>, groupSize: number) => {
		
		let result: Array<any> = [];

		const dfs = (pool: Array<string>, num: number, arr: Array<any> = []) => {
			// 3개를 선택한다는가정에 3개가 선택 됐다면 출력
			if (num === groupSize) result.push([...arr]);
			else {
				for (let i = 0; i < pool.length; i++) {
					arr.push(pool[i]);
					dfs(pool.slice(i + 1), num + 1, arr);
					arr.pop();
				}
			}
		};
		
		
		dfs(arr, 0);
		return result
		const res = shuffleArray(shuffleArray(result))
		const index = getWeekNumber()
		// console.log('zzz', res[index < res.length ? index : res.length % index])

	}

	
	

	const shuffleArray = (array: Array<any>) => {
		// using the Fisher-Yates algorithm
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	const getWeekNumber = () => {
		const today = new Date();
		const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}


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
				<div>
					<Kkanbus>
						<ul>
							{kkanbus?.map((k, index) => (<li key={`${index}-${k}`}>{k}</li>))}
						</ul>
					</Kkanbus>
					<Participants>
						<div>
							<ul>
								{participants?.map((p, index) => (
								<li key={`${index}-${p}`}>
									<span>{p}</span>
									<span>
										<button onClick={() => onClickClose(index)}><CloseIcon/></button>
									</span>
								</li>)
								)}
							</ul>
						</div>
						<div>
							<div onChange={onChangeRadio}>
								<div onClick={() => onClickRadioDiv('preset-1')}>
									<input type="radio" name={"inputMethod"} value={"preset-1"} checked={inputMethod === 'preset-1'}/>
									<label>{"preset: 개발팀"}</label>
								</div>
								<div onClick={() => onClickRadioDiv('custom')}>
									<input type="radio" name={"inputMethod"} value={"custom"} checked={inputMethod === 'custom'}/>
									<label>{"custom"}</label>
								</div>
							</div>
							{inputMethod === 'custom' && (
								<div>
									<form onSubmit={handleSubmit}>
										<input type="text" value={userInput} onChange={handleInputChange} />
										<button>{'추 가'}</button>
									</form>
								</div>
							)}
						</div>
					</Participants>
					<button onClick={() => permute(participants, 8)}>{'깐부 찾기: 3'}</button>{' '}
					<button onClick={findKkanbus}>{'깐부 찾기: 4'}</button>
				</div>

			</Container>
			<Footer />
		</div >
	);
};

export default FindKkanbu;
