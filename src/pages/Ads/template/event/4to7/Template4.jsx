import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"


const Template4 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    // console.log(weather)
    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1792;

    const topStore = storeName + " | " + roadName.split(" ")[1] 


    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

        const topImg = new Image();
        topImg.src = "/assets/template_back/event/4to7/ver4/back_top.png"; // QR 코드 이미지
        topImg.crossOrigin = "Anonymous";

        const btImg = new Image();
        btImg.src = "/assets/template_back/event/4to7/ver4/back_bottom.png"; // QR 코드 이미지
        btImg.crossOrigin = "Anonymous";

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

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const topWidth = 1024;  
            const topHeight = 415;
            const topX = 0
            const topY = 0

            ctx.drawImage(topImg, topX, topY, topWidth, topHeight); 

            const btWidth = 1024;  
            const btHeight = 822;
            const btX = 0
            const btY = 970

            ctx.drawImage(btImg, btX, btY, btWidth, btHeight); 

            ctx.beginPath();
            ctx.moveTo(153, 103); // 시작점
            ctx.lineTo(153 + 700, 103); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(153, 208); // 시작점
            ctx.lineTo(153 + 700, 208); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

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


    return (
        <div id="template_event_4to7_4" className="relative">
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

            {/* ✅ 텍스트 오버레이 */}
            

            
            <div className="absolute top-[67.22%] left-[7.42%]">
                {/* ✅ 파란색 배경 (글씨보다 위아래 4px, 양옆 8px 크게 설정) */}
                <div className="bg-[#09C5FE] px-1 h-[24px] flex items-center justify-center">
                    {/* ✅ 텍스트 */}
                    <p className="text-white text-center font-pretendard text-[16px] font-normal leading-[16px]">
                        이벤트
                    </p>
                </div>
            </div>

            <div className="absolute w-[68.06%] top-[71.21%] left-[7.42%]">
                <p className="text-white text-left break-keep pb-12"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "32px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "32px",
                    }}>
                    {topText}
                </p>
                <p className="text-white text-left break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "26px",
                    }}>
                    {bottomText}
                </p>
            </div>


            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
            <div className="absolute w-full"
                style={{ top: `${(134 / 1792) * 100}%`, left: "50%",  transform: "translateX(-50%)"  }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "27.5px",
                        fontStyle: "normal",
                        fontWeight: 800,
                        lineHeight: "30px",
                    }}>
                    {topStore}
                </p>
            </div>

            <div className="absolute w-full"
                style={{ top: `${(1704 / 1792) * 100}%`, left: "50%",  transform: "translateX(-50%)"  }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
                    style={{
                        color: "rgba(255, 255, 255, 0.80)",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "20px",
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
export default Template4;
