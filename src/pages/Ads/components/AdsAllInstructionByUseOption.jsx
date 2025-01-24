const AdsAllInstructionByUseOption = ({ selectedOption }) => {
    const getDescription = (option) => {
        switch (option) {
            case "인스타그램 스토리":
                return "인스타그램 스토리는 24시간만 인스타그램에서 보여지는 방식입니다.";
            case "인스타그램 피드":
                return "인스타그램 피드는 사람들이 사진과 동영상을 공유하는 게시물로 사진 여러장 업로드가 가능합니다.";
            case "문자메시지":
                return "문자메시지는 개인 맞춤형 메시지를 전달하는 방식입니다.";
            case "네이버 블로그":
                return "네이버 블로그는 SEO에 최적화된 광고 방식입니다.";
            case "카카오톡":
                return "카카오톡은 9:16 비율로 전송됩니다.";
            default:
                return "";
        }
    };

    if (!selectedOption) return null;

    return (
        <p className="flex items-center justify-between mb-2 pl-4 text-gray-400">
            {getDescription(selectedOption)}
        </p>
    );
};

export default AdsAllInstructionByUseOption;
