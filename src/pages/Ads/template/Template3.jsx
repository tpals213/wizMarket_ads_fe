export const Template3 = ({ imageUrl, text }) => {
    return (
        <div className="template-3">
            <img
                src={imageUrl}
                alt="Template 2"
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-4 left-4">
                <p className="text-white text-3xl font-bold bg-[#000000]/70 p-2 rounded">
                    {text}
                </p>
            </div>
        </div>
    );
};