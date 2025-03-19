import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"


const Template4 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
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


    const formatTop = (name) => {
        const chunkSize = 11;
        let result = "";
        for (let i = 0; i < name.length; i += chunkSize) {
            result += name.slice(i, i + chunkSize) + "\n";
        }
        return result.trim();
    };


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

            <div className="absolute w-[68.06%] top-[71.91%] left-[7.42%]">
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleTop}
                    className={`editable-text blinking-cursor pb-8 text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${64 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${70 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editTopText}
                </p>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBot}
                    className={`editable-text blinking-cursor pb-8 text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${52 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editBotText}
                </p>
            </div>


            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
            <div className="absolute w-[65%]"
                style={{ top: `${(128 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${55 * (431 / 1024)}px`, // ✅ 적용 안될 경우 대비해서 span에도 적용
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${60 * (431 / 1024)}px`,
                        whiteSpace: "pre-line",
                    }}>
                    {formatTop(topStore).split("\n").map((line, index, array) => (
                        <span key={index}
                            style={{
                                display: "block",
                                borderTop: index === 0 ? "2px solid white" : "none", // 첫 줄 위에 선 추가
                                borderBottom: index === array.length - 1 ? "2px solid white" : "none", // 마지막 줄 아래에 선 추가
                                fontSize: `${55 * (431 / 1024)}px`, // ✅ span에도 폰트 크기 적용
                                fontWeight: 700, // ✅ 글자 두께 유지
                                lineHeight: `${60 * (431 / 1024)}px`, // ✅ 줄 간격 유지
                            }}>
                            {line}
                        </span>
                    ))}
                </p>
            </div>

            <div className="absolute w-full"
                style={{ top: `${(1702 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
                    style={{
                        color: "rgba(255, 255, 255, 0.80)",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${32 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${40 * (431 / 1024)}px`,
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
