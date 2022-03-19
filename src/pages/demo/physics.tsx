import dynamic from 'next/dynamic';

const Physics = dynamic(() => import('components/Demo/Physics/Physics'), { ssr: false });

const DonutPage = () => {
	return <Physics />;
};

export default DonutPage;
