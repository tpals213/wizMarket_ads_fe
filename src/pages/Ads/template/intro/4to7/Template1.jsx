import React, { useEffect, useRef, useState } from "react";

const Template1 = ({ imageUrl, text, storeName, roadName }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const bgWidth = 1024; // 배경 이미지 가로 크기
    const bgHeight = 1792; // 배경 이미지 세로 크기

    const wantWidth = 815; // 메인 이미지 가로 크기
    const wantHeight = 1091; // 메인 이미지 세로 크기

    const imgTop = 55; // 메인 이미지 배치할 y 위치 (조절 가능)
    const imgLeft = 42; // 메인 이미지 배치할 x 위치 (조절 가능)

    useEffect(() => {
        if (!imageUrl) return;

        // ✅ 배경 이미지 로드
        const bgImg = new Image();
        bgImg.src = "/assets/template_back/intro/4to7/ver1/poster_image.png"; // 배경 이미지
        bgImg.crossOrigin = "Anonymous";

        const img = new Image();
        img.src = imageUrl; // 메인 이미지
        img.crossOrigin = "Anonymous";

        const qrImg = new Image();
        qrImg.src = "/assets/template_back/intro/4to7/ver1/qr.png"; // QR 코드 이미지
        qrImg.crossOrigin = "Anonymous";

        const seasonImg = new Image();
        seasonImg.src = "/assets/template_back/intro/4to7/ver1/season.png"; // QR 코드 이미지
        seasonImg.crossOrigin = "Anonymous";

        const numberImg = new Image();
        numberImg.src = "/assets/template_back/intro/4to7/ver1/1846.png"; // QR 코드 이미지
        numberImg.crossOrigin = "Anonymous";

        const wizAdImg = new Image();
        wizAdImg.src = "/assets/template_back/intro/4to7/ver1/wizad_madrid.png"; // QR 코드 이미지
        wizAdImg.crossOrigin = "Anonymous";

        let bgLoaded = false;
        let imgLoaded = false;
        let qrLoaded = false;
        let seasonLoaded = false;
        let numberLoaded = false;
        let wizAdLoaded = false;

        bgImg.onload = () => {
            bgLoaded = true;
            checkAllLoaded();
        };

        img.onload = () => {
            imgLoaded = true;
            checkAllLoaded();
        };

        qrImg.onload = () => {
            qrLoaded = true;
            checkAllLoaded();
        };

        seasonImg.onload = () => {
            seasonLoaded = true;
            checkAllLoaded();
        }

        numberImg.onload = () => {
            numberLoaded = true;
            checkAllLoaded();
        }

        wizAdImg.onload = () => {
            wizAdLoaded = true;
            checkAllLoaded();
        }

        function checkAllLoaded() {
            if (bgLoaded && imgLoaded && qrLoaded && seasonLoaded && numberLoaded && wizAdLoaded) {
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

            // ✅ 8. QR 코드 추가 (우측 하단)
            const qrWidth = 146;  // QR 코드 너비 (조절 가능)
            const qrHeight = 146; // QR 코드 높이 (조절 가능)
            const qrX = 46
            const qrY = 1552

            ctx.drawImage(qrImg, qrX, qrY, qrWidth, qrHeight); // 크롭 없이 그대로 추가

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const seasonWidth = 523;  
            const seasonHeight = 96;
            const seasonX = 289
            const seasonY = 1577

            ctx.drawImage(seasonImg, seasonX, seasonY, seasonWidth, seasonHeight); 

            // ✅ 10.숫자 코드 추가 (우측 하단)
            const numberWidth = 44;  
            const numberHeight = 139;
            const numberX = 955
            const numberY = 55

            ctx.drawImage(numberImg, numberX, numberY, numberWidth, numberHeight); 

            // ✅ 11. WIZAD 코드 추가 (우측 하단)
            const wizAdWidth = 70;  
            const wizAdHeight = 790;
            const wizAdX = 870
            const wizAdY = 55

            ctx.drawImage(wizAdImg, wizAdX, wizAdY, wizAdWidth, wizAdHeight); 

            // ✅ 8. 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        }

    }, [imageUrl]);

    return (
        <div id="template_intro_4to7_1" className="relative">
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
                style={{ top: `${(1161 / 1792) * 100}%`, left: `${(50 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#656565",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "32px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "33px",
                    }}>
                    {text}
                </p>
            </div>
            <div className="absolute"
                style={{ top: `${(1330 / 1792) * 100}%`, left: `${(50 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Do Hyeon",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "21px",
                    }}>
                    {storeName}
                </p>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Do Hyeon",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "21px",
                    }}>
                    {roadName}
                </p>
            </div>


            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default Template1;
