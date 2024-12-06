import React, { useEffect, useState } from "react";

const AdsShareKakao = ({ title, content, storeName, storeBusinessNumber, base64Image, onSave }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isSaved, setIsSaved] = useState(false); // 이미 저장된지 여부 추적

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

    const base64ToBlob = (base64Data) => {
        const byteString = atob(base64Data.split(",")[1]); // Base64 데이터 디코딩
        const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0]; // MIME 타입 추출
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([byteArray], { type: mimeString });
    };

    useEffect(() => {
        const uploadImage = async () => {
            if (!base64Image) {
                console.log("업로드할 이미지 데이터가 없습니다.");
                return;
            }
            try {
                const blob = base64ToBlob(base64Image);
                const file = new File([blob], "uploaded_image.png", { type: "image/png" });

                const response = await window.Kakao.Share.uploadImage({
                    file: [file],
                });

                const imageUrl = response.infos.original.url;
                setUploadedImageUrl(imageUrl);
            } catch (error) {
                console.error("이미지 업로드 중 오류 발생:", error);
            }
        };

        if (base64Image) {
            uploadImage();
        }
    }, [base64Image]);

    const handleShare = async () => {
        if (!window.Kakao) {
            console.error("카카오 SDK가 로드되지 않았습니다.");
            return;
        }

        if (!window.Kakao.isInitialized()) {
            console.error("카카오 SDK가 초기화되지 않았습니다.");
            return;
        }

        let adsPkValue; // 로컬 변수로 adsPk 값 초기화
        if (!isSaved && onSave) {
            // 저장이 안 되었을 때만 저장 수행
            try {
                adsPkValue = await onSave(); // onSave 실행 후 adsPk 값 받기
                setIsSaved(true); // 저장 여부 업데이트
                console.log("Ads PK Value:", adsPkValue);
            } catch (error) {
                console.error("onSave 실행 중 오류 발생:", error);
                return; // 오류 발생 시 카카오톡 공유 실행 중단
            }
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
        <button onClick={handleShare} className="focus:outline-none">
            <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                alt="카카오톡 공유하기"
                style={{ height: "40px" }} // 필요에 따라 크기 조정
            />
        </button>
    );
};

export default AdsShareKakao;
