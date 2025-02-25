import React, { useEffect, useRef, useState } from "react";

const Template7 = ({ imageUrl, text, storeName, roadName }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const bgWidth = 1024; // 배경 이미지 가로 크기
    const bgHeight = 1792; // 배경 이미지 세로 크기

    const wantWidth = 1024; // 메인 이미지 가로 크기
    const wantHeight = 1792; // 메인 이미지 세로 크기

    useEffect(() => {
        if (!imageUrl) return;

        // ✅ 배경 이미지 로드
        const bgImg = new Image();
        bgImg.src = "/assets/template_back/intro/4to7/ver7/ads_back_intro_4_7_ver_7_back_gray.png"; // 배경 이미지
        bgImg.crossOrigin = "Anonymous";

        const img = new Image();
        img.src = imageUrl; // 메인 이미지
        img.crossOrigin = "Anonymous";

        // ✅ 배경 이미지 로드
        const siteImg = new Image();
        siteImg.src = "/assets/template_back/intro/4to7/ver7/site.png"; // 배경 이미지
        siteImg.crossOrigin = "Anonymous";

        // ✅ 배경 이미지 로드
        const clockImg = new Image();
        clockImg.src = "/assets/template_back/intro/4to7/ver7/clock.png"; // 배경 이미지
        clockImg.crossOrigin = "Anonymous";

        let bgLoaded = false;
        let imgLoaded = false;
        let siteLoaded = false;
        let clockLoaded = false;

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

        clockImg.onload = () => {
            clockLoaded = true;
            checkAllLoaded();
        }


        function checkAllLoaded() {
            if (bgLoaded && imgLoaded && siteLoaded && clockLoaded) {
                processCanvas();
            }
        }

        function processCanvas() {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
        
            canvas.width = bgWidth;  // 배경 크기 (1024)
            canvas.height = bgHeight; // 배경 크기 (1792)
        
            // ✅ 1. 메인 이미지 먼저 배치 (Z축 아래쪽)
            ctx.drawImage(bgImg, 0, 0, bgWidth, bgHeight);
        
            // ✅ 2. 원본 이미지 크기 가져오기
            const originalWidth = img.width;
            const originalHeight = img.height;
        
            // 목표 크기
            const targetWidth = wantWidth;
            const targetHeight = wantHeight;
        
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
            const imgX = 0
            const imgY = 0
        
            // ✅ 7. 최종 캔버스에 메인 이미지 그리기 (크롭 후 배경 위에 배치)
            ctx.drawImage(
                offscreenCanvas,
                cropX, cropY, targetWidth, targetHeight,
                imgX, imgY, targetWidth, targetHeight
            );
        
            // ✅ 8. **여기서 메인 이미지 위에 배경 이미지 덮어씌우기 (Z축 위쪽)**
            ctx.drawImage(bgImg, 0, 0, bgWidth, bgHeight);
        
            // ✅ 9. SITE 이미지 추가 (마지막으로 배치)
            const siteWidth = 36;
            const siteHeight = 44;
            const siteX = 99 // 중앙 정렬
            const siteY = 1397;
        
            ctx.drawImage(siteImg, siteX, siteY, siteWidth, siteHeight);

            // ✅ 9. SITE 이미지 추가 (마지막으로 배치)
            const clockWidth = 40;
            const clockHeight = 44;
            const clockX = 99 // 중앙 정렬
            const clockY = 1467;
        
            ctx.drawImage(clockImg, clockX, clockY, clockWidth, clockHeight);
        
            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(467, 1667.17); // 시작점
            ctx.lineTo(467 + 477, 1667.17); // 끝점 (너비 189px)
            ctx.lineWidth = 5; // 선 두께
            ctx.strokeStyle = "#D9D9D9"; // 선 색상
            ctx.stroke();

            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(944, 569); // 시작점
            ctx.lineTo(944, 569+ 1100,); // 끝점 (너비 189px)
            ctx.lineWidth = 5; // 선 두께
            ctx.strokeStyle = "#D9D9D9"; // 선 색상
            ctx.stroke();

            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(80, 120); // 시작점
            ctx.lineTo(80 + 477, 120); // 끝점 (너비 189px)
            ctx.lineWidth = 5; // 선 두께
            ctx.strokeStyle = "#D9D9D9"; // 선 색상
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(80, 120); // 시작점
            ctx.lineTo(80, 120 + 1142); // 끝점 (너비 189px)
            ctx.lineWidth = 5; // 선 두께
            ctx.strokeStyle = "#D9D9D9"; // 선 색상
            ctx.stroke();

            // ✅ 10. 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        }
        


    }, [imageUrl]);

    return (
        <div id="template_intro_4to7_7" className="relative">
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
                style={{ top: `${(1442 / 1792) * 100}%`, left: `${(157 / 1024) * 100}%`  }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "40px",

                    }}>
                    {text}
                </p>
            </div>
            
            <div className="absolute"
                style={{ top: `${(100 / 1792) * 100}%`, right: `${(138 / 1024) * 100}%` }}>
                <p className="text-white text-right overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "40px",

                    }}>
                    {storeName}
                </p>
            </div>
            <div className="absolute w-full"
                style={{ top: `${(1374 / 1792) * 100}%`, left: `${(157 / 1024) * 100}%`  }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "40px",

                    }}>
                    {roadName}
                </p>
            </div>


            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default Template7;
