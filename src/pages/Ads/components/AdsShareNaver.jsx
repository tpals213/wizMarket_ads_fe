import React, { useState, useEffect } from "react";

const AdsShareNaver = ({ title, storeName, content }) => {
  const [url, setUrl] = useState("");

  // storeName이 변경될 때 URL 업데이트
  useEffect(() => {
    const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(
      storeName
    )}`;
    setUrl(searchUrl);
  }, [storeName]); // storeName이 변경될 때마다 실행

  const handleShare = () => {
    const encodedUrl = url;
    const encodedTitle = encodeURIComponent(title);
    const encodedContent = encodeURIComponent(content)
    const shareURL = `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}&content=${encodedContent}`;
    window.location.href = shareURL; // 네이버 공유 페이지로 이동
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <button
        onClick={handleShare}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        네이버 공유하기
      </button>
    </div>
  );
};

export default AdsShareNaver;
