import React from 'react';
import { useLocation } from 'react-router-dom';

const AdsDetailInsta = () => {
    const location = useLocation();
    const { instaName, instaFollowers, instaCount, uploadImages, useOption, storeBusinessNumber } = location.state || {};

    if (!instaName || !instaFollowers || !instaCount) {
        return <p className="text-red-500">데이터를 불러오지 못했습니다.</p>;
    }
    const uploadImage = uploadImages[0];

    return (
        <div className="pt-[28px] pb-[28px] pl-[20px] pr-[20px] flex flex-col items-center bg-white w-full h-full">
            {/* Title */}
            <h2 className="font-bold text-2xl">
                <span className="text-2xl" style={{ color: '#FF1664' }}>{instaName}</span> {useOption}에
            </h2>
            <h2 className="font-bold text-2xl">
                성공적으로 포스팅하였습니다.
            </h2>
            <p className="text-gray-500 mt-2 mb-7 text-s">{new Date().toLocaleString()}</p>

            {/* Uploaded Image */}
            <div className="mt-6 w-full max-w-md h-auto mb-7 flex flex-col items-center">
                <img
                    src={uploadImage}
                    alt="Uploaded Content"
                    className="rounded-lg shadow-md max-h-[500px]"
                />
            </div>
            {/* Instagram Stats */}
            <div className="p-2 rounded-[10px] border border-[rgba(0,0,0,0.12)] flex justify-between items-center w-full max-w-sm mb-7">
                <img src={require("../../../assets/sns/insta_feed.png")} alt="Instagram" className="w-11 h-11 mb-1" />
                <div className="flex flex-col items-center">
                    <p className="text-base font-bold">{instaCount}</p>
                    <p className="text-sm">게시물</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-base font-bold">{instaFollowers}</p>
                    <p className="text-sm">팔로워</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-base font-bold">{(instaFollowers / instaCount).toFixed(2)}</p>
                    <p className="text-sm">참여도</p>
                </div>
                <div className="flex flex-col items-center pr-1">
                    {instaFollowers / instaCount > 1 ? (
                        <span className="text-red-500">▲</span>
                    ) : (
                        <span className="text-blue-500">▼</span>
                    )}
                </div>
            </div>

            {/* Return to Start Button */}
            <button
                className="px-6 py-3 border border-[rgba(0,0,0,0.12)] bg-white text-pink-500 font-bold rounded-full hover:bg-pink-500 transition flex items-center space-x-2"
                onClick={() => (window.location.href = `/ads/light/${storeBusinessNumber}`)}
            >
                <img
                    src={require("../../../assets/icon/retry_icon.png")}
                    alt="Retry"
                    className="w-6 h-6"
                    style={{ filter: 'invert(26%) sepia(83%) saturate(5123%) hue-rotate(330deg) brightness(91%) contrast(106%)' }}
                />
                <span className="text-lg font-bold">처음으로</span>
            </button>
        </div>
    );
};

export default AdsDetailInsta;
