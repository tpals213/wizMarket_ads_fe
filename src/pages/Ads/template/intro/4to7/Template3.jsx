import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template3 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
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

            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(216, 836); // 시작점
            ctx.lineTo(216 + 549, 836); // 끝점 (너비 189px)
            ctx.lineWidth = 4; // 선 두께
            ctx.strokeStyle = "#FFF"; // 선 색상
            ctx.stroke();

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, text]);


    return (
        <div id="template_intro_4to7_3" className="relative">
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
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    background: "rgba(0, 0, 0, 0.3)" // 검은색 반투명 배경
                }}
            ></div>

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-[80%]"
                style={{ top: `${(878 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center overflow-hidden text-ellipsis break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "42px",

                    }}>
                    {text}
                </p>

            </div>
            <div
                className="absolute w-full flex justify-center"
                style={{
                    top: `${(509 / 1792) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            >
                {/* ✅ 상하좌우 50px 더 큰 배경 div */}
                <div
                    className="relative px-6 py-7"
                    style={{
                        background: "rgba(0, 0, 0, 0.50)", // 검은색 50% 투명도
                        display: "inline-block", // 텍스트 크기에 맞춤
                    }}
                >
                    {/* ✅ storeName 텍스트 */}
                    <p
                        className="text-white text-center overflow-hidden text-ellipsis break-keep"
                        style={{
                            color: "#FFF",
                            fontFamily: "Pretendard",
                            fontSize: "32px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "55px",
                        }}
                    >
                        {storeName}
                    </p>
                </div>
            </div>

            <div
                className="absolute w-full flex justify-center"
                style={{
                    top: `${(1506 / 1792) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            >
                {/* ✅ 상하좌우 50px 더 큰 배경 div */}
                <div
                    className="relative px-[30px] py-[5px]"
                    style={{
                        background: "rgba(0, 0, 0, 0.50)", // 검은색 50% 투명도
                        display: "inline-block", // 텍스트 크기에 맞춤
                    }}
                >
                    {/* ✅ storeName 텍스트 */}
                    <p
                        className="text-white text-center overflow-hidden text-ellipsis"
                        style={{
                            color: "rgba(255, 255, 255, 0.80)",
                            fontFamily: "Pretendard",
                            fontSize: "18px",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "50px",
                        }}
                    >
                        {roadName}
                    </p>
                </div>
            </div>

            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template3;
