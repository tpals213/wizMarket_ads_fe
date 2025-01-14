import React from "react";


const AdsPromoteModal = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title"); // "라이프미용실 이벤트"
    const content = urlParams.get("content"); // "제목: 겨울철 스타일 변신!\n\n이벤트 내용: 40대 맞춤 스타일링 할인 진행 중!"
    const storeName = urlParams.get("storeName"); // "라이프미용실"
    const imageUrl = urlParams.get("imageUrl"); // "https://example.com/image.png"

    return (
        <div className="inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-full overflow-auto">
                <div className="flex flex-col space-y-6">
                    <>
                        {/* 이미지 영역 */}
                        <div>
                            <div className="flex justify-center items-center rounded-lg p-4 mb-6">
                                <img
                                    className="max-w-full h-auto rounded shadow-md"
                                    src={`${imageUrl}`}
                                    alt="홍보 이미지"
                                />
                            </div>
                        </div>
                        {/* 디테일 정보 영역 */}
                        <div className="space-y-4">
                            <p className="pb-6 text-8xl font-semibold text-gray-600">
                                 {title}
                            </p>
                            <hr className="border-gray-500 my-6" />
                            <p className="text-6xl pt-6 pb-6 font-semibold text-gray-600">
                                {storeName}
                            </p>
                            <p className="text-5xl font-semibold text-gray-400">
                                {content}
                            </p>
                        </div>
                    </>
                </div>
            </div>
        </div>

    );
};

export default AdsPromoteModal;
