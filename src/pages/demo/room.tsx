import dynamic from 'next/dynamic';

const Room = dynamic(() => import('components/Demo/Room/Room'), { ssr: false });

const RoomPage = () => {
	return <Room />;
};

export default RoomPage;
