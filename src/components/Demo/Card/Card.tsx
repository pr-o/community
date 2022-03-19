import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled';

interface CardProps {
	link: string;
	thumbnail: string;
	title: string;
}

const Card = ({ link, thumbnail, title }: CardProps) => {
	return (
		<CardLi>
			<Image width={300} height={300} src={thumbnail} alt="" />
			<Content>
				<Title>
					{title}
				</Title>
				<Link href={link} passHref>
					<StyledA
						target="_blank"
						rel="noreferrer">
						Open
					</ StyledA>
				</Link>
			</Content>
		</CardLi>
	)
}

export default Card

const CardLi = styled.li`
	border: 1px solid red;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 50px 60px rgb(0 0 0 / 10%);
	transform: scale(1);
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  gap: 12px;
`

const Title = styled.h3`
	font-size: 1.35em;
  margin-bottom: 8px;
  display: inline-flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 4px;
`

const StyledA = styled.a`
	background-color: #008080;
	color: #fff;
	font-weight: 900;
	padding: 0.5rem 1rem;
  border-radius: 8px;
`
