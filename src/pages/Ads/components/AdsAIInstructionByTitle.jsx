import React, { useState, useEffect } from 'react';

const AdsAIInstructionByTitle = ({ useOption, title, gptRole, setGptRole }) => {
    const [isGptRoleVisible, setIsGptRoleVisible] = useState(true);
    

    // 동적으로 gptRole 값을 업데이트
    useEffect(() => {
        if (useOption === "문자메시지" || useOption ==="인스타그램 스토리") {
            if (title === "매장 소개") {
                setGptRole(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
잘 어울리는 광고 문구를 생성해주세요.
- 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
- 핵심고객 연령대에 잘 어울릴 것
- 제목 작성 : 제목을 8자 이내로 작성할 것
- 내용 작성 : 홍보문구를 40자 이내로 작성할 것
- 특수기호, 이모티콘은 제외할 것
- 주제 : ${title} 형태로 작성할 것 `);
            } else if (title === "이벤트") {
                setGptRole(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
잘 어울리는 광고 문구를 생성해주세요.
- 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
- 핵심고객 연령대에 잘 어울릴 것
- 제목 작성 : 주제세부내용에 어울리는 제목을 15자 이내로 작성할 것
- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 40자 이내로 작성할 것
- 특수기호, 이모티콘은 제외할 것
- 주제 : ${title} 형태로 작성할 것`);
            } else if (title === "기타") {
                setGptRole("기타 내용을 입력하세요.");
            } else {
                setGptRole(`${title}에 대한 내용을 작성하세요.`);
            }
        }

        else if (useOption === "인스타그램 피드"){
            if (title === "매장 소개") {
                setGptRole(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
잘 어울리는 광고 문구를 생성해주세요.
- 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
- 핵심고객 연령대에 잘 어울릴 것
- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것
- 특수기호, 이모티콘은 제외할 것
- 주제 : ${title} 형태로 작성할 것 `);
            } else if (title === "이벤트") {
                setGptRole(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
잘 어울리는 광고 문구를 생성해주세요.
- 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
- 핵심고객 연령대에 잘 어울릴 것
- 제목 작성 : 주제세부내용에 어울리는 제목을 15자 이내로 작성할 것
- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 40자 이내로 작성할 것
- 특수기호, 이모티콘은 제외할 것
- 주제 : ${title} 형태로 작성할 것`);
            } else if (title === "기타") {
                setGptRole("기타 내용을 입력하세요.");
            } else {
                setGptRole(`${title}에 대한 내용을 작성하세요.`);
            }
        }

            
    }, [useOption, title, setGptRole]); // title 값이 변경될 때 실행

    const getRowCount = (title) => {
        switch (title) {
            case "매장 소개":
                return 10; // 짧은 입력이 필요할 때
            case "이벤트":
                return 10; // 보통 길이
            case "상품 소개":
                return 10; // 더 긴 입력이 필요할 때
            case "기타":
                return 8; // 기타의 경우 가장 길게
            default:
                return 8; // 기본 값
        }
    };
    

    return (
        <div>
            <div className="mb-6 mt-6 flex items-center justify-between">
                <label className="block text-lg text-gray-700">
                    AI에게 명령할 내용 (지시문)
                </label>
                <button
                    className="text-gray-500 focus:outline-none"
                    onClick={() => setIsGptRoleVisible(!isGptRoleVisible)}
                >
                    {isGptRoleVisible ? (
                        <span>&#xFE3F;</span> // ▼ 아래 방향 화살표
                    ) : (
                        <span>&#xFE40;</span> // ▶ 오른쪽 방향 화살표
                    )}
                </button>
            </div>
            {isGptRoleVisible && (
                <div className="mb-6">
                    <textarea
                        rows={getRowCount(title)}
                        value={gptRole}
                        onChange={(e) => setGptRole(e.target.value)}
                        className="border border-gray-300 rounded w-full px-3 py-2"
                    />
                </div>
            )}
        </div>
    );
};

export default AdsAIInstructionByTitle;
