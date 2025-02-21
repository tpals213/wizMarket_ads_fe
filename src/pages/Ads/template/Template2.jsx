export const Template2 = ({ imageUrl, text }) => {
    return (
        <div id="template-2">
            <img
                src={imageUrl}
                alt="Template 2"
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-4 left-4">
                <p className="text-black text-3xl font-bold bg-white/50 p-2 rounded">
                    {text}
                </p>
            </div>
        </div>
    );
};