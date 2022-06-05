import dynamic from 'next/dynamic';

const Annotation2D = dynamic(() => import('components/Annotation2D/Annotation2D'), { ssr: false });

const Annotation2DPage = () => <Annotation2D />

export default Annotation2DPage;
