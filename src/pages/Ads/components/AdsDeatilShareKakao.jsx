import React, { useEffect, useState } from "react";
import axios from "axios";

const AdsDeatilShareKakao = ({ title, content, storeName, storeBusinessNumber, filePath, adsPkValue }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


    useEffect(() => {
        // 카카오 SDK 초기화
        const kakaoJsKey = process.env.REACT_APP_KAKAO_JS_API_KEY; // .env 파일에서 KAKAO_JS_KEY 가져오기
        if (!kakaoJsKey) {
            console.error("Kakao JavaScript Key가 설정되지 않았습니다.");
            return;
        }

        if (!window.Kakao) {
            const script = document.createElement("script");
            script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
            script.async = true;
            script.onload = () => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoJsKey); // 환경 변수에서 가져온 키로 초기화
                }
            };
            document.body.appendChild(script);
        } else {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(kakaoJsKey); // 환경 변수에서 가져온 키로 초기화
            }
        }
    }, []);

    useEffect(() => {
        const fetchImageAndUpload = async () => {
            if (!filePath) {
                console.error("파일 경로가 설정되지 않았습니다.");
                return;
            }

            try {
                let file;

                if (filePath.startsWith("data:")) {
                    // Base64 데이터 처리
                    const response = await fetch(filePath);
                    const blob = await response.blob();
                    file = new File([blob], "uploaded_image.png", { type: blob.type });
                } else {
                    // 일반 URL에서 이미지 데이터 가져오기
                    const response = await axios.get(filePath, {
                        responseType: "blob",
                        headers: {
                            "Content-Type": "application/json", // 필요시 적절한 Content-Type 설정
                        },
                    });
                    file = new File([response.data], "uploaded_image.png", { type: response.data.type });
                }

                // 카카오 서버에 업로드
                const kakaoResponse = await window.Kakao.Share.uploadImage({
                    file: [file],
                });

                const imageUrl = kakaoResponse.infos.original.url;
                setUploadedImageUrl(imageUrl);
            } catch (error) {
                console.error("이미지 업로드 중 오류 발생:", error);
            }
        };

        fetchImageAndUpload();
    }, [filePath]);

    const handleShare = async () => {
        if (!window.Kakao) {
            console.error("카카오 SDK가 로드되지 않았습니다.");
            return;
        }

        if (!window.Kakao.isInitialized()) {
            console.error("카카오 SDK가 초기화되지 않았습니다.");
            return;
        }

        if (!uploadedImageUrl) {
            console.error("업로드된 이미지 URL이 없습니다.");
            return;
        }

        // 커스텀 템플릿 전송
        window.Kakao.Share.sendCustom({
            templateId: 115008, // 생성한 템플릿 ID
            templateArgs: {
                title: title || "기본 제목",
                imageUrl: uploadedImageUrl,
                storeName: storeName || "기본 매장명",
                content: content || "기본 내용",
                adsPk: adsPkValue,
                store_business_id: storeBusinessNumber,
            },
        });
    };

    return (
        <button onClick={handleShare} className="flex flex-col items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-md">
            <img
                src={require("../../../assets/sns/kakao.png")}
                alt="카카오톡 공유하기"
                className="w-8 h-8"
            />
        </button>
    );
};

export default AdsDeatilShareKakao;
