import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template3 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const bgWidth = 1024; // 배경 이미지 가로 크기
    const bgHeight = 1792; // 배경 이미지 세로 크기

    const wantWidth = 876; // 메인 이미지 가로 크기
    const wantHeight = 876; // 메인 이미지 세로 크기

    const imgTop = 627; // 메인 이미지 배치할 y 위치 (조절 가능)
    const imgLeft = (bgWidth - wantWidth) / 2;

    useEffect(() => {
        if (!imageUrl) return;

        // ✅ 배경 이미지 로드
        const bgImg = new Image();
        bgImg.src = "/assets/template_back/event/4to7/ver3/gray_image.png"; // 배경 이미지
        bgImg.crossOrigin = "Anonymous";

        const img = new Image();
        img.src = imageUrl; // 메인 이미지
        img.crossOrigin = "Anonymous";

        let bgLoaded = false;
        let imgLoaded = false;


        bgImg.onload = () => {
            bgLoaded = true;
            checkAllLoaded();
        };

        img.onload = () => {
            imgLoaded = true;
            checkAllLoaded();
        };

        function checkAllLoaded() {
            if (bgLoaded && imgLoaded) {
                processCanvas();
            }
        }

        function processCanvas() {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = bgWidth;  // 배경 크기 (1024)
            canvas.height = bgHeight; // 배경 크기 (1792)

            // ✅ 1. 배경 이미지 먼저 캔버스에 그리기
            ctx.drawImage(bgImg, 0, 0, bgWidth, bgHeight);

            // ✅ 2. 원본 이미지 크기 가져오기
            const originalWidth = img.width;
            const originalHeight = img.height;

            // 목표 크기
            const targetWidth = wantWidth;  // 원하는 가로 크기 (815)
            const targetHeight = wantHeight;  // 원하는 세로 크기 (1091)

            // ✅ 3. 비율 유지하면서 리사이징 (resize)
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
            const imgX = imgLeft; // 원하는 가로 위치
            const imgY = imgTop; // 원하는 세로 위치

            // ✅ 7. 최종 캔버스에 그리기 (크롭 후 배경 위에 배치)
            ctx.drawImage(
                offscreenCanvas,
                cropX, cropY, targetWidth, targetHeight,  // 크롭할 영역
                imgX, imgY, targetWidth, targetHeight  // 최종 캔버스 배치 위치
            );

            // ✅ 8. 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        }

    }, [imageUrl, imgLeft]);

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

    const formatStoreName = (name) => {
        const chunkSize = 8;
        let result = "";
        for (let i = 0; i < name.length; i += chunkSize) {
            result += name.slice(i, i + chunkSize) + "\n";
        }
        return result.trim();
    };

    return (
        <div id="template_event_4to7_3" className="relative">
            {/* ✅ 최종 이미지 출력 */}
            {finalImage ? (
                <img
                    src={finalImage}
                    alt="Template 5"
                    className="w-full h-full object-cover border-4 border-black"
                />
            ) : (
                <p>이미지 로딩 중...</p>
            )}

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-full"
                style={{ top: `${(108 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleTop}
                    className={`editable-text blinking-cursor pb-8 text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#7F624C",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${55 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editTopText}
                </p>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#7F624C",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${128 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 800,
                        lineHeight: `${130 * (431 / 1024)}px`,
                        whiteSpace: "pre-line",
                    }}>
                    {formatStoreName(storeName)}
                </p>
            </div>
            <div className="absolute w-[80%]"
                style={{ top: `${(1550 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBot}
                    className={`editable-text blinking-cursor text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#7F624C",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${36 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${48 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editBotText}
                </p>
            </div>

            <div
                className="absolute w-full flex items-center justify-center"
                style={{
                    top: `${(550 / 1792) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            >
                <img
                    src={require("../../../../../assets/icon/site.png")}
                    alt="위즈 아이콘"
                    className="w-[18px] h-[22px] mr-1" // 오른쪽 여백 추가
                />
                <p
                    className="text-white text-center"
                    style={{
                        color: "#7F624C",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${40 * (431 / 1024)}px`,
                        margin: 0, // 기본 마진 제거
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

export default Template3;
