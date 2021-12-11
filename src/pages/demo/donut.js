import dynamic from 'next/dynamic';

const ThreeDonut = dynamic(() => import('components/Demo/ThreeDonut/ThreeDonut'), { ssr: false });

const DonutPage = () => {
	return <ThreeDonut />;
};

export default DonutPage;
