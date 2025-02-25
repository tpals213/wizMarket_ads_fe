import React from 'react';
import { useLocation } from 'react-router-dom';

const AdsDetailInsta = () => {
    const location = useLocation();
    const { instaName, instaFollowers, instaCount, convertTempImg, useOption, storeBusinessNumber } = location.state || {};

    if (!instaName || !instaFollowers || !instaCount) {
        return <p className="text-red-500">데이터를 불러오지 못했습니다.</p>;
    }


    return (
        <div className="pt-7 pb-24 px-5 flex flex-col items-center bg-white w-full h-full">
            {/* Title */}
            <div className="text-center">
                <h2 className="font-bold text-xl sm:text-2xl">
                    <span className="text-xl sm:text-2xl text-[#FF1664]">{instaName}</span> {useOption}에
                </h2>
                <h2 className="font-bold text-xl sm:text-2xl">
                    성공적으로 포스팅하였습니다.
                </h2>
                <p className="text-gray-500 mt-2 mb-7 text-xs sm:text-sm">{new Date().toLocaleString()}</p>
            </div>

            {/* Uploaded Image */}
            <div className="mt-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto mb-7 flex flex-col items-center">
                <img
                    src={convertTempImg}
                    alt="Uploaded Content"
                    className="w-full max-w-lg h-auto rounded-lg shadow-md"
                />
            </div>


            {/* Instagram Stats */}
            <div className="p-2 rounded-[10px] border border-[rgba(0,0,0,0.12)] flex flex-row justify-between items-center 
                w-full max-w-xs sm:max-w-sm md:max-w-md mb-7 overflow-x-auto">

                {/* 인스타 아이콘 */}
                <img src={require("../../../assets/sns/insta_feed.png")} alt="Instagram" className="w-10 h-10 sm:w-11 sm:h-11 mb-2 sm:mb-0" />

                {/* 게시물 */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <p className="text-base font-bold">{instaCount}</p>
                    <p className="text-sm">게시물</p>
                </div>

                {/* 팔로워 */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <p className="text-base font-bold">{instaFollowers}</p>
                    <p className="text-sm">팔로워</p>
                </div>

                {/* 참여도 */}
                <div className="flex flex-col items-center min-w-[60px]">
                    <p className="text-base font-bold">{(instaFollowers / instaCount).toFixed(2)}</p>
                    <p className="text-sm">참여도</p>
                </div>

                {/* 상승/하락 아이콘 */}
                <div className="flex flex-col items-center pr-1 min-w-[30px]">
                    {instaFollowers / instaCount > 1 ? (
                        <span className="text-red-500">▲</span>
                    ) : (
                        <span className="text-blue-500">▼</span>
                    )}
                </div>
            </div>


            {/* Return to Start Button */}
            <button
                className="px-6 py-3 border border-[rgba(0,0,0,0.12)] bg-white text-pink-500 font-bold rounded-full 
            hover:bg-pink-500 hover:text-white transition flex items-center space-x-2 w-full max-w-xs sm:max-w-sm md:max-w-md"
                onClick={() => (window.location.href = `/ads/temp2/${storeBusinessNumber}`)}
            >
                <img
                    src={require("../../../assets/icon/retry_icon.png")}
                    alt="Retry"
                    className="w-6 h-6"
                    style={{
                        filter: 'invert(26%) sepia(83%) saturate(5123%) hue-rotate(330deg) brightness(91%) contrast(106%)'
                    }}
                />
                <span className="text-base sm:text-lg font-bold">처음으로</span>
            </button>
        </div>

    );
};

export default AdsDetailInsta;
