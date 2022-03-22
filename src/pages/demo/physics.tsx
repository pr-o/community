import dynamic from 'next/dynamic';

const Physics = dynamic(() => import('components/Demo/Physics/Physics'), { ssr: false });

const PhysicsPage = () => {
	return <Physics />;
};

export default PhysicsPage;
