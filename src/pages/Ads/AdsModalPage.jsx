import React from 'react';
import AdsModal from './components/AdsModal';
import { useParams } from 'react-router-dom';

const AdsModalPage = () => {
    const { storeBusinessNumber } = useParams();

    const handleClose = () => {
        // 새 창을 닫는 동작
        window.close();
    };

    return (
            <AdsModal
                isOpen={true}
                onClose={handleClose}
                storeBusinessNumber={storeBusinessNumber}
            />
        
    );
};

export default AdsModalPage;
