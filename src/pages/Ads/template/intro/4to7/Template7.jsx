import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template7 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const bgWidth = 1024; // 배경 이미지 가로 크기
    const bgHeight = 1792; // 배경 이미지 세로 크기

    const wantWidth = 1024; // 메인 이미지 가로 크기
    const wantHeight = 1792; // 메인 이미지 세로 크기

    const [editText, setEditText] = useState(text)

    const handleBlur = (e) => {
        setEditText(e.target.innerText);
    };

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
            ctx.lineTo(944, 569 + 1100,); // 끝점 (너비 189px)
            ctx.lineWidth = 5; // 선 두께
            ctx.strokeStyle = "#D9D9D9"; // 선 색상
            ctx.stroke();

            // ✅ 9. 선 추가 (위에서 1660px, 왼쪽에서 657px)
            ctx.beginPath();
            ctx.moveTo(80, 120); // 시작점 (고정)
            ctx.lineTo(80 + 477, 120); // 끝점 (storeName 위치에서 왼쪽으로 70px 떨어진 곳)
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

    const formatRoadName = (name) => {
        if (name.length > 17) {
            // 17번째 문자에서 줄 바꿈
            return name.slice(0, 16) + "\n" + name.slice(16);
        }
        return name;
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
                style={{ top: `${(1370 / 1792) * 100}%`, left: `${(99 / 1024) * 100}%` }}>
                <div className="flex flex-row">
                    <img
                        src="/assets/template_back/intro/4to7/ver7/site.png"
                        alt="매장 위치 아이콘"
                        className="pr-3 h-7"
                    />
                    <p className="text-white text-left overflow-hidden text-ellipsis pb-6"
                        style={{
                            color: "#FFF",
                            fontFeatureSettings: "'case' on",
                            fontFamily: "Pretendard",
                            fontSize: `${40 * (431 / 1024)}px`,
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: `${40 * (431 / 1024)}px`,
                            whiteSpace: "pre-wrap", // 줄 바꿈 허용
                            wordBreak: "break-word", // 긴 단어가 있을 경우 줄 바꿈
                        }}>
                        {formatRoadName(roadName)}
                    </p>
                </div>
                <div className="flex flex-row">
                    <img src="/assets/template_back/intro/4to7/ver7/clock.png"
                        alt="시계 아이콘"
                        className="pr-3 h-7"
                    />
                    <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur}
                        className={`editable-text blinking-cursor text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                        style={{
                            color: "#FFF",
                            fontFeatureSettings: "'case' on",
                            fontFamily: "Pretendard",
                            fontSize: `${40 * (431 / 1024)}px`,
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: `${40 * (431 / 1024)}px`,
                        }}
                        data-html2canvas-ignore={isCaptured ? "true" : "false"}
                    >
                        {editText}
                    </p>
                </div>
            </div>

            <div className="absolute w-[50%]"
                style={{ top: `${(111 / 1792) * 100}%`, right: `${(138 / 1024) * 100}%` }}>
                <p className="text-white text-right overflow-hidden text-ellipsis pb-8"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                        whiteSpace: "pre-wrap", // 줄 바꿈 허용
                        wordBreak: "break-word", // 긴 단어가 있을 경우 줄 바꿈
                    }}>
                    {formatStoreName(storeName)}
                </p>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className={`editable-text blinking-cursor text-right break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${64 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: `${70 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editText}
                </p>
            </div>
            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default Template7;
