import React, { useEffect, useState } from "react";
import axios from "axios";

const AdsPromoteModal = () => {
    const [adData, setAdData] = useState(null);

    useEffect(() => {
        // ✅ URL에서 unique_id 추출
        const urlParts = window.location.pathname.split("/");
        const uniqueId = urlParts[urlParts.length - 1]; // 마지막 부분이 UUID
        console.log("🔹 Extracted uniqueId:", uniqueId);
    
        // ✅ FastAPI에서 데이터 가져오기
        const fetchAdData = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/temp/get`,
                    { share_id: uniqueId }, // ✅ POST 요청에서 JSON 바디로 전달
                    { headers: { "Content-Type": "application/json" } }
                );
                setAdData(response.data);
            } catch (error) {
                console.error("❌ 광고 데이터를 가져오는 중 오류 발생:", error);
            }
        };
    
        fetchAdData();
    }, []);
    
    

    if (!adData) return <p>로딩 중...</p>;

    return (
        <div className="inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-full overflow-auto">
                <div className="flex flex-col space-y-6">
                    <>
                        {/* 이미지 영역 */}
                        <div>
                            <div className="flex justify-center items-center rounded-lg ">
                                <img
                                    className="max-h-[700px] w-auto rounded shadow-md"
                                    src={adData.imageUrl}
                                    alt="홍보 이미지"
                                />
                            </div>
                        </div>
                        {/* 디테일 정보 영역 */}
                        <div>
                            <p className="pb-2 text-xl font-semibold text-gray-600">
                                {adData.title}
                            </p>
                            <hr className="border-gray-500" />
                            <p className="text-2xl pt-2 font-semibold text-gray-600">
                                {adData.storeName}
                            </p>
                            <p className="text-xl font-semibold text-gray-600">
                                {adData.content}
                            </p>
                            {/* roadName과 아이콘을 가로로 정렬 */}
                            <div className="flex items-center pt-4 space-x-2">
                                <p className="text-l font-semibold text-gray-400">
                                    {adData.roadName}
                                </p>
                                <img
                                    src={require("../../../assets/icon/language_icon.png")}
                                    alt="매장 검색"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        window.open(
                                            `https://map.kakao.com/?q=${encodeURIComponent(
                                                adData.roadName
                                            )}`,
                                            "_blank"
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
};

export default AdsPromoteModal;
