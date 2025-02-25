import React, { useEffect, useRef, useState } from "react";

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
    
            // ✅ 선 추가 (text 기준)
            ctx.strokeStyle = "white"; // 선 색상
            ctx.lineWidth = 4; // 선 두께
    
            // text 위치 계산
            const textTop = Math.round((878 / 1792) * wantHeight);
            const textLeft = wantWidth / 2;
            const textWidth = ctx.measureText(text).width;
    
            // 선을 text 위쪽 20px에 그림
            const lineY = textTop - 20;
            ctx.beginPath();
            ctx.moveTo(textLeft - textWidth * 2, lineY); // 왼쪽 시작점
            ctx.lineTo(textLeft + textWidth * 2, lineY); // 오른쪽 끝점
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
                    background: "rgba(0, 0, 0, 0.5)" // 검은색 반투명 배경
                }}
            ></div>

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-full"
                style={{ top: `${(878 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
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
                    top: `${(599 / 1792) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            >
                {/* ✅ 상하좌우 50px 더 큰 배경 div */}
                <div
                    className="relative px-[25px] py-[30px]"
                    style={{
                        background: "rgba(0, 0, 0, 0.50)", // 검은색 50% 투명도
                        display: "inline-block", // 텍스트 크기에 맞춤
                    }}
                >
                    {/* ✅ storeName 텍스트 */}
                    <p
                        className="text-white text-center overflow-hidden text-ellipsis"
                        style={{
                            color: "#FFF",
                            fontFamily: "Pretendard",
                            fontSize: "64px",
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
                    className="relative px-[40px] py-[9px]"
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
