import React, { useEffect, useRef, useState } from "react";

const Template2 = ({ imageUrl, text, storeName, roadName, weather, tag, weekday }) => {
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

    const maxCharsPerLine = 10; // ✅ 한 줄에 표시할 최대 글자 수
    const splitText = [];
    let currentLine = "";

    text.split(" ").forEach(word => {
        if ((currentLine + word).length > maxCharsPerLine) {
            splitText.push(currentLine.trim()); // ✅ 기존 줄 저장
            currentLine = word + " "; // ✅ 새로운 줄 시작
        } else {
            currentLine += word + " ";
        }
    });
    splitText.push(currentLine.trim()); // ✅ 마지막 줄 추가

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
                    left: `${(849 / 1024) * 100}%`, // ✅ 왼쪽에서 758px 떨어진 위치
                    transform: "translateY(-50%)", // ✅ 상하 중앙 정렬 유지
                }}>
                {splitText.map((line, index) => (
                    <p key={index}
                        className="text-white text-center overflow-hidden text-ellipsis"
                        style={{
                            color: "#FFF",
                            fontFeatureSettings: "'case' on",
                            fontFamily: "'Gowun Dodum', sans-serif",  // ✅ 작은따옴표로 감싸기
                            fontSize: "32px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "30px",
                            writingMode: "vertical-rl", // ✅ 세로쓰기 (오른쪽에서 왼쪽 방향)
                            textOrientation: "upright", // ✅ 문자를 정상 방향으로 유지
                        }}>
                        {line}
                    </p>
                ))}
            </div>

            {/* ✅ 상하좌우 50px 더 큰 배경 div */}
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
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "68px",
                        writingMode: "vertical-rl", // ✅ 세로쓰기 (오른쪽에서 왼쪽 방향)
                        textOrientation: "upright", // ✅ 문자를 정상 방향으로 유지
                    }}>
                    {storeName}
                </p>
            </div>

            <div className="absolute"
                style={{ top: `${(870 / 1024) * 100}%`, left: `${(185 / 1024) * 100}%` }}>
                <p className="text-white text-left overflow-hidden text-ellipsis"
                    style={{
                        color: "#FFF",
                        fontFeatureSettings: "'case' on",
                        fontFamily: "'Do Hyeon', sans-serif",  // ✅ 작은따옴표로 감싸기
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "42px",
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
