import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"


const Template3 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    // console.log(weather)
    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1024;

    // const topText = roadName.split(" ")[1] + " | " + tag + " | " + weather + " | " + weekday;


    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // 원본 이미지 크기
            const originalWidth = img.width;
            const originalHeight = img.height;

            // 목표 비율 계산
            const targetRatio = wantWidth / wantHeight;
            const originalRatio = originalWidth / originalHeight;

            let newWidth, newHeight;
            if (originalRatio > targetRatio) {
                newHeight = wantHeight;
                newWidth = Math.round(originalWidth * (wantHeight / originalHeight));
            } else {
                newWidth = wantWidth;
                newHeight = Math.round(originalHeight * (wantWidth / originalWidth));
            }

            // 캔버스 크기 설정
            canvas.width = wantWidth;
            canvas.height = wantHeight;

            // 중앙 크롭 계산
            const cropX = Math.round((newWidth - wantWidth) / 2);
            const cropY = Math.round((newHeight - wantHeight) / 2);

            // 리사이징 후 크롭하여 그리기
            ctx.drawImage(
                img,
                cropX, cropY, wantWidth, wantHeight, // 크롭된 부분
                0, 0, wantWidth, wantHeight // 캔버스에 맞게 배치
            );

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, text]);

    return (
        <div id="template_intro_1to1_3" className="relative">
            {/* ✅ 최종 이미지 출력 */}
            {finalImage ? (
                <img
                    src={finalImage}
                    alt="Template 4"
                    className="w-full h-full object-cover"
                />
            ) : (
                <p>이미지 로딩 중...</p>
            )}


            <div
                className="absolute top-0 left-0 w-full h-[30%]"
                style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(41, 41, 41, 0.00) 100%)"
                }}
            ></div>

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute text-white text-left top-[7.7%] left-[9.4%]">
                <p 
                    className="break-words whitespace-pre-line text-[36px] font-normal leading-normal pb-8"
                    style={{ 
                        fontFamily: "JejuHallasan, sans-serif",
                        fontStyle: "normal",
                        color: "#FFF" // 명확하게 설정
                    }}>
                    {storeName}
                </p>

                <p
                    className="break-words whitespace-pre-line font-bold"
                    style={{
                        fontFamily: "Pretendard",
                        fontSize: "32px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "35px",
                    }}
                >
                    {text}
                </p>
            </div>

            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template3;
