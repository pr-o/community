import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled';
import Card from 'components/Demo/Card/Card'

const CardsObj = [
	{
		title: 'Gallery',
		thumbnail: "/images/lemon.jpg",
		link: '/about'
	},
	{
		title: 'Customizable Donut',
		thumbnail: "/images/lemon.jpg",
		link: '/demo/donut'
	},
	{
		title: 'Physics',
		thumbnail: "/images/lemon.jpg",
		link: '/demo/physics'
	},
	{
		title: 'Room',
		thumbnail: "/images/lemon.jpg",
		link: '/demo/room'
	},
]

const CardList = () => {
	return (
		<Container>
			<Row>
				<Title>three.js &nbsp; demos</Title>
				<List>
					{CardsObj.map(({ title, link, thumbnail }, index) =>
						<Card
							title={title}
							link={link}
							thumbnail={thumbnail}
							key={`card-${index}`}
						/>
					)}

				</List>
			</Row>
		</Container>
	)
}

const Container = styled.div`
	max-width: min(80vw, 1024px);
  margin: 0 auto;
  padding-block: 12px;
`

const Row = styled.div`
  margin-bottom: 78px;
`

const Title = styled.h2`
  text-decoration: none;
  font-size: 2.25em;
  margin-bottom: 26px;
`

const List = styled.ul`
	list-style: none;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding: 0;
  justify-content: center;

	@keyframes shake {
		  0% { transform: translate(1px, 1px) rotate(0deg); }
		 10% { transform: translate(-1px, -2px) rotate(-1deg); }
		 20% { transform: translate(-3px, 0px) rotate(1deg); }
		 30% { transform: translate(3px, 2px) rotate(0deg); }
		 40% { transform: translate(1px, -1px) rotate(1deg); }
		 50% { transform: translate(-1px, 2px) rotate(-1deg); }
		 60% { transform: translate(-3px, 1px) rotate(0deg); }
		 70% { transform: translate(3px, 1px) rotate(-1deg); }
		 80% { transform: translate(-1px, -1px) rotate(1deg); }
		 90% { transform: translate(1px, 2px) rotate(0deg); }
		100% { transform: translate(1px, -2px) rotate(-1deg); }
	}

	& > li:hover {
		animation: shake 0.8s;
		animation-iteration-count: infinite;

		box-shadow: 0 50px 50px rgb(0 0 0 / 20%);
		scale: 1.25;
		img {
			transform: scale(1.2);
			transition: transform 0.5s ease-in-out;
		}

	}

	@media (min-width: 1240px) {
		justify-content: space-between;
	}
`

export default CardList
