import dynamic from 'next/dynamic';

const ThreeDonut = dynamic(() => import('components/demo/ThreeDonut'));

const DonutPage = () => <ThreeDonut />;

export default DonutPage;
