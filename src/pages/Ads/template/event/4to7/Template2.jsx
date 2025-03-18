import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template2 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);

    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1792;

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

        const seasonImg = new Image();
        seasonImg.src = "/assets/template_back/event/4to7/ver2/subtract.png"; // QR 코드 이미지
        seasonImg.crossOrigin = "Anonymous";

        const starImg = new Image();
        starImg.src = "/assets/template_back/event/4to7/ver2/star.png"; // QR 코드 이미지
        starImg.crossOrigin = "Anonymous";

        const groupImg = new Image();
        groupImg.src = "/assets/template_back/event/4to7/ver2/star2.png"; // QR 코드 이미지
        groupImg.crossOrigin = "Anonymous";


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
                // 가로가 더 긴 경우 → 세로를 맞추고 가로를 늘림
                newHeight = wantHeight;
                newWidth = Math.round(originalWidth * (wantHeight / originalHeight));
            } else {
                // 세로가 더 긴 경우 → 가로를 맞추고 세로를 늘림
                newWidth = wantWidth;
                newHeight = Math.round(originalHeight * (wantWidth / originalWidth));
            }

            // 캔버스 크기 설정 (원본 크기 유지)
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

            // ✅ 9. SEASON 코드 추가 (우측 하단)
            const seasonWidth = 1024;
            const seasonHeight = 422;
            const seasonX = 0
            const seasonY = 0

            ctx.drawImage(seasonImg, seasonX, seasonY, seasonWidth, seasonHeight);

            // ✅ 9. star 코드 추가 (우측 하단)
            const starWidth1 = 201;
            const starHeight1 = 201;
            const starX1 = 611
            const starY1 = 300
            ctx.drawImage(starImg, starX1, starY1, starWidth1, starHeight1);

            const starWidth2 = 176;
            const starHeight2 = 176;
            const starX2 = 37
            const starY2 = 570
            ctx.drawImage(starImg, starX2, starY2, starWidth2, starHeight2);

            const starWidth3 = 124;
            const starHeight3 = 124;
            const starX3 = 76
            const starY3 = 154
            ctx.drawImage(starImg, starX3, starY3, starWidth3, starHeight3);

            const starWidth4 = 127;
            const starHeight4 = 127;
            const starX4 = 831
            const starY4 = 128
            ctx.drawImage(starImg, starX4, starY4, starWidth4, starHeight4);

            const groupWidth = 222.8;
            const groupHeight = 216.93;
            const groupX = 449.44
            const groupY = 56.16
            ctx.drawImage(groupImg, groupX, groupY, groupWidth, groupHeight);

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, roadName]);

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

    return (
        <div id="template_event_4to7_2" className="relative">
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
                className="absolute top-0 left-0 w-[100%] h-[43.24%]"
                style={{
                    background: "linear-gradient(180deg, rgba(3, 17, 39, 0.66) 0%, rgba(6, 25, 63, 0.66) 51.5%, rgba(8, 32, 85, 0.00) 100%)"
                }}
            ></div>

            <div
                className="absolute top-[77.51%] left-0 w-[100%] h-[22.48%]"
                style={{
                    background: "linear-gradient(0deg, rgba(0, 0, 0, 0.66) 0%, rgba(8, 32, 85, 0.00) 100%)"
                }}
            ></div>



            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute w-[80.14%] text-white text-center left-1/2 transform -translate-x-1/2"
                style={{ top: `${(150 / 1792) * 100}%` }}>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleTop}
                    className={`editable-text blinking-cursor pb-6 text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "BlackAndWhitePicture",
                        fontSize: `${96 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: `${100 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editTopText}
                </p>
                <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBot}
                    className={`editable-text blinking-cursor text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${60 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: `${64 * (431 / 1024)}px`,
                    }}
                    data-html2canvas-ignore={isCaptured ? "true" : "false"}
                >
                    {editBotText}
                </p>
            </div>

            <div
                className="absolute w-full text-white text-center left-1/2 transform -translate-x-1/2"
                style={{
                    top: `${(1593 / 1792) * 100}%`,
                }}
            >
                <p className="text-white text-center break-keep pb-2"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: `${50 * (431 / 1024)}px`,
                    }}>
                    {storeName}
                </p>
                <p className="text-white text-center break-keep"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "Pretendard",
                        fontSize: `${48 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 500,
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

// ✅ default export 추가
export default Template2;
