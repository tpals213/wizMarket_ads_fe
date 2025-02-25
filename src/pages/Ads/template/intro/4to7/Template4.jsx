import React, { useEffect, useRef, useState } from "react";

const Template4 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
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
                // 가로가 더 긴 경우 → 세로를 맞추고 가로를 늘림
                newHeight = wantHeight;
                newWidth = Math.round(originalWidth * (wantHeight / originalHeight));
            } else {
                // 세로가 더 긴 경우 → 가로를 맞추고 세로를 늘림
                newWidth = wantWidth;
                newHeight = Math.round(originalHeight * (wantWidth / originalWidth));
            }

            // 캔버스 크기 설정 (원본 크기 유지)
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
    }, [imageUrl, roadName]);

    return (
        <div id="template_intro_4to7_4" className="relative">
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
                className="absolute top-0 left-0 w-[512px] h-[529px]"
                style={{
                    background: "linear-gradient(180deg, rgba(2, 2, 2, 0.40) 0%, rgba(8, 32, 85, 0.00) 100%)"
                }}
            ></div>

            <div
                className="absolute top-[695px] left-0 w-[512px] h-[171px]"
                style={{
                    background: "linear-gradient(180deg, rgba(41, 41, 41, 0.00) 0%, rgba(0, 0, 0, 0.40) 100%)"
                }}
            ></div>


            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-[313px]"
                style={{ top: `${(484 / 1792) * 100}%`, left: `${(84 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                style={{
                    color: "#FFF",
                    fontFeatureSettings: "'case' on",
                    fontFamily: "Pretendard",
                    fontSize: "40px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "42px",
                    
                }}>
                    {text}
                </p>

            </div>
            <div className="absolute w-[320px]"
                style={{ top: `${(200 / 1792) * 100}%`, left: `${(84 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                style={{
                    color: "#FFF",
                    fontFeatureSettings: "'case' on",
                    fontFamily: "Pretendard",
                    fontSize: "55px",
                    fontStyle: "normal",
                    fontWeight: 900,
                    lineHeight: "60px",
                    
                }}>
                    {storeName}
                </p>
            </div>
            <div className="absolute w-full"
                style={{ top: `${(1598 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-[24px] text-center">{roadName}</p>
            </div>

            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template4;
