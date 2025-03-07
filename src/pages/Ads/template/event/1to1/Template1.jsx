import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"


const Template1 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
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

        const hotImg = new Image();
        hotImg.src = "/assets/template_back/event/1to1/ver1/hot_icon.png"; // QR 코드 이미지
        hotImg.crossOrigin = "Anonymous";

        const topImg = new Image();
        topImg.src = "/assets/template_back/event/1to1/ver1/back_top.png"; // QR 코드 이미지
        topImg.crossOrigin = "Anonymous";

        const btImg = new Image();
        btImg.src = "/assets/template_back/event/1to1/ver1/back_bottom.png"; // QR 코드 이미지
        btImg.crossOrigin = "Anonymous";

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

            ctx.beginPath();
            ctx.moveTo(153, 100); // 시작점
            ctx.lineTo(153 + 721, 100); // 끝점 (너비 189px)
            ctx.lineWidth = 4; // 선 두께
            ctx.strokeStyle = "#FFF"; // 선 색상
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(153, 188); // 시작점
            ctx.lineTo(153 + 721, 188); // 끝점 (너비 189px)
            ctx.lineWidth = 4; // 선 두께
            ctx.strokeStyle = "#FFF"; // 선 색상
            ctx.stroke();

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const hotWidth = 211;  
            const hotHeight = 211;
            const hotX = 647
            const hotY = 710

            ctx.drawImage(hotImg, hotX, hotY, hotWidth, hotHeight); 

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const topWidth = 1024;  
            const topHeight = 423;
            const topX = 0
            const topY = 0

            ctx.drawImage(topImg, topX, topY, topWidth, topHeight); 

            const btWidth = 1024;  
            const btHeight = 220;
            const btX = 0
            const btY = 804

            ctx.drawImage(btImg, btX, btY, btWidth, btHeight); 

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, text]);

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
        <div id="template_event_1to1_1" className="relative">
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
            <div className="absolute w-full top-[11.09%] left-1/2 transform -translate-x-1/2">
            <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "27.5px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "30px",
                    }}>
                    {top_text}
                </p>
            </div>


            <div className="absolute w-[77.73%] top-[24.56%] left-1/2 transform -translate-x-1/2">
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFFB00",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "JalnanGothicTTF",
                        fontSize: "39px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "48px",
                    }}>
                    {bottom_text}
                </p>
            </div>



            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
            <div className="absolute"
                style={{ top: `${(870 / 1024) * 100}%`, left: "50%",  transform: "translateX(-50%)"  }}>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 800,
                        lineHeight: "20px",
                    }}>
                    {storeName}
                </p>
            </div>

            <div className="absolute w-full"
                style={{ top: `${(900 / 1024) * 100}%`, left: "50%",  transform: "translateX(-50%)"  }}>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "rgba(255, 255, 255, 0.80)",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "50px",
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
