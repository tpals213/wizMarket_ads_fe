import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template1 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
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
        
                // ✅ 최종 이미지 저장
                const finalImageUrl = canvas.toDataURL("image/png");
                setFinalImage(finalImageUrl);
            };
        }, [imageUrl, text]);

    const extractTexts = (text) => {
        let topText = "";
        let bottomText = "";

        // ✅ "제목 :", "내용 :"을 기준으로 나누기
        const titleMatch = text.match(/제목\s*:\s*([^내용]*)/);
        const contentMatch = text.match(/내용\s*:\s*(.*)/);

        if (titleMatch) topText = titleMatch[1].trim(); // ✅ 제목 값만 가져옴
        if (contentMatch) bottomText = contentMatch[1].trim(); // ✅ 내용 값만 가져옴

        return { topText, bottomText };
    };

    const { topText, bottomText } = extractTexts(text);

    const [editTopText, setEditTopText] = useState(topText)
    const [editBotText, setEditBotText] = useState(bottomText)
    
    const handleTop = (e) => {
        setEditTopText(e.target.innerText);
    };

    const handleBot = (e) => {
        setEditBotText(e.target.innerText);
    };


    return (
        <div id="template_event_4to7_1" className="relative">
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
                    background: "linear-gradient(180deg, rgba(2, 2, 2, 0.40) 0%, rgba(8, 32, 85, 0.00) 100%)"
                }}
            ></div>

            <div
                className="absolute left-0 w-[100%] h-[19.08%]"
                style={{
                    top: `${(1450 / 1792) * 100}%`,
                    background: "linear-gradient(180deg, rgba(41, 41, 41, 0.00) 0%, rgba(0, 0, 0, 0.40) 100%)"
                }}
            ></div>


            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-[80.5%]"
                style={{ top: `${(150 / 1792) * 100}%`, left: `${(80 / 1024) * 100}%` }}>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleTop}
                    className={`editable-text blinking-cursor pb-8 text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${110 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 900,
                        lineHeight: "normal"
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editTopText}
                </p>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBot}
                    className={`editable-text blinking-cursor text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${64 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: `${84 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editBotText}
                </p>
            </div>

            <div
                className="absolute w-full text-white text-center left-1/2 transform -translate-x-1/2"
                style={{
                    top: `${(1593 / 1792) * 100}%`,
                    color: "#FFF",
                    fontFeatureSettings: "'case' on",
                    fontFamily: "Pretendard",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "30px",
                }}
                >
                <p className="text-white text-center break-keep pb-2"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${50 * (431 / 1024)}px`,
                    }}>
                    {storeName}
                </p>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${50 * (431 / 1024)}px`,
                    }}>
                    {roadName}
                </p>
            </div>


            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template1;
