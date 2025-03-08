import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template1 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    // console.log(weather)
    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1024;

    const topText = roadName.split(" ")[1] + " | " + tag + " | " + weather + " | " + weekday;


    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

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

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, text]);


    return (
        <div id="template_intro_1to1_1" className="relative">
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
                className="absolute top-0 left-0 w-full h-[30%]"
                style={{
                    background: "linear-gradient(180deg, rgba(28, 28, 28, 0.00) 0%, rgba(0, 0, 0, 0.50) 50.24%, rgba(28, 28, 28, 0.00) 96.34%)"
                }}
            ></div>

            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute"
                style={{
                    top: `${(447 / 1024) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}>
                {/* ✅ 흰색 배경 박스 */}
                <div
                    className="text-center px-4 py-2"
                    style={{
                        backgroundColor: "#FFF", // ✅ 흰색 배경
                        display: "inline-block", // ✅ 텍스트 크기에 맞춤
                        padding: "8px 8px", // ✅ 여백 추가
                    }}>
                    {/* ✅ 텍스트 */}
                    <p
                        className="text-black text-center overflow-hidden text-ellipsis"
                        style={{
                            fontFeatureSettings: "'case' on",
                            fontFamily: "'Diphylleia', sans-serif",
                            fontSize: "18px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "21px",
                        }}>
                        {text}
                    </p>
                </div>
            </div>



            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
            <div className="absolute"
                style={{ top: `${(254 / 1024) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Diphylleia",
                        fontSize: "48px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "84px",

                    }}>
                    {storeName}
                </p>
            </div>


            <div className="absolute w-full"
                style={{ top: `${(150 / 1024) * 100}%`, left: "50%", transform: "translateX(-50%)" }}>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Diphylleia",
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "42px",
                    }}>
                    {topText}
                </p>
            </div>

            {/* ✅ Canvas (숨김 처리) */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ✅ default export 추가
export default Template1;
