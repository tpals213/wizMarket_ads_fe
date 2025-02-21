import React, { useEffect, useRef, useState } from "react";

const Template5 = ({ imageUrl, text, storeName, roadName }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

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
    
            // 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl]);
    

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
                style={{ top: `${(1418 / 1720) * 100}%`, left: `${(88 / 1024) * 100}%`}}>
                <p className="text-black text-[24px] text-center">{text}</p>
            </div>
            <div className="absolute"
                style={{ top: `${(1218 / 1720) * 100}%`, left: `${(88 / 1024) * 100}%`}}>
                <p className="text-black text-[64px] text-center">{storeName}</p>
            </div>
            <div className="absolute"
                style={{ top: `${(1620 / 1720) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-black text-lg text-center">{roadName}</p>
            </div>


            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template5;
