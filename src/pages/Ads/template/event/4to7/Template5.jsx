import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template5 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1792;

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지


        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // ✅ 🎯 캔버스 크기 명시적으로 설정 (중요!)
            canvas.width = wantWidth;
            canvas.height = wantHeight;

            // 원본 이미지 크기
            const originalWidth = img.width;
            const originalHeight = img.height;

            // 목표 크기
            const targetWidth = wantWidth;  // 원하는 가로 크기 (1024)
            const targetHeight = wantHeight;  // 원하는 세로 크기 (1792)

            // 목표 비율 계산
            const originalRatio = originalWidth / originalHeight;
            const targetRatio = targetWidth / targetHeight;

            let newWidth, newHeight;
            if (originalRatio > targetRatio) {
                // 원본 가로가 더 길면 → 세로를 기준으로 리사이징
                newHeight = targetHeight;
                newWidth = Math.round(originalWidth * (targetHeight / originalHeight));
            } else {
                // 원본 세로가 더 길면 → 가로를 기준으로 리사이징
                newWidth = targetWidth;
                newHeight = Math.round(originalHeight * (targetWidth / originalWidth));
            }

            // ✅ 4. `offscreenCanvas`에서 리사이징 수행
            const offscreenCanvas = document.createElement("canvas");
            offscreenCanvas.width = newWidth;
            offscreenCanvas.height = newHeight;
            const offscreenCtx = offscreenCanvas.getContext("2d");
            offscreenCtx.drawImage(img, 0, 0, newWidth, newHeight);

            // ✅ 5. 크롭 좌표 계산 (중앙 크롭)
            const cropX = Math.max(0, Math.round((newWidth - targetWidth) / 2));
            const cropY = Math.max(0, Math.round((newHeight - targetHeight) / 2));

            // ✅ 6. 최종 위치 계산 (배경 이미지 위에 배치)
            const imgX = 0; // 원하는 가로 위치
            const imgY = 0; // 원하는 세로 위치

            // ✅ 7. 최종 캔버스에 그리기 (크롭 후 배경 위에 배치)
            ctx.drawImage(
                offscreenCanvas,
                cropX, cropY, targetWidth, targetHeight,  // 크롭할 영역
                imgX, imgY, targetWidth, targetHeight  // 최종 캔버스 배치 위치
            );

            // 선 3
            ctx.beginPath();
            ctx.moveTo(267, 314); // 시작점
            ctx.lineTo(267 + 512, 314); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(267, 504); // 시작점
            ctx.lineTo(267 + 512, 504); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, roadName]);

    const extractTexts = (text) => {
        let top_text = "";
        let bottom_text = "";

        // ✅ "제목 :", "내용 :"을 기준으로 나누기
        const titleMatch = text.match(/제목\s*:\s*([^내용]*)/);
        const contentMatch = text.match(/내용\s*:\s*(.*)/);

        if (titleMatch) top_text = titleMatch[1].trim(); // ✅ 제목 값만 가져옴
        if (contentMatch) bottom_text = contentMatch[1].trim(); // ✅ 내용 값만 가져옴

        return { top_text, bottom_text };
    };

    const { top_text, bottom_text } = extractTexts(text);

    return (
        <div id="template_event_4to7_5" className="relative">
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

            {/* ✅ 오버레이 (linear-gradient 적용) */}
            <div
                className="absolute top-0 left-0 w-[100%] h-[43.24%]"
                style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(41, 41, 41, 0.00) 100%)"
                }}
            ></div>

            <div
                className="absolute top-[77.51%] left-0 w-[100%] h-[22.48%]"
                style={{
                    background: "linear-gradient(0deg, rgba(0, 0, 0, 0.80) 0%, rgba(41, 41, 41, 0.00) 100%)"
                }}
            ></div>

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute h-[9.5%] w-[50%] text-white text-center top-[18%] left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <p
                    className="break-words whitespace-pre-line font-extrabold text-[#ACACAC]"
                    style={{
                        fontSize: "clamp(1.75rem, 3vh, 2rem)",
                        lineHeight: "clamp(2rem, 4vh, 2.2rem)"
                    }}
                >
                    {top_text}
                </p>
            </div>

            <div className="absolute h-[30%] w-[84%] text-white text-center top-[30.2%] left-1/2 transform -translate-x-1/2">
                <p
                    className="break-keep whitespace-pre-line"
                    style={{
                        fontSize: "18px",
                        lineHeight: "40px",
                        fontWeight: 500
                    }}
                >
                    {bottom_text}
                </p>
            </div>

            <div className="absolute h-[10.9%] text-white text-center top-[12.6%] left-1/2 transform -translate-x-1/2">
                <p className="text-white text-left break-keep pb-12"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "JejuHallasan",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "32px",
                    }}>
                    {storeName}
                </p>
            </div>

            <div className="absolute top-[93.5%] w-[80%] text-white text-center left-1/2 transform -translate-x-1/2">
                <p
                    className="break-words whitespace-pre-line font-medium"
                    style={{
                        fontSize: "clamp(1.125rem, 2vh, 1.25rem)",
                        lineHeight: "clamp(1.5rem, 2.5vh, 1.75rem)"
                    }}
                >
                    {roadName}
                </p>
            </div>




            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template5;
