import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/templateFont.css"

const Template2 = ({ imageUrl, text, storeName, roadName, isCaptured }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    // console.log(weather)
    // ✅ 크롭 영역 (원본 크기 유지)
    const wantWidth = 1024;
    const wantHeight = 1024;

    // const topText = roadName.split(" ")[1] + " | " + tag + " | " + weather + " | " + weekday;


    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous"; // 크로스 도메인 문제 방지

        const bgImg = new Image();
        bgImg.src = "/assets/template_back/intro/1to1/ver2/back.png"; // QR 코드 이미지
        bgImg.crossOrigin = "Anonymous";

        const cameraImg = new Image();
        cameraImg.src = "/assets/template_back/intro/1to1/ver2/camera.png"; // QR 코드 이미지
        cameraImg.crossOrigin = "Anonymous";

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

            // 선 1
            ctx.beginPath();
            ctx.moveTo(10, 100); // 시작점
            ctx.lineTo(10 + 161, 100); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 2
            ctx.beginPath();
            ctx.moveTo(10, 100); // 시작점
            ctx.lineTo(10, 100 + 161); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 3
            ctx.beginPath();
            ctx.moveTo(497, 100); // 시작점
            ctx.lineTo(497 + 161, 100); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 4
            ctx.beginPath();
            ctx.moveTo(497 + 161, 100); // 시작점
            ctx.lineTo(497 + 161, 100 + 161); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 5
            ctx.beginPath();
            ctx.moveTo(10, 833 + 161); // 시작점
            ctx.lineTo(10 + 161, 833 + 161); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 6
            ctx.beginPath();
            ctx.moveTo(10, 833); // 시작점
            ctx.lineTo(10, 833 + 161); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 7
            ctx.beginPath();
            ctx.moveTo(484, 833 + 161); // 시작점
            ctx.lineTo(484 + 161, 833 + 161); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 8
            ctx.beginPath();
            ctx.moveTo(484 + 161, 833 + 161); // 시작점
            ctx.lineTo(484 + 161, 833); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            ///////////////////////// 안쪽 선 //////////////////////////
            // 선 1
            ctx.beginPath();
            ctx.moveTo(35, 129); // 시작점
            ctx.lineTo(35 + 570, 129); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 2
            ctx.beginPath();
            ctx.moveTo(35, 974); // 시작점
            ctx.lineTo(35 + 570, 974); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 3
            ctx.beginPath();
            ctx.moveTo(20, 139); // 시작점
            ctx.lineTo(20, 139 + 788); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // 선 4
            ctx.beginPath();
            ctx.moveTo(633, 139); // 시작점
            ctx.lineTo(633, 139 + 788); // 끝점 (너비 189px)
            ctx.lineWidth = 2; // 선 두께
            ctx.strokeStyle = "#FFFFFF"; // 선 색상
            ctx.stroke();

            // ✅ 8. QR 코드 추가 (우측 하단)
            const backWidth = 571;  // QR 코드 너비 (조절 가능)
            const backHeight = 1024; // QR 코드 높이 (조절 가능)
            const backX = 453
            const backY = 0

            ctx.drawImage(bgImg, backX, backY, backWidth, backHeight); // 크롭 없이 그대로 추가

            // ✅ 8. QR 코드 추가 (우측 하단)
            const cameraWidth = 127;  // QR 코드 너비 (조절 가능)
            const cameraHeight = 82; // QR 코드 높이 (조절 가능)
            const cameraX = 35
            const cameraY = 139

            ctx.drawImage(cameraImg, cameraX, cameraY, cameraWidth, cameraHeight); // 크롭 없이 그대로 추가

            // ✅ 최종 이미지 저장
            const finalImageUrl = canvas.toDataURL("image/png");
            setFinalImage(finalImageUrl);
        };
    }, [imageUrl, text]);

    const handleBlur = (e, index) => {
        const updatedText = [...splitText];
        updatedText[index] = e.target.innerText.trim();  // 수정된 텍스트를 저장
        setSplitText(updatedText);  // 상태 업데이트
    };

    // splitText 상태 초기화 (처음에 text를 세로로 나누어서 저장)
    const [splitText, setSplitText] = useState(() => {
        const maxCharsPerLine = 10;
        const lines = [];
        let currentLine = "";

        text.split(" ").forEach(word => {
            if ((currentLine + word).length > maxCharsPerLine) {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });
        lines.push(currentLine.trim());
        return lines;
    });

    return (
        <div id="template_intro_1to1_2" className="relative">
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



            {/* ✅ 텍스트 오버레이 */}
            <div className="absolute flex"
                style={{
                    top: "50%", // ✅ 상하 중앙 정렬
                    left: `${(809 / 1024) * 100}%`, // ✅ 왼쪽에서 758px 떨어진 위치
                    transform: "translateY(-50%)", // ✅ 상하 중앙 정렬 유지
                }}>
                {splitText.map((line, index) => (
                    <p key={index}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlur(e, index)}  // 각 줄에 대해 onBlur 처리
                        className={`editable-text  text-center break-keep relative ${isCaptured ? "no-blinking" : ""}`}
                        style={{
                            color: "#FFF",
                            fontFeatureSettings: "'case' on",
                            fontFamily: "'Gowun Dodum', sans-serif",
                            fontSize: `${64 * (431 / 1024)}px`,
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: `${68 * (431 / 1024)}px`,
                            writingMode: "vertical-rl", // ✅ 세로쓰기 (오른쪽에서 왼쪽 방향)
                            textOrientation: "upright", // ✅ 문자를 정상 방향으로 유지
                        }}
                        data-html2canvas-ignore={isCaptured ? "true" : "false"}
                    >
                        {line}
                    </p>
                ))}
            </div>

            <div className="absolute"
                style={{
                    top: "50%", // ✅ 상하 중앙 정렬
                    left: `${(708 / 1024) * 100}%`, // ✅ 왼쪽에서 758px 떨어진 위치
                    transform: "translateY(-50%)", // ✅ 상하 중앙 정렬 유지
                }}>
                <p className="text-white text-center overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "'Gowun Dodum', sans-serif",  // ✅ 작은따옴표로 감싸기
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: `${68 * (431 / 1024)}px`,
                        writingMode: "vertical-rl", // ✅ 세로쓰기 (오른쪽에서 왼쪽 방향)
                        textOrientation: "upright", // ✅ 문자를 정상 방향으로 유지
                    }}>
                    {storeName}
                </p>
            </div>

            <div className="absolute"
                style={{ top: `${(900 / 1024) * 100}%`, left: `${(185 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "'Do Hyeon', sans-serif",  // ✅ 작은따옴표로 감싸기
                        fontSize: `${40 * (431 / 1024)}px`,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: `${42 * (431 / 1024)}px`,
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
