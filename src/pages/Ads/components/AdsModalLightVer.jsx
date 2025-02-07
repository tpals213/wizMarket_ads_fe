import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // pagination 스타일 추가
import "./../../../styles/swiper.css";
import { Pagination } from "swiper/modules"; // pagination 모듈 추가
import AdsAIInstructionByTitle from './AdsAIInstructionByTitle';
import AdsAllInstructionByUseOption from './AdsAllInstructionByUseOption';
import GoogleTranslator from '../../../assets/components/GoogleTranslator/GoogleTranslator'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Clipboard, ClipboardCheck } from "lucide-react"; // 아이콘 추가
// import * as fabric from 'fabric';


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
    const [checkImages, setCheckImages] = useState([]); // 선택된 이미지들의 인덱스
    const [uploadImages, setUploadImages] = useState([]); // 선택된 이미지들
    const [uploading, setUploading] = useState(false)   // 이미지 업로드 로딩 처리

    const [selectedImages, setSelectedImages] = useState([]); // 기존 이미지 파일 업로드 
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 사진 선택 메뉴 열기

    // 영상 처리
    const [selectedMedia, setSelectedMedia] = useState("사진");
    const [videoPath, setVideoPath] = useState(null);
    const [videoUploading, setVideoUploading] = useState(false)   // 이미지 업로드 로딩 처리

    // 문구 복사 처리
    const [copied, setCopied] = useState(false);


    // 드롭 메뉴 클릭 처리
    const handleMenuClick = (type) => {
        setIsMenuOpen(false); // 메뉴 닫기
        if (type === "file") {
            document.getElementById("fileInput").click(); // 파일 선택 input 트리거
        } else if (type === "camera") {
            document.getElementById("cameraInput").click(); // 카메라 촬영 input 트리거
        } else if (type === "gallery") {
            document.getElementById("fileInput").click(); // 카메라 촬영 input 트리거
        }
    };

    // 아무곳 클릭해도 메뉴 닫기
    const closeMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }

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
        setCheckImages([])
        setUploadImages([])
        setUploading(false)

        setGptRole('');
        setVideoPath(null);
        setVideoUploading(false)
        setIsMenuOpen(false);
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


    // 이미지 선택 되게끔
    const handleImageClick = (index) => {
        if (useOption === "인스타그램 피드") {
            // 다수 선택 가능
            if (checkImages.includes(index)) {
                // 이미 선택된 이미지를 다시 클릭 → 선택 해제
                const updatedCheckImages = checkImages.filter((i) => i !== index);
                const updatedUploadImages = uploadImages.filter(
                    (_, i) => checkImages[i] !== index
                );
                setCheckImages(updatedCheckImages);
                setUploadImages(updatedUploadImages);
            } else {
                // 새로운 이미지를 추가로 선택
                setCheckImages([...checkImages, index]);
                setUploadImages([...uploadImages, combineImageTexts[index]]);
            }
        } else {
            // 단일 선택만 가능
            if (checkImages.includes(index)) {
                // 이미 선택된 이미지를 클릭하면 선택 해제
                setCheckImages([]);
                setUploadImages([]);
            } else {
                // 새로운 이미지를 선택
                setCheckImages([index]);
                setUploadImages([combineImageTexts[index]]);
            }
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
        if (selectedMedia === "영상") {
            gernerateVideoWithText(imageData);
            return;
        }

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

    // 업로드한 파일로 영상 생성
    const gernerateVideoWithText = async (imageData) => {
        setContentLoading(true)

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

        if (imageData && imageData.file) {
            formData.append("image", imageData.file);
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/video/image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // 중요: FastAPI가 이 형식을 기대
                    },
                }
            );
            setContent(response.data.copyright); // 성공 시 서버에서 받은 데이터를 상태에 저장
            const videoPath = response.data.result_url
            const staticIndex = videoPath.indexOf("/static/");
            setVideoPath(videoPath.substring(staticIndex));
            setContentLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setContentLoading(false)
        }
    };

    // 선택 이미지 해당 체널에 업로드
    const onUpload = async () => {
        // 카카오 업로드
        if (useOption === "카카오톡") {
            console.log("카카오톡이 선택되었습니다.");

            // 카카오톡 공유 로직
            const kakaoJsKey = process.env.REACT_APP_KAKAO_JS_API_KEY;
            if (!kakaoJsKey) {
                console.error("Kakao JavaScript Key가 설정되지 않았습니다.");
                return;
            }

            if (!window.Kakao) {
                const script = document.createElement("script");
                script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
                script.async = true;
                script.onload = () => {
                    if (!window.Kakao.isInitialized()) {
                        window.Kakao.init(kakaoJsKey);
                    }
                    shareOnKakao();
                };
                document.body.appendChild(script);
            } else {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoJsKey);
                }
                shareOnKakao();
            }

            return; // 카카오톡 처리 후 다른 로직 실행 방지
        }

        if (useOption === "네이버 블로그") {
            window.open(
                "https://nid.naver.com/nidlogin.login?url=https%3A%2F%2Fsection.blog.naver.com%2FBlogHome.naver",
                "_blank",
                `width=${window.screen.availWidth},height=${window.screen.availHeight},top=0,left=0,noopener,noreferrer`
            );
            return;
        }
        
        setUploading(true)

        const updatedUseOption = useOption === "" ? "인스타그램 피드" : useOption;
        const formData = new FormData();
        formData.append('use_option', updatedUseOption); // 용도 추가
        formData.append('content', content); // 컨텐츠 추가
        formData.append('store_name', data.store_name);
        formData.append('tag', data.detail_category_name)

        if (uploadImages.length > 0) {
            uploadImages.forEach((image) => {
                const extension = getBase64Extension(image); // 확장자 추출
                const blob = base64ToBlob(image, `image/${extension}`); // Base64 → Blob 변환
                formData.append("upload_images", blob, `image.${extension}`); // 동일한 키로 추가
            });
        }
        // for (const [key, value] of formData.entries()) {
        //     console.log(`Key: ${key}, Value:`, value);
        // }

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
                        uploadImages,
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

    // 카카오톡 공유 함수
    const shareOnKakao = async () => {
        if (!uploadImages) {
            console.error("업로드할 이미지가 없습니다.");
            return;
        }

        try {
            const base64ToBlob = (base64Data) => {
                const byteString = atob(base64Data.split(",")[1]);
                const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([byteArray], { type: mimeString });
            };

            const blob = base64ToBlob(uploadImages[0]);
            const file = new File([blob], "uploaded_image.png", { type: "image/png" });

            const response = await window.Kakao.Share.uploadImage({
                file: [file],
            });

            const uploadedImageUrl = response.infos.original.url;

            // adsInfo URL 생성
            const adsInfoUrl = `
                ?title=${encodeURIComponent(title || "기본 제목")}
                &content=${encodeURIComponent(content || "기본 내용")}
                &storeName=${encodeURIComponent(data.store_name || "기본 매장명")}
                &roadName=${encodeURIComponent(data.road_name || "기본 매장 주소")}
                &imageUrl=${encodeURIComponent(uploadedImageUrl || "기본 내용")}`;

            // 카카오톡 공유
            window.Kakao.Share.sendCustom({
                templateId: 115008, // 생성한 템플릿 ID
                templateArgs: {
                    title: title || "기본 제목",
                    imageUrl: uploadedImageUrl,
                    storeName: data.store_name || "기본 매장명",
                    content: content || "기본 내용",
                    adsInfo: adsInfoUrl,
                    store_business_id: storeBusinessNumber,
                },
            });

        } catch (error) {
            console.error("카카오톡 공유 중 오류 발생:", error);
        }
    };

    // 비디오 업로드 함수
    const videoUpload = async () => {
        setVideoUploading(true)
        const basicInfo = {
            video_path: videoPath,
            content: content || "기본 내용" // 기본값 설정
        };

        try {
            await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload/video`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setVideoUploading(false)
        } catch (error) {
            console.error("Error during video path upload:", error);
            setVideoUploading(false)
        } finally {
            setVideoUploading(false)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="inset-0 flex z-50 bg-opacity-50 h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full overflow-auto" onClick={closeMenu}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col pt-5 w-full space-y-2">
                        {/* 이미지 영역 */}
                        <div className='flex justify-between items-center'>
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
                            <div>
                                <GoogleTranslator />
                            </div>
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

                        {/* 사진 영상 선택 버튼 */}
                        <div className="items-center justify-center flex-row mt-4 hidden">
                            {useOption === "인스타그램 스토리" || useOption === "인스타그램 피드" ? (
                                <>
                                    <button
                                        onClick={() => setSelectedMedia("사진")}
                                        className={`px-5 py-2 mr-2 border rounded cursor-pointer ${selectedMedia === "사진"
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-100 text-black border-gray-300"
                                            }`}
                                    >
                                        사진
                                    </button>
                                    <button
                                        onClick={() => setSelectedMedia("영상")}
                                        className={`px-5 py-2 border rounded cursor-pointer ${selectedMedia === "영상"
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-100 text-black border-gray-300"
                                            }`}
                                    >
                                        영상
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {/* 광고 채널 추천 받기 */}
                        <div className="mb-6 flex flex-col justify-center pt-2">
                            {adsChanLoading ? (
                                // 로딩 상태
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-[#FF1664] border-solid border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div
                                    className={`flex flex-col items-start rounded-md ${adsChan && adsChanVisible ? "border-2 border-gray-300" : ""
                                        }`}
                                >
                                    {/* 기본 상태: 이미지와 텍스트 */}
                                    <div className="flex items-center" >
                                        <img
                                            src={require("../../../assets/icon/star_icon.png")}
                                            alt="채널 선택"
                                            className="w-6 h-6"
                                        />
                                        <p className="text-[#FF1664] font-[Pretendard] cursor-pointer text-[16px] font-bold leading-normal ml-2" onClick={generateAdsChan}>
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
                                        <div className="text-[#333333] text-base leading-relaxed">
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
                        <div className="mb-4">
                            <div className="flex flex-row justify-center items-center space-x-4 relative">
                                {/* 드롭 메뉴 열기 버튼 */}
                                <button
                                    id="selectMenu"
                                    onClick={() => setIsMenuOpen((prev) => !prev)} // 토글
                                    className="cursor-pointer inline-block p-5 hover:bg-gray-300 transition-all duration-300"
                                >
                                    <img
                                        src={require("../../../assets/icon/camera_icon.png")}
                                        alt="파일 선택"
                                        className="w-10 h-10"
                                    />
                                </button>

                                {/* 드롭 메뉴들 */}
                                {isMenuOpen && (
                                    <div
                                        className="absolute bottom-full w-1/2 h-auto text-black bg-gray-100 border border-gray-100 rounded-lg shadow-lg z-10 mb-2"
                                        style={{
                                            flexShrink: "0",
                                            borderRadius: "0.625rem", // 약 10px
                                        }}
                                    >
                                        <ul>
                                            <li
                                                className="cursor-pointer p-2 hover:bg-[#2196F3] border-b flex justify-between items-center"
                                                onClick={() => handleMenuClick("gallery")}
                                            >
                                                <span className="mr-2">사진 보관함</span>
                                                <img
                                                    src={require("../../../assets/icon/gallery_icon.png")}
                                                    alt="파일 선택"
                                                    className="w-6 h-6"
                                                />
                                            </li>
                                            <li
                                                className="cursor-pointer p-2 hover:bg-[#2196F3] border-b flex justify-between items-center"
                                                onClick={() => handleMenuClick("camera")}
                                            >
                                                <span className="mr-2">사진 찍기</span>
                                                <img
                                                    src={require("../../../assets/icon/camera_black_icon.png")}
                                                    alt="사진 찍기"
                                                    className="w-6 h-6"
                                                />
                                            </li>
                                            <li
                                                className="cursor-pointer p-2 hover:bg-[#2196F3] border-b flex justify-between items-center"
                                                onClick={() => handleMenuClick("file")}
                                            >
                                                <span className="mr-2">파일 선택</span>
                                                <img
                                                    src={require("../../../assets/icon/file_icon.png")}
                                                    alt="파일 선택"
                                                    className="w-6 h-6"
                                                />
                                            </li>
                                        </ul>
                                    </div>

                                )}

                                {/* 숨겨진 파일 및 이미지 처리 버튼 */}
                                {/* 사진 찍기 버튼 */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    id="cameraInput"
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

                                {/* 파일 선택 버튼 */}
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

                                {/* 광고 생성하기 버튼 */}
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
                                className="relative flex flex-col justify-center items-center p-4 rounded-[16px] text-white min-h-7 w-full"
                                style={{
                                    background:
                                        "var(--Primary-primary_gradient, linear-gradient(270deg, #C67AF7 0%, #6B78E8 100%))",
                                    fontSize: "20px",
                                    minHeight: "56px",
                                    position: "relative"
                                }}
                            >
                                {/* 📋 클립보드 복사 버튼 */}
                                <CopyToClipboard text={content} onCopy={() => setCopied(true)}>
                                    <button
                                        className="absolute top-2 right-3 text-white hover:opacity-80 transition-opacity"
                                        title="내용 복사"
                                    >
                                        {copied ? (
                                            <ClipboardCheck size={20} strokeWidth={2.5} className="text-green-400" />
                                        ) : (
                                            <Clipboard size={20} strokeWidth={2.5} />
                                        )}
                                    </button>
                                </CopyToClipboard>

                                {/* 이벤트 텍스트 렌더링 */}
                                {title === "이벤트" ? (
                                    (() => {
                                        const parts = content.split(":");
                                        const extractedTitle = parts[1]?.split("이벤트 내용")[0]?.trim() || "";
                                        const extractedContent = parts[2]?.trim() || "";

                                        return extractedTitle || extractedContent ? (
                                            <>
                                                {extractedTitle && (
                                                    <p className="mb-2 text-xl">제목: {extractedTitle}</p>
                                                )}
                                                {extractedContent && (
                                                    <p className="mb-2 text-xl">내용: {extractedContent}</p>
                                                )}
                                            </>
                                        ) : (
                                            <span>&nbsp;</span>
                                        );
                                    })()
                                ) : (
                                    content ? <p className="text-xl">{content}</p> : <span>&nbsp;</span>
                                )}
                            </div>
                        )}


                        {/* 영상 및 이미지 영역 */}
                        <div className="flex flex-col justify-center items-center rounded-[16px] text-white pb-4">
                            {videoPath ? (
                                // 비디오 표시
                                <div className="w-full h-full flex justify-center items-center pt-4 pb-4">
                                    <video
                                        src={`${process.env.REACT_APP_FASTAPI_ADS_URL}${videoPath}`}
                                        controls
                                        className="max-w-full max-h-[600px] object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                // 이미지 슬라이더 표시
                                combineImageTexts && combineImageTexts.length > 0 && (
                                    <>
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            pagination={{
                                                clickable: true, // 페이지네이션 클릭 활성화
                                                el: '.custom-pagination', // 페이지네이션 커스텀 클래스 설정
                                            }}
                                            modules={[Pagination]}
                                            className="w-full h-full relative"
                                        >
                                            {combineImageTexts.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="flex justify-center items-center relative pt-4 pb-4">
                                                        {/* 이미지 표시 */}
                                                        <img
                                                            src={image}
                                                            alt={`Slide ${index + 1}`}
                                                            className="max-w-full  object-cover"
                                                        />

                                                        {/* 체크 아이콘 */}
                                                        <div
                                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer w-16 h-16"
                                                            onClick={() => handleImageClick(index)}
                                                        >
                                                            <img
                                                                src={
                                                                    checkImages.includes(index)
                                                                        ? require("../../../assets/icon/check_icon.png") // 체크된 상태
                                                                        : require("../../../assets/icon/non_check_icon.png") // 체크되지 않은 상태
                                                                }
                                                                alt={checkImages.includes(index) ? "Checked" : "Non-checked"}
                                                                className="w-full h-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {/* 페이지네이션 */}
                                        <div className="custom-pagination mt-4 flex justify-center items-center"></div>
                                    </>
                                )
                            )}
                        </div>


                        {/* 공유하기 버튼 */}
                        {uploadImages.length > 0 && (
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
                        {/* 비디오 공유하기 버튼 */}
                        {videoPath && (
                            <button
                                className={`flex flex-col justify-center items-center self-stretch px-[22px] py-[8px] rounded-[4px] 
                                            ${videoUploading ? "bg-[#2196F3] cursor-not-allowed" : "bg-[#2196F3] hover:bg-[#1976D2]"} 
                                            text-white text-[16px] transition-all w-full`} // text-[16px] 추가
                                onClick={videoUpload}
                                disabled={videoUploading} // 로딩 중일 때 클릭 비활성화
                            >
                                {videoUploading ? (
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
