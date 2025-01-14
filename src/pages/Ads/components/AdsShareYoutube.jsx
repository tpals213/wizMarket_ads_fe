import React, { useEffect } from "react";

const AdsShareYoutube = () => {
    useEffect(() => {
        // URL에서 인증 코드를 추출
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");

        if (authCode) {
            // 서버로 인증 코드를 전송하여 액세스 토큰을 교환
            fetch("http://localhost:80002/ads/auth/callback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auth_code: authCode }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Access Token:", data.access_token);
                    // 액세스 토큰을 저장하거나 이후 로직 처리
                })
                .catch((error) => {
                    console.error("Error exchanging auth code:", error);
                });
        } else {
            console.error("No authorization code found in the URL");
        }
    }, []);

    return (
        <div>
            <h1>처리 중입니다...</h1>
            <p>Google OAuth 인증이 완료되었습니다. 잠시만 기다려주세요.</p>
        </div>
    );
};

export default AdsShareYoutube;
