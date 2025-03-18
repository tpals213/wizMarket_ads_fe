import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template5 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    const [editText, setEditText] = useState(text)

    const handleBlur = (e) => {
        setEditText(e.target.innerText);
    };

    // ✅ 원본 크롭 영역 + 하단 흰색 영역
    const wantWidth = 1024;
    const wantHeight = 1207;
    const finalHeight = 1792; // 전체 캔버스 크기 (흰색 배경 포함)

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // 목표 크기
            const targetWidth = wantWidth;
            const targetHeight = wantHeight;
            const canvasHeight = finalHeight;

            // 원본 이미지 크기
            const originalWidth = img.width;
            const originalHeight = img.height;

            // 목표 비율과 원본 비율 비교
            const targetRatio = targetWidth / targetHeight;
            const originalRatio = originalWidth / originalHeight;

            let newWidth, newHeight;
            if (originalRatio > targetRatio) {
                // 가로가 더 긴 경우 → 세로를 맞추고 가로를 늘림
                newHeight = targetHeight;
                newWidth = Math.round(originalWidth * (targetHeight / originalHeight));
            } else {
                // 세로가 더 긴 경우 → 가로를 맞추고 세로를 늘림
                newWidth = targetWidth;
                newHeight = Math.round(originalHeight * (targetWidth / originalWidth));
            }

            // 캔버스 크기 설정
            canvas.width = targetWidth;
            canvas.height = canvasHeight;

            // 배경 흰색 채우기
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, targetWidth, canvasHeight);

            // 중앙 크롭 계산
            const cropX = Math.round((newWidth - targetWidth) / 2);
            const cropY = Math.round((newHeight - targetHeight) / 2);

            // 리사이징 후 크롭하여 그리기
            ctx.drawImage(
                img,
                cropX, cropY, targetWidth, targetHeight, // 크롭된 부분
                0, 0, targetWidth, targetHeight // 최종 캔버스에 배치
            );

            // ✅ 선 추가 (roadName 기준)
            const roadNameTop = Math.round(1650 / 1792 * canvasHeight); // roadName 위치 계산
            const leftPadding = 200; // roadName에서 10px 떨어진 거리
            const rightPadding = 200; // 오른쪽 끝에서 10px 떨어진 거리

            ctx.strokeStyle = "black"; // 선 색상
            ctx.lineWidth = 2; // 선 두께

            // 왼쪽 선: 이미지 왼쪽에서 roadName 왼쪽 - 10까지
            const roadNameLeft = canvas.width / 2 - ctx.measureText(roadName).width;
            ctx.beginPath();
            ctx.moveTo(0, roadNameTop);
            ctx.lineTo(roadNameLeft - leftPadding, roadNameTop);
            ctx.stroke();

            // 오른쪽 선: roadName 오른쪽 + 10에서 이미지 오른쪽 - 10까지
            const roadNameRight = canvas.width / 2 + ctx.measureText(roadName).width;
            ctx.beginPath();
            ctx.moveTo(roadNameRight + rightPadding, roadNameTop);
            ctx.lineTo(canvas.width , roadNameTop);
            ctx.stroke();

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, roadName]);

    const formatRoadName = (name) => {
        if (name.length > 25) {
            // 17번째 문자에서 줄 바꿈
            return name.slice(0, 25) + "\n" + name.slice(25);
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
        <div id="template_intro_4to7_5" className="relative">
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
                style={{ top: `${(1268 / 1792) * 100}%`, left: `${(68 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis pb-4"
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${86 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 300,
                        lineHeight: "normal",
                        whiteSpace: "pre-line", 
                    }}>
                    {formatStoreName(storeName)}
                </p>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className={`editable-text blinking-cursor text-left break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 200,
                        lineHeight: `${55 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editText}
                </p>
            </div>
            <div className="absolute w-full"
                style={{ top: `${(1615 / 1792) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center overflow-hidden text-ellipsis pb-4"
                    style={{
                        color: "#000",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${36 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 300,
                        lineHeight: `${50 * (431 / 1024)}px`,
                        whiteSpace: "pre-wrap", // 줄 바꿈 허용
                        wordBreak: "break-word", // 긴 단어가 있을 경우 줄 바꿈
                    }}>
                    {formatRoadName(roadName)}
                </p>
            </div>

            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template5;
