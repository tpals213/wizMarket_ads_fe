import React, { useEffect, useState } from "react";
import axios from "axios";

const AdsPromoteModal = ({ isOpen, onClose, ads_id }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromoteDetails = async () => {
            if (!ads_id) {
                setError("ads_id가 제공되지 않았습니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/promote/detail`,
                    null,
                    { params: { ads_id: ads_id } }
                );
                setData(response.data); // 성공 시 데이터 설정
            } catch (err) {
                console.error("홍보 디테일 요청 중 오류:", err);
                setError("홍보 디테일을 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchPromoteDetails();
        }
    }, [isOpen, ads_id]);

    if (!isOpen) return null;

    return (
        <div className="inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg  max-w-full overflow-auto">
                <div className="flex flex-col space-y-6">
                    {/* 로딩 또는 에러 처리 */}
                    {loading && (
                        <p className="text-center text-lg font-semibold text-blue-500">로딩 중...</p>
                    )}
                    {error && (
                        <p className="text-center text-lg font-semibold text-red-500">{error}</p>
                    )}
                    {!loading && !error && (
                        <>
                            {/* 이미지 영역 */}
                            <div>
                                <div className="flex justify-center items-center rounded-lg p-4 mb-6">
                                    <img
                                        className="max-w-full h-auto rounded shadow-md"
                                        src={`${process.env.REACT_APP_FASTAPI_ADS_URL}${data.ads_final_image_url}`}
                                        alt="홍보 이미지"
                                    />
                                </div>
                            </div>
                            {/* 디테일 정보 영역 */}
                            <div className="space-y-4">
                                <p className="pb-6 text-8xl font-semibold text-gray-600">
                                    [{data.store_name}] {data.title}
                                </p>
                                <hr className="border-gray-500 my-6" />
                                <p className="text-6xl pt-6 pb-6 font-semibold text-gray-600">
                                    {data.store_name}
                                </p>
                                <p className="text-5xl font-semibold text-gray-400">
                                    {data.content}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdsPromoteModal;
