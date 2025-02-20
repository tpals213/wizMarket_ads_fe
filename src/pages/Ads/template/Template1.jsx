export const Template1 = ({ imageUrl, text }) => {
    return (
        <div id="template-1">
            <img
                src={imageUrl}
                alt="Template 1"
                className="w-full h-full object-cover"
            />
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5">
                <p className="text-white text-4xl font-bold text-center shadow-lg">
                    {text}
                </p>
            </div>
        </div>

    );
};