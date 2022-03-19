import dynamic from 'next/dynamic';

const Room = dynamic(() => import('components/Demo/Room/Room'), { ssr: false });

const DonutPage = () => {
	return <Room />;
};

export default DonutPage;
