import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template6 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const bgWidth = 1024; // 배경 이미지 가로 크기
    const bgHeight = 1792; // 배경 이미지 세로 크기

    const wantWidth = 730; // 메인 이미지 가로 크기
    const wantHeight = 730; // 메인 이미지 세로 크기

    const imgTop = 367; // 메인 이미지 배치할 y 위치 (조절 가능)

    const [editText, setEditText] = useState(text)
    
    const handleBlur = (e) => {
        setEditText(e.target.innerText);
    };

    useEffect(() => {
        if (!imageUrl) return;

        // ✅ 배경 이미지 로드
        const bgImg = new Image();
        bgImg.src = "/assets/template_back/intro/4to7/ver6/white-paper-texture-background 1.png"; // 배경 이미지
        bgImg.crossOrigin = "Anonymous";

        const img = new Image();
        img.src = imageUrl; // 메인 이미지
        img.crossOrigin = "Anonymous";

        // ✅ 배경 이미지 로드
        const siteImg = new Image();
        siteImg.src = "/assets/template_back/intro/4to7/ver6/site_icon.png"; // 배경 이미지
        siteImg.crossOrigin = "Anonymous";

        let bgLoaded = false;
        let imgLoaded = false;
        let siteLoaded = false;

        bgImg.onload = () => {
            bgLoaded = true;
            checkAllLoaded();
        };

        img.onload = () => {
            imgLoaded = true;
            checkAllLoaded();
        };

        siteImg.onload = () => {
            siteLoaded = true;
            checkAllLoaded();
        };


        function checkAllLoaded() {
            if (bgLoaded && imgLoaded && siteLoaded) {
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
                newHeight = targetHeight;
                newWidth = Math.round(originalWidth * (targetHeight / originalHeight));
            } else {
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
            const imgX = (bgWidth - targetWidth) / 2; // 가로 중앙 정렬
            const imgY = imgTop; // 원하는 세로 위치

            // ✅ 7. 흰색 사각형 추가 (메인 이미지 바로 아래)
            const rectWidth = 730;
            const rectHeight = 243;
            const rectX = (bgWidth - rectWidth) / 2; // 가로 중앙 정렬
            const rectY = imgY + targetHeight; // 메인 이미지 바로 아래 붙이기

            // ✅ 8. 그림자 설정 (우측 & 하단 방향)
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // 그림자 색상 (진한 검은색, 60% 투명)
            ctx.shadowBlur = 50; // 그림자가 부드럽게 퍼지는 정도 (위/왼쪽엔 최소한으로 퍼지게)
            ctx.shadowOffsetX = 30; // 그림자를 오른쪽으로 이동
            ctx.shadowOffsetY = 30; // 그림자를 아래쪽으로 이동

            // ✅ 9. 최종 캔버스에 메인 이미지 그리기 (크롭 후 배경 위에 배치)
            ctx.drawImage(
                offscreenCanvas,
                cropX, cropY, targetWidth, targetHeight,  // 크롭할 영역
                imgX, imgY, targetWidth, targetHeight  // 최종 캔버스 배치 위치
            );

            // ✅ 10. 흰색 사각형 그리기 (그림자 효과 포함됨)
            ctx.fillStyle = "white";
            ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

            // ✅ 11. 그림자 제거 (다른 요소에는 적용되지 않도록)
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;


            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(657, 1660); // 시작점
            ctx.lineTo(657 + 189, 1660); // 끝점 (너비 189px)
            ctx.lineWidth = 4; // 선 두께
            ctx.strokeStyle = "#C4052A"; // 선 색상
            ctx.stroke();

            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(119, 243); // 시작점
            ctx.lineTo(119 + 189, 243); // 끝점 (너비 189px)
            ctx.lineWidth = 4; // 선 두께
            ctx.strokeStyle = "#C4052A"; // 선 색상
            ctx.stroke();


            // ✅ 9. SITE 이미지 추가 (마지막으로 배치)
            const siteWidth = 44;
            const siteHeight = 44;
            const siteX = (bgWidth - siteWidth) / 2; // 중앙 정렬
            const siteY = 1126;

            ctx.drawImage(siteImg, siteX, siteY, siteWidth, siteHeight);

            // ✅ 10. 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        }


    }, [imageUrl]);

    return (
        <div id="template_intro_4to7_6" className="relative">
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
            <div className="absolute"
                style={{ top: `${(1478 / 1792) * 100}%`, right: `${(149 / 1024) * 100}%` }}>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className={`editable-text blinking-cursor text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${36 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: `${50 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editText}
                </p>
            </div>
            <div className="absolute"
                style={{ top: `${(1177 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-left break-keep font-extrabold"
                    style={{
                        color: "#C4052A",
                        fontFamily: "Pretendard",
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        lineHeight: `${50 * (431 / 1024)}px`,
                        fontWeight: 800,
                    }}>
                    {storeName}
                </p>
            </div>
            <div className="absolute"
                style={{ top: `${(183 / 1792) * 100}%`, left: `${(119 / 1024) * 100}%` }}>
                <p className="text-white text-left break-keep"
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${30 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: `${40 * (431 / 1024)}px`,
                        letterSpacing: `${3 * (431 / 1024)}px`,
                    }}>
                    {storeName}
                </p>
            </div>
            <div className="absolute w-full"
                style={{ top: `${(1262 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "rgba(0, 0, 0, 0.80)",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${30 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 200,
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

export default Template6;
