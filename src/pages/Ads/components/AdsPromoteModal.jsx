import React from "react";


const AdsPromoteModal = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title"); // "라이프미용실 이벤트"
    const content = urlParams.get("content"); // "제목: 겨울철 스타일 변신!\n\n이벤트 내용: 40대 맞춤 스타일링 할인 진행 중!"
    const storeName = urlParams.get("storeName"); // "라이프미용실"
    const roadName = urlParams.get("roadName") || "경기도 안양시 평의길 8";
    const imageUrl = urlParams.get("imageUrl"); // "https://example.com/image.png"

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
                                    src={`${imageUrl}`}
                                    alt="홍보 이미지"
                                />
                            </div>
                        </div>
                        {/* 디테일 정보 영역 */}
                        <div>
                            <p className="pb-2 text-xl font-semibold text-gray-600">
                                {title}
                            </p>
                            <hr className="border-gray-500" />
                            <p className="text-2xl pt-2 font-semibold text-gray-600">
                                {storeName}
                            </p>
                            <p className="text-xl font-semibold text-gray-600">
                                {content}
                            </p>
                            {/* roadName과 아이콘을 가로로 정렬 */}
                            <div className="flex items-center pt-4 space-x-2">
                                <p className="text-l font-semibold text-gray-400">
                                    {roadName}
                                </p>
                                <img
                                    src={require("../../../assets/icon/language_icon.png")}
                                    alt="매장 검색"
                                    className="cursor-pointer"
                                    onClick={() => window.open(`https://map.kakao.com/?q=${encodeURIComponent(roadName)}`, "_blank")}
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
