import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // pagination 스타일 추가
import { Pagination } from "swiper/modules"; // pagination 모듈 추가
import AdsAIInstructionByTitle from './AdsAIInstructionByTitle';
import AdsAllInstructionByUseOption from './AdsAllInstructionByUseOption';
import AdsShareKakao from './AdsShareKakao';

const AdsModalLightVer = ({ isOpen, onClose, storeBusinessNumber }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // 결과 처리
    const [message, setMessage] = useState(''); // 기본 성공 또는 실패 메시지

    const [data, setData] = useState(null); // 모달창 열릴 때 가져오는 기본 정보

    const [useOption, setUseOption] = useState("");  // 사이즈 용도
    const [title, setTitle] = useState("");    // 주제 용도
    const [detailContent, setDetailContent] = useState('');   // 실제 적용할 문구 ex)500원 할인

    const [adsChan, setAdsChan] = useState(''); // gpt가 생성한 추천 광고 채널
    const [adsChanLoading, setAdsChanLoading] = useState(false); // 추천 광고 채널 로딩 처리
    const [adsChanVisible, setAdsChanVisible] = useState(false);    // 보이기

    const [gptRole, setGptRole] = useState(''); // gpt 역할 부여 - 지시 내용

    const [content, setContent] = useState(''); // gpt 문구 생성 결과물
    const [contentLoading, setContentLoading] = useState(false) // gpt 문구 생성 로딩
    const [combineImageTexts, setCombineImageTexts] = useState([]);  // 템플릿들
    const [checkImage, setCheckImage] = useState(null); // 이미지 체크 - 템플릿의 인덱스
    const [uploadImage, setUploadImage] = useState(null); // 선택 된 이미지
    const [uploading, setUploading] = useState(false)   // 이미지 업로드 로딩 처리

    const [selectedImages, setSelectedImages] = useState([]); // 기존 이미지 파일 업로드 

    const resetModalState = () => {
        setLoading(false);
        setError(null);
        setSaveStatus(null);
        setMessage('');

        setData(null);

        setUseOption("")
        setTitle(""); // 초기값 유지
        setDetailContent('');

        setAdsChan("")
        setAdsChanLoading(false)
        setAdsChanVisible(false)

        setContent("")
        setContentLoading(false);
        setCombineImageTexts([])
        setCheckImage(null)
        setUploadImage(null)
        setUploading(false)

        setGptRole('');

    };

    const maleMap = useMemo(() => ({
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_20S: "남자 20대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_30S: "남자 30대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_40S: "남자 40대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_50S: "남자 50대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_60_OVER: "남자 60대 이상",
    }), []);

    const femaleMap = useMemo(() => ({
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_20S: "여자 20대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_30S: "여자 30대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_40S: "여자 40대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_50S: "여자 50대",
        COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_60_OVER: "여자 60대 이상",
    }), []);


    useEffect(() => {
        if (isOpen) {
            resetModalState();
        }
    }, [isOpen]);


    useEffect(() => {
        const fetchInitialData = async () => {
            if (isOpen) {

                try {
                    setLoading(true);
                    const response = await axios.post(
                        `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/select/init/info`,
                        null,
                        { params: { store_business_number: storeBusinessNumber } }
                    );
                    const {
                        commercial_district_max_sales_day,
                        commercial_district_max_sales_time,
                        commercial_district_max_sales_m_age,
                        commercial_district_max_sales_f_age,
                    } = response.data;

                    const [maxSalesDay, maxSalesDayValue] = Array.isArray(commercial_district_max_sales_day)
                        ? commercial_district_max_sales_day
                        : [null, null];

                    const [maxSalesTime, maxSalesTimeValue] = Array.isArray(commercial_district_max_sales_time)
                        ? commercial_district_max_sales_time
                        : [null, null];

                    const [maxSalesMale, maxSalesMaleValue] = Array.isArray(commercial_district_max_sales_m_age)
                        ? commercial_district_max_sales_m_age
                        : [null, null];

                    const [maxSalesFemale, maxSalesFemaleValue] = Array.isArray(commercial_district_max_sales_f_age)
                        ? commercial_district_max_sales_f_age
                        : [null, null];

                    const updatedData = {
                        ...response.data,
                        maxSalesDay,
                        maxSalesDayValue,
                        maxSalesTime,
                        maxSalesTimeValue,
                        maxSalesMale,
                        maxSalesMaleValue,
                        maxSalesFemale,
                        maxSalesFemaleValue,
                    };
                    setData(updatedData);

                } catch (err) {
                    console.error("초기 데이터 로드 중 오류 발생:", err);
                    setError("초기 데이터 로드 중 오류가 발생했습니다.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInitialData();
    }, [isOpen, storeBusinessNumber]);


    const handleImageClick = (index) => {
        if (checkImage === index) {
            // 이미 선택된 이미지를 다시 클릭 → 선택 해제
            setCheckImage(null);
            setUploadImage(null);
        } else {
            // 새로운 이미지를 선택
            setCheckImage(index);
            setUploadImage(combineImageTexts[index]);
        }
    };


    // 광고 채널 추천
    const generateAdsChan = async () => {
        setAdsChanLoading(true)

        const updatedTitle = title === "" ? "매장 소개" : title;
        const basicInfo = {
            male_base: maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음",
            female_base: femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음",
            store_name: data.store_name,
            road_name: data.road_name,
            tag: data.detail_category_name,
            title: updatedTitle,
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/suggest/channel`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );

            setAdsChan(response.data.chan); // 성공 시 서버에서 받은 데이터를 상태에 저장
            setAdsChanVisible(true)
            setAdsChanLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setAdsChanLoading(false)
        }
    };


    // 업로드한 파일로 생성
    const gernerateImageWithText = async (imageData) => {

        setContentLoading(true)

        const updatedTitle = title === "" ? "매장 소개" : title;
        const updatedUseOption = useOption === "" ? "인스타그램 피드" : useOption;

        const formData = new FormData();
        formData.append('store_name', data.store_name);
        formData.append('road_name', data.road_name);
        formData.append('tag', data.detail_category_name);
        formData.append('weather', data.main);
        formData.append('temp', data.temp);
        formData.append('male_base', maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음");
        formData.append('female_base', femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음");
        formData.append('gpt_role', gptRole);
        formData.append('detail_content', detailContent || detailContent || "값 없음");
        formData.append('use_option', updatedUseOption);
        formData.append('title', updatedTitle);

        if (imageData && imageData.file) {
            formData.append("image", imageData.file);
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/exist/image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // 중요: FastAPI가 이 형식을 기대
                    },
                }
            );
            setContent(response.data.copyright); // 성공 시 서버에서 받은 데이터를 상태에 저장
            setCombineImageTexts(response.data.images)
            setContentLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setContentLoading(false)
        }

    };

    // AI 로생성
    const generateAds = async () => {
        // 기본 값 부여
        const updatedTitle = title === "" ? "매장 소개" : title;
        const updatedUseOption = useOption === "" ? "인스타그램 피드" : useOption;
        const aiModelOption = "dalle"; // 이미지 생성 모델 옵션
        setContentLoading(true)
        const basicInfo = {
            gpt_role: gptRole,
            weather: data.main,
            temp: data.temp,
            male_base: maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음",
            female_base: femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음",
            store_name: data.store_name,
            road_name: data.road_name,
            tag: data.detail_category_name,
            detail_content: detailContent,
            use_option: updatedUseOption,
            title: updatedTitle,
            ai_model_option: aiModelOption,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload/content`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setContent(response.data.copyright); // 성공 시 서버에서 받은 데이터를 상태에 저장
            setCombineImageTexts(response.data.images)
            setContentLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setContentLoading(false)
        }
    };

    // Base64 데이터를 Blob으로 변환하는 유틸리티 함수
    const base64ToBlob = (base64, contentType = "image/png") => {
        if (!base64 || typeof base64 !== "string") {
            console.error("유효하지 않은 Base64 데이터:", base64);
            return null; // 또는 기본 Blob을 반환하거나 예외를 발생시킬 수 있음
        }

        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    const getBase64Extension = (base64) => {
        const mimeType = base64.match(/data:(.*?);base64/)[1];
        return mimeType.split("/")[1]; // 확장자 추출
    };

    // 선택 이미지 해당 체널에 업로드
    const onUpload = async () => {
        if (useOption === "카카오톡") {
            // 실행할 코드
            console.log("카카오톡이 선택되었습니다.");
            return;
        }
        setUploading(true)

        const updatedUseOption = useOption === "" ? "인스타그램 피드" : useOption;
        const formData = new FormData();
        formData.append('use_option', updatedUseOption); // 용도 추가
        formData.append('content', content); // 컨텐츠 추가
        formData.append('store_name', data.store_name);
        formData.append('tag', data.detail_category_name)

        if (uploadImage) {
            const extension = getBase64Extension(uploadImage); // 확장자 추출
            const blob = base64ToBlob(uploadImage, `image/${extension}`);
            formData.append("upload_image", blob, `image.${extension}`); // Blob과 확장자 추가
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 페이지 이동
            if (useOption === "" || useOption === "인스타그램 피드" || useOption === "인스타그램 스토리") {
                const [instaName, instaFollowers, instaCount] = response.data;
                navigate('/ads/detail/insta', {
                    state: {
                        instaName,
                        instaFollowers,
                        instaCount,
                        uploadImage,
                        updatedUseOption,
                        storeBusinessNumber
                    }
                });
            }
        } catch (err) {
            setUploading(false)
            console.error("업로드 중 오류 발생:", err); // 발생한 에러를 콘솔에 출력
        } finally {
            setUploading(false)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="inset-0 flex z-50 bg-opacity-50 h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col pt-5 space-y-2">
                        {/* 이미지 영역 */}
                        <div className="flex items-center space-x-4">
                            <img
                                src={require("../../../assets/icon/wiz_icon.png")}
                                alt="위즈 아이콘"
                                className="w-[39px] h-[26px]"
                            />
                            <img
                                src={require("../../../assets/icon/wizAD_icon.png")}
                                alt="위즈 마켓 아이콘"
                                className="w-[72px] h-[21px]"
                            />
                        </div>
                        {/* 텍스트 영역 */}
                        <h5 className="text-lg font-medium">
                            간편한 고객 맞춤형 자동 AI 광고 만들기
                        </h5>
                        <h5 className="text-lg font-medium">
                            Create easy, personalized, automated AI ads
                        </h5>
                    </div>


                </div>
                {loading && <p>로딩 중...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {saveStatus === 'success' && (
                    <div className="p-5 mb-4 rounded bg-green-100 text-green-800">
                        {message}
                    </div>
                )}
                {saveStatus === 'error' && (
                    <div className="p-5 mb-4 rounded bg-red-100 text-red-800">
                        {message}
                    </div>
                )}

                {data && (
                    <div className="w-full">

                        {/* 주제 선택 영역 */}
                        <div className="mb-6">
                            <fieldset className="border border-gray-300 rounded w-full px-3 py-2">
                                <legend className="text-xl text-gray-700 px-2">주제 선택</legend>
                                <select
                                    className={`border-none w-full focus:outline-none ${title === "" ? "text-gray-400" : "text-gray-700"
                                        }`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                >
                                    <option value="" disabled>
                                        어떤 주제로 홍보하실 건가요?
                                    </option>
                                    <option value="매장 소개">매장 홍보</option>
                                    <option value="이벤트">이벤트</option>
                                    <option value="상품소개">상품소개</option>
                                    <option value="인사">인사</option>
                                    <option value="명함">명함</option>
                                </select>
                            </fieldset>
                        </div>

                        {/* 광고 채널 선택 영역 */}
                        <div className="">
                            <fieldset className="border border-gray-300 rounded w-full px-3 py-2">
                                <legend className="text-xl text-gray-700 px-2">광고 채널</legend>
                                <select
                                    className={`border-none w-full focus:outline-none ${useOption === "" ? "text-gray-400" : "text-gray-700"
                                        }`}
                                    value={useOption}
                                    onChange={(e) => setUseOption(e.target.value)}
                                >
                                    <option value="" disabled>
                                        광고를 게시할 채널을 선택해 주세요.
                                    </option>
                                    <option value="인스타그램 스토리">인스타그램 스토리 (9:16)</option>
                                    <option value="인스타그램 피드">인스타그램 피드 (1:1)</option>
                                    <option value="문자메시지">문자메시지 (9:16)</option>
                                    <option value="네이버 블로그">네이버 블로그 (16:9)</option>
                                    <option value="카카오톡">카카오톡 (9:16)</option>
                                </select>
                            </fieldset>
                            <AdsAllInstructionByUseOption selectedOption={useOption} />
                        </div>

                        {/* 광고 채널 추천 받기 */}
                        <div className="mb-6 flex flex-col justify-center">
                            {adsChanLoading ? (
                                // 로딩 상태
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-[#FF1664] border-solid border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div
                                    className={`flex flex-col items-start cursor-pointer pt-4 rounded-md ${adsChan && adsChanVisible ? "border-2 border-gray-300" : ""
                                        }`}
                                >
                                    {/* 기본 상태: 이미지와 텍스트 */}
                                    <div className="flex items-center" onClick={generateAdsChan}>
                                        <img
                                            src={require("../../../assets/icon/star_icon.png")}
                                            alt="채널 선택"
                                            className="w-6 h-6"
                                        />
                                        <p className="text-[#FF1664] font-[Pretendard] text-[16px] font-bold leading-normal ml-2">
                                            지금 나에게 가장 효과가 좋은 광고채널은?
                                        </p>
                                        {/* ▼ 버튼 (결과 생성 후) */}
                                        {adsChan && (
                                            <span
                                                className="ml-2 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 부모 클릭 이벤트 방지
                                                    setAdsChanVisible((prev) => !prev);
                                                }}
                                            >
                                                {adsChanVisible ? "▼" : "▶"}
                                            </span>
                                        )}
                                    </div>
                                    {/* 결과 표시 (생성 후 펼쳐진 상태 기본) */}
                                    {adsChan && adsChanVisible && (
                                        <div className="text-[#333333] text-base leading-relaxed mt-2">
                                            {adsChan.split(". ").map((sentence, index) => (
                                                <p key={index} className="mt-2">
                                                    {sentence.trim()}.
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 주제 세부 정보 선택 영역 */}
                        <div className="w-full">
                            <fieldset className="border border-gray-300 rounded w-full px-3 py-2">
                                <legend className="text-xl text-gray-700 px-2">주제 세부 정보 입력</legend>
                                <input
                                    type="text"
                                    value={detailContent}
                                    onChange={(e) => setDetailContent(e.target.value)}
                                    className="rounded w-full px-3 py-2"
                                />
                            </fieldset>
                            <p className="flex items-center justify-between mb-2 pl-4 text-gray-400">
                                예 : 오늘 방문하신 고객들에게 테이블당 소주 1병 서비스!!
                            </p>
                        </div>


                        {/* gpt 역할 영역 */}
                        <AdsAIInstructionByTitle useOption={useOption} title={title} setGptRole={setGptRole} />

                        {/* 광고 생성 버튼 영역 */}
                        <div className="mb-6">
                            <div className="flex flex-row justify-center items-center space-x-4">
                                {/* 파일 업로드 인풋 */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden" // input을 숨김
                                    id="fileInput"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const img = new Image();
                                            img.src = URL.createObjectURL(file);
                                            img.onload = () => {
                                                const imageData = {
                                                    type: "file",
                                                    file,
                                                    previewUrl: img.src,
                                                    width: img.width,
                                                    height: img.height,
                                                };

                                                // 상태 업데이트
                                                setSelectedImages([imageData]);

                                                // 바로 함수 호출
                                                gernerateImageWithText(imageData);
                                            };
                                        }
                                    }}
                                />

                                {/* 클릭 가능한 카메라 아이콘 */}
                                <label
                                    htmlFor="fileInput"
                                    className="cursor-pointer inline-block p-5 hover:bg-gray-300 transition-all duration-300"
                                >
                                    <img src={require("../../../assets/icon/camera_icon.png")} alt="파일 선택" className="w-10 h-10" />
                                </label>

                                <button
                                    type="button"
                                    className="flex flex-row justify-center items-center w-[218px] px-[20px] py-[8px] text-white rounded transition-all duration-300"
                                    onClick={generateAds}
                                    style={{
                                        borderRadius: 'var(--borderRadius, 4px)',
                                        background: 'var(--primary-main, #2196F3)',
                                        boxShadow: `
                                            0px 1px 18px 0px rgba(0, 0, 0, 0.12),
                                            0px 6px 10px 0px rgba(0, 0, 0, 0.14),
                                            0px 3px 5px -1px rgba(0, 0, 0, 0.20)
                                        `,
                                    }}
                                    disabled={contentLoading} // 로딩 중 버튼 비활성화
                                >
                                    {contentLoading ? (
                                        <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <img
                                                src={
                                                    combineImageTexts && combineImageTexts.length > 0
                                                        ? require("../../../assets/icon/retry_icon.png") // Retry 아이콘 경로
                                                        : require("../../../assets/icon/ai_gen_icon.png") // 기본 AI 생성 아이콘 경로
                                                }
                                                alt={
                                                    combineImageTexts && combineImageTexts.length > 0
                                                        ? "Retry Icon"
                                                        : "AI 광고 생성 아이콘"
                                                }
                                                className="w-6 h-6 mr-2"
                                            />
                                            <p className='font-medium text-[16px]'>
                                                {combineImageTexts && combineImageTexts.length > 0 ? "AI 다시생성하기" : "AI 광고 생성"}
                                            </p>
                                        </>
                                    )}

                                </button>
                            </div>
                        </div>

                        {/* 문구 영역 */}
                        {content && (
                            <div
                                className="flex flex-col justify-center items-center p-4 rounded-[16px] text-white"
                                style={{
                                    background: 'var(--Primary-primary_gradient, linear-gradient(270deg, #C67AF7 0%, #6B78E8 100%))',
                                    fontSize: '20px', // 텍스트 크기를 20px로 설정
                                }}
                            >
                                {title === '이벤트' ? (
                                    (() => {
                                        // ':'을 기준으로 제목과 내용을 분리
                                        const parts = content.split(':');
                                        const extractedTitle = parts[1]?.split('이벤트 내용')[0]?.trim() || "제목 없음";
                                        const extractedContent = parts[2]?.trim() || "내용 없음";

                                        return (
                                            <>
                                                <p className="mb-2 text-xl">
                                                    <strong>제목:</strong> {extractedTitle}
                                                </p>
                                                <p>
                                                    <strong className='text-xl'>이벤트 내용:</strong> {extractedContent}
                                                </p>
                                            </>
                                        );
                                    })()
                                ) : (
                                    <p className='text-xl'>{content}</p> // 이벤트가 아닌 경우 content 그대로 출력
                                )}
                            </div>
                        )}

                        {/* 이미지들 영역 */}
                        <div className="flex flex-col justify-center items-center rounded-[16px] text-white pt-4 pb-4">
                            {combineImageTexts && combineImageTexts.length > 0 && (
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    pagination={{ clickable: true }} // 하단 점 페이지네이션 활성화
                                    modules={[Pagination]}
                                    className="w-full h-full relative"
                                >
                                    {combineImageTexts.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="flex justify-center items-center relative">
                                                {/* 이미지 표시 */}
                                                <img
                                                    src={image}
                                                    alt={`Slide ${index + 1}`}
                                                    className="rounded-[16px] max-w-full max-h-[600px] object-cover"
                                                />

                                                {/* 체크 아이콘 */}
                                                <div
                                                    className="absolute inset-0 flex justify-center items-center cursor-pointer"
                                                    onClick={() => handleImageClick(index)}
                                                >
                                                    <img
                                                        src={
                                                            checkImage === index
                                                                ? require("../../../assets/icon/check_icon.png") // 체크된 상태
                                                                : require("../../../assets/icon/non_check_icon.png") // 체크되지 않은 상태
                                                        }
                                                        alt={checkImage === index ? "Checked" : "Non-checked"}
                                                        className="w-[68px] h-[68px]" // 아이콘 크기 설정
                                                    />
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* 공유하기 버튼 */}
                        {uploadImage && (
                            <button
                                className={`flex flex-col justify-center items-center self-stretch px-[22px] py-[8px] rounded-[4px] 
                                            ${uploading ? "bg-[#2196F3] cursor-not-allowed" : "bg-[#2196F3] hover:bg-[#1976D2]"} 
                                            text-white text-[16px] transition-all w-full`} // text-[16px] 추가
                                onClick={onUpload}
                                disabled={uploading} // 로딩 중일 때 클릭 비활성화
                            >
                                {uploading ? (
                                    <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    `${useOption !== "" ? useOption : "인스타그램 피드"}에 업로드하기`
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsModalLightVer;
