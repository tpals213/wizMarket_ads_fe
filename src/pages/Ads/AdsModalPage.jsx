import React from "react";
import AdsModal from "./components/AdsModal";
import AdsModalLightVer from "./components/AdsModalLightVer";
import AdsDetailModal from "./components/AdsDetailModal";
import AdsPromoteModal from "./components/AdsPromoteModal";
import AdsShareYoutube from "./components/AdsShareYoutube";
import AdsDetailInsta from "./components/AdsDetailInsta";
import AdsModalTemVer from "./components/AdsModalTemVer";

import { useParams } from "react-router-dom";
import AdsModalTemVer2 from "./components/AdsModalTemVer2";

const AdsModalPage = ({ type }) => {
    const { storeBusinessNumber } = useParams();
    const { ads_id } = useParams();

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
            ) : type === "promote" ? (
                <AdsPromoteModal
                    isOpen={true}
                    onClose={handleClose}
                    ads_id={ads_id} // 필요한 경우 전달
                />
            ) : type === "light" ? (
                <AdsModalLightVer
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            ) : type === "temp" ? (
                <AdsModalTemVer
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            ) : type === "temp2" ? (
                <AdsModalTemVer2
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            ) : type === "insta" ? (
                <AdsDetailInsta
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            ) : type === "youtube" ? (
                <AdsShareYoutube />
            ) : (
                <AdsDetailModal
                    isOpen={true}
                    onClose={handleClose}
                    storeBusinessNumber={storeBusinessNumber}
                />
            )}
        </>
    );
};

export default AdsModalPage;
