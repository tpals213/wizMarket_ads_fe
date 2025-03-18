import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"
import "../../../../../styles/templateText.css"

const Template2 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    // console.log(weather)
    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1792;

    const topText = roadName.split(" ")[1] + " | " + tag + " | " + weather + " | " + weekday;

    const [editText, setEditText] = useState(text)

    const handleBlur = (e) => {
        setEditText(e.target.innerText);
    };

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

    const formatStoreName = (name) => {
        const chunkSize = 8;
        let result = "";
        for (let i = 0; i < name.length; i += chunkSize) {
            result += name.slice(i, i + chunkSize) + "\n";
        }
        return result.trim();
    };



    return (
        <div id="template_intro_4to7_2" className="relative">
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
                className="absolute top-0 left-0 w-full h-[50%]"
                style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(41, 41, 41, 0.00) 100%)"
                }}
            ></div>

            <div
                className="absolute w-[90%] flex flex-col items-center"
                style={{ top: `${(328 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}
            >
                <p className="text-white text-center pb-4"
                    style={{
                        fontFamily: "Diphylleia",
                        fontSize: `${36 * (431 / 1024)}px`,
                        fontWeight: 400,
                        lineHeight: `${42 * (431 / 1024)}px`,
                    }}>
                    {topText}
                </p>
                <p className="text-white text-center pb-8"
                    style={{
                        fontFamily: "Diphylleia",
                        fontSize: `${96 * (431 / 1024)}px`,
                        fontWeight: 400,
                        lineHeight: `${110 * (431 / 1024)}px`,
                        whiteSpace: "pre-line", // 
                    }}>
                    {formatStoreName(storeName)}
                </p>
                <div
                    className="text-center px-4 py-2 flex justify-center"
                    style={{
                        backgroundColor: "#FFF",
                        width: "fit-content",
                        padding: "8px 8px",
                    }}
                >
                    <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur}
                        className={`editable-text blinking-cursor text-center relative ${isCaptured ? "no-blinking" : ""
                            }`}
                        style={{
                            color: "#000",
                            fontFamily: "Diphylleia",
                            fontSize: `${36 * (431 / 1024)}px`,
                            fontWeight: 400,
                            lineHeight: `${42 * (431 / 1024)}px`,
                        }}
                        data-html2canvas-ignore={isCaptured ? "true" : "false"}
                    >
                        {editText}
                    </p>
                </div>
            </div>


            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template2;
