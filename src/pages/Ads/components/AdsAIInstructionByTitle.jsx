import { useEffect } from 'react';

const AdsAIInstructionByTitle = ({ useOption, title, setGptRole }) => {
    
    // 공통 광고 문구 템플릿을 생성하는 함수
    const generateAdRole = (title, details) => {
        return `다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
    잘 어울리는 광고 문구를 생성해주세요.
    - 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
    - 핵심고객 연령대에 잘 어울릴 것
    ${details}
    - 특수기호, 이모티콘은 제외할 것
    - 주제 : ${title} 형태로 작성할 것`;
    };

    // useOption이 특정 값인지 확인하는 함수
    const isTallTemplate = (option) => {
        return ["문자메시지", "인스타그램 스토리", "카카오톡"].includes(option);
    };

    const isSquareTemplate = (option) => {
        return ["인스타그램 피드"].includes(option);
    };

    // useOption이 특정 값인지 확인하는 함수
    const isWideTemplate = (option) => {
        return ["네이버 블로그"].includes(option);
    };

    // 동적으로 gptRole 값을 업데이트
    useEffect(() => {
        switch (title) {
            case "":
                setGptRole(generateAdRole("매장 소개", "- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것"));
                break;
        
            case "매장 소개":
                if (useOption === "") {
                    setGptRole(generateAdRole(title, "- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것"));
                } else if (isTallTemplate(useOption)) {
                    setGptRole(generateAdRole(title, "- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것"));
                } else if (isWideTemplate(useOption)) {
                    setGptRole(generateAdRole(title, "- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것"));
                } else if (isSquareTemplate(useOption)) {
                    setGptRole(generateAdRole(title, "- 주제 세부 정보 내용을 바탕으로 15자 이내로 작성할 것"));
                }
                break;
        
            case "이벤트":
                if (useOption === "") {
                    setGptRole(generateAdRole(title, `- 제목 작성 : 주제 세부 내용에 어울리는 제목을 8자 이내로 작성할 것
                        \n- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 30자 이내로 작성할 것`));
                } else if (isTallTemplate(useOption)) {
                    setGptRole(generateAdRole(title, `- 제목 작성 : 주제 세부 내용에 어울리는 제목을 8자 이내로 작성할 것
                        \n- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 30자 이내로 작성할 것`));
                } else if (isWideTemplate(useOption)) {
                    setGptRole(generateAdRole(title, `- 제목 작성 : 주제 세부 내용에 어울리는 제목을 5자 이내로 작성할 것
                        \n- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 30자 이내로 작성할 것`));
                } else if (isSquareTemplate(useOption)) {
                    setGptRole(generateAdRole(title, `- 제목 작성 : 주제 세부 내용에 어울리는 제목을 5자 이내로 작성할 것
                        \n- 이벤트 내용 작성 : 주제 세부 정보 내용을 포함하는 홍보문구를 30자 이내로 작성할 것`));
                }
                break;
        
            case "상품소개":
                setGptRole(generateAdRole(title, ""));
                break;
        
            case "기타":
                setGptRole("기타 내용을 입력하세요.");
                break;
        
            default:
                setGptRole(`${title}에 대한 내용을 작성하세요.`);
                break;
        }
        
    }, [useOption, title, setGptRole]); // title 값이 변경될 때 실행

    
    

   
};

export default AdsAIInstructionByTitle;
