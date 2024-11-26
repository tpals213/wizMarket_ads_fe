import React from "react";
import AdsModal from "./components/AdsModal";
import AdsDetailModal from "./components/AdsDetailModal";
import { useParams } from "react-router-dom";

const AdsModalPage = ({ type }) => {
    const { storeBusinessNumber } = useParams();

    const handleClose = () => {
        // 새 창을 닫는 동작
        window.close();
    };
    return (
        <>
            {type === "create" ? (
                <AdsModal
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            ) : (
                <AdsDetailModal
                    isOpen={true}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default AdsModalPage;
