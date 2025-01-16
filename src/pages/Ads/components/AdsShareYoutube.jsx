import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import axios from "axios";

const AdsShareYoutube = () => {
    const navigate = useNavigate();
    const location = useLocation(); // `state`로 전달된 데이터 접근

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code"); // URL에서 인증 코드 추출
                const state = urlParams.get("state"); // URL에서 테스트 코드 추출

                if (!code || !state) {
                    console.error("Missing authorization code or state.");
                    navigate("/error");
                    return;
                }

                // JSON 데이터 복원
                const { content, store_name, tag, file_path } = JSON.parse(decodeURIComponent(state));
                console.log("복원된 데이터:", { content, store_name, tag, file_path });

                // 1. 인증 코드로 액세스 토큰 교환
                const tokenResponse = await axios.post(
                    `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/auth/callback`,
                    { code }
                );
                const accessToken = tokenResponse.data.access_token;
                console.log("액세스 토큰:", accessToken);

                if (!content || !store_name || !tag || !file_path) {
                    console.error("필수 데이터가 누락되었습니다.");
                    navigate("/error");
                    return;
                }

                // 4. 유튜브 업로드 요청
                const formData = new FormData();
                formData.append("content", content);
                formData.append("store_name", store_name);
                formData.append("tag", tag);
                formData.append("access_token", accessToken);
                formData.append("file_path", file_path);

                const uploadResponse = await axios.post(
                    `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload/youtube`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                console.log("유튜브 업로드 성공:", uploadResponse.data);
                navigate("/success"); // 성공 페이지로 리디렉션
            } catch (error) {
                console.error("유튜브 업로드 실패:", error);
                navigate("/error"); // 실패 페이지로 리디렉션
            }
        };

        handleCallback();
    }, [navigate, location.state]); // `state`를 의존성 배열에 추가

    return <div>인증 및 업로드 처리 중...</div>;
};

export default AdsShareYoutube;
