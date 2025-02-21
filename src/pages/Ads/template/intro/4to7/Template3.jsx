const Template3 = ({ imageUrl, text, storeName, roadName }) => {
    return (
        <div id="template_intro_4to7_3">
            <img
                src={imageUrl}
                alt="Template 1"
                className="w-full h-full object-cover"
            />
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5">
                <p className="text-white text-4xl font-bold text-center shadow-lg">
                    {text}
                </p>
                <p className="text-white text-4xl font-bold text-center shadow-lg">
                    템플릿 3버전 테스트
                </p>
            </div>
        </div>
    );
};

// ✅ default export 추가
export default Template3;
