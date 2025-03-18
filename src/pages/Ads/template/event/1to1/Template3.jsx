import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"


const Template3 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
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

        const topImg = new Image();
        topImg.src = "/assets/template_back/event/1to1/ver2/back_top.png"; // QR 코드 이미지
        topImg.crossOrigin = "Anonymous";

        const btImg = new Image();
        btImg.src = "/assets/template_back/event/1to1/ver2/back_bottom.png"; // QR 코드 이미지
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

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const topWidth = 1024;
            const topHeight = 173;
            const topX = 0
            const topY = 0

            ctx.drawImage(topImg, topX, topY, topWidth, topHeight);

            const btWidth = 1024;
            const btHeight = 490;
            const btX = 0
            const btY = 534

            ctx.drawImage(btImg, btX, btY, btWidth, btHeight);

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
        <div id="template_event_1to1_3" className="relative">
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
            <div className="absolute w-[80%] top-[11.09%] left-1/2 transform -translate-x-1/2">
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleTop}
                    className={`editable-text pb-4 blinking-cursor text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${55 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${60 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editTopText}
                </p>
            </div>


            <div className="absolute top-[58.98%] left-[7.42%]">
                {/* ✅ 파란색 배경 (글씨보다 위아래 4px, 양옆 8px 크게 설정) */}
                <div className="bg-[#09C5FE] px-1 h-[24px] flex items-center justify-center">
                    {/* ✅ 텍스트 */}
                    <p className="text-white text-center font-pretendard text-[16px] font-normal leading-[16px]">
                        이벤트
                    </p>
                </div>
            </div>

            <div className="absolute w-[70%] top-[66.21%] left-[7.42%]">
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBot}
                    className={`editable-text blinking-cursor text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${64 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editBotText}
                </p>
            </div>



            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
            <div className="absolute left-[7.42%]"
                style={{ top: `${(855 / 1024) * 100}%` }}>
                <p className="text-white text-left break-keep pb-2"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${48 * (431 / 1024)}px`,
                    }}>
                    {storeName}
                </p>
                <p className="text-white text-left break-keep"
                    style={{
                        color: "rgba(255, 255, 255, 0.80)",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${36 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${36 * (431 / 1024)}px`,
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
export default Template3;
