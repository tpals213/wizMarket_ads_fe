import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Navigation 스타일 추가
import { Pagination, Navigation } from "swiper/modules"; // Navigation 모듈 추가
import AdsShareNaver from './AdsShareNaver';
import AdsShareKakao from './AdsShareKakao'
import AdsAIInstructionByTitle from './AdsAIInstructionByTitle';

const AdsModal = ({ isOpen, onClose, storeBusinessNumber }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // 결과 처리
    const [message, setMessage] = useState(''); // 기본 성공 또는 실패 메시지

    const [data, setData] = useState(null); // 모달창 열릴 때 가져오는 기본 정보
    const [storeInfo, setStoreInfo] = useState("")  // 가게 정보
    const [isStoreInfoVisible, setIsStoreInfoVisible] = useState(false);  // 가게 정보 접히기

    const [useOption, setUseOption] = useState("문자메시지");  // 사이즈 용도
    const [title, setTitle] = useState("매장 소개");    // 주제 용도
    const [customTitle, setCustomTitle] = useState(""); // 주제 기타 입력값 별도 관리
    const [detailContent, setDetailContent] = useState('');   // 실제 적용할 문구 ex)500원 할인
    const [gptRole, setGptRole] = useState(''); // gpt 역할 부여 - 지시 내용
    
    const [prompt, setPrompt] = useState(''); // gpt 내용 부여 - 전달 내용
    const [isPromptVisible, setIsPromptVisible] = useState(true);  // 전달 내용 접히기

    const [content, setContent] = useState(''); // gpt 문구 생성 결과물
    const [contentLoading, setContentLoading] = useState(false) // gpt 문구 생성 로딩
    const [contentErrorMessage, setContentErrorMessage] = useState('');   // gpt 문구 생성 에러

    const [selectedImage, setSelectedImage] = useState(null); // 파일 업로드 기존 이미지
    const [selectedImages, setSelectedImages] = useState([]); // 파일 업로드 기존 이미지
    const [imageSize, setImageSize] = useState(null);   // 이미지 사이즈

    const [modelOption, setModelOption] = useState(''); // 이미지 생성 모델 옵션
    const [styleOption, setStyleOption] = useState('Illustration')  // 이미지 생성 스타일 옵션
    const [aiPrompt, setAiPrompt] = useState('');   // 이미지 생성 프롬프트
    const [isAiPromptVisible, setAiPromptVisible] = useState(true);  // 지시 내용 접히기
    const [imageLoding, setImageLoading] = useState(false)  // 이미지 생성 로딩
    const [imageErrorMessage, setImageErrorMessage] = useState('');   // 이미지 생성 에러

    const [aiMidPrompt, setAiMidPrompt] = useState('');   // 미드 저니 생성 프롬프트
    const [isAiMidPromptVisible, setAiMidPromptVisible] = useState(true);  // 지시 내용 접히기

    const [combineImageText, setCombineImageText] = useState(null)  // 선택 텍스트 + 이미지 결과물
    const [combineImageTexts, setCombineImageTexts] = useState([]);  // 템플릿 2개

    const [uploading, setUploading] = useState(false)
    const [storeName, setStoreName] = useState('')

    const [videoUrl, setVideoUrl] = useState('')
    const [videoLoading, setVideoLoading] = useState(false)

    const optionSizes = {
        "문자메시지": { width: 1024, height: 1792 },
        "유튜브 썸네일": { width: 1792, height: 1024 },
        "인스타그램 스토리": { width: 1024, height: 1792 },
        "인스타그램 피드": { width: 1024, height: 1024 },
        "네이버 블로그": { width: 1024, height: 1792 },
        "배너": { width: 1792, height: 1024 },
    };

    const resetModalState = () => {
        setLoading(false);
        setError(null);
        setData(null);
        setSelectedImages([]);
        setImageLoading(false);
        setTitle("매장 소개"); // 초기값 유지
        setContent('');
        setContentLoading(false);
        setSaveStatus(null);
        setMessage('');
        setUseOption("문자메시지"); // 초기값 유지
        setModelOption('');
        setImageSize(null);
        // setCombineImageText('');
        setCombineImageTexts('');
        setPrompt('');
        setGptRole('');
        setDetailContent('');
        setAiPrompt('');
    };

    useEffect(() => {
        if (isOpen) {
            resetModalState();
        }
    }, [isOpen]);


    useEffect(() => {
        const fetchInitialData = async () => {
            if (isOpen) {

                try {
                    // console.log("Request URL:", `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/image`);
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
                    setImageSize(null)
                    setUseOption("문자메시지")
                    setTitle("매장 소개")
                    setModelOption("dalle")
                    setStoreName(response.data.store_name)
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

    useEffect(() => {
        if (data) {
            const dayMap = {
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_SUN: "일요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_MON: "월요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_TUE: "화요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_WED: "수요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_THU: "목요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_FRI: "금요일",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_SAT: "토요일",
            };
            const timeMap = {
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_06_09: "06~09시",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_09_12: "09~12시",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_12_15: "12~15시",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_15_18: "15~18시",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_18_21: "18~21시",
                COMMERCIAL_DISTRICT_AVERAGE_SALES_PERCENT_21_24: "21~24시",
            };
            const maleMap = {
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_20S: "남자 20대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_30S: "남자 30대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_40S: "남자 40대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_50S: "남자 50대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_M_60_OVER: "남자 60대 이상",
            };
            const femaleMap = {
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_20S: "여자 20대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_30S: "여자 30대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_40S: "여자 40대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_50S: "여자 50대",
                COMMERCIAL_DISTRICT_AVG_CLIENT_PER_F_60_OVER: "여자 60대 이상",
            };
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const dayName = days[today.getDay()];

            // 시간, 분, 초 추가
            const hours = String(today.getHours()).padStart(2, '0');
            const minutes = String(today.getMinutes()).padStart(2, '0');

            // 포맷팅
            const formattedToday = `${yyyy}-${mm}-${dd} (${dayName}) ${hours}:${minutes}`;
            setStoreInfo(`매장명 : ${data.store_name || "값 없음"}
주소 : ${data.road_name || "값 없음"}
업종 : ${data.detail_category_name || "값 없음"}
매출이 가장 높은 요일 : ${dayMap[data.maxSalesDay] || data.maxSalesDay || "값 없음"}
매출이 가장 높은 시간대 : ${timeMap[data.maxSalesTime] || data.maxSalesTime || "값 없음"}
매출이 가장 높은 남성 연령대 : ${maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음"}
매출이 가장 높은 여성 연령대 : ${femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음"}`);

            setPrompt(`매장명 : ${data.store_name || "값 없음"}
주소 : ${data.road_name || "값 없음"}
업종 : ${data.detail_category_name || "값 없음"}
날짜 : ${formattedToday}
날씨 : ${data.main}, ${data.temp}℃
매출이 가장 높은 시간대 : ${timeMap[data.maxSalesTime] || data.maxSalesTime || "값 없음"}
매출이 가장 높은 남성 연령대 : ${maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음"}
매출이 가장 높은 여성 연령대 : ${femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음"}
주제 세부 정보 : ${detailContent}`);
            setAiPrompt(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠 이미지를 생성해주세요.
- ${content || "값 없음"}
- 주제 세부 정보 : ${detailContent}
- 용도 : ${useOption || "값 없음"}
- 주제 : ${title || "값 없음"} 용
- 매장명 : ${data?.store_name || "값 없음"}
- 주소 : ${data?.road_name || "값 없음"}
- 업종 : ${data?.detail_category_name || "값 없음"}
- 스타일 : ${styleOption || "값 없음"}`);

        setAiMidPrompt(`다음 내용을 바탕으로 온라인 광고 콘텐츠 이미지를 제작합니다. 글자 없이 작성해주세요
- 테마 : ${content || "값 없음"}
- 용도 : ${useOption || "값 없음"} - ${title || "값 없음"} 용
- 업종 : ${data?.detail_category_name || "값 없음"}
- 스타일 : ${styleOption || "값 없음"}`);
        }
    }, [data, useOption, title, detailContent, content, styleOption]);




    // 문구 생성
    const generateContent = async () => {
        // 입력값 유효성 검사
        if (!title.trim()) {
            setSaveStatus('error');
            setMessage('주제를 올바르게 입력해 주세요.');
            setLoading(false); // 로딩 상태 종료
            setTimeout(() => {
                setSaveStatus(null); // 상태 초기화
                setMessage(''); // 메시지 초기화
            }, 1500);
            return;
        }
        setContentLoading(true)
        const basicInfo = {
            gpt_role: gptRole,
            prompt: prompt,
            detail_content: detailContent
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/content`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
            // console.log(response.data.content)
            setContent(response.data.content); // 성공 시 서버에서 받은 데이터를 상태에 저장
            setSaveStatus('success'); // 성공 상태로 설정
            setContentLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
            setSaveStatus('error'); // 실패 상태로 설정
            setContentErrorMessage("생성 중 오류가 발생했습니다.");
        } finally {
            setContentLoading(false)
            setTimeout(() => {
                setSaveStatus(null);
                setMessage('');
            }, 3000); // 3초 후 메시지 숨기기
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

    // 이미지 생성
    const generateImage = async () => {
        setImageLoading(true);
        const basicInfo = {
            use_option: useOption,
            ai_model_option: modelOption,
            ai_prompt: aiPrompt,
            ai_mid_prompt: aiMidPrompt
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/image`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const base64Images = response.data.image; // Base64 이미지 배열
            const newImages = base64Images.map((base64Image, index) => {
                // Base64 -> Blob -> File 변환
                const aiImageBlob = base64ToBlob(base64Image);
                const aiImageFile = new File([aiImageBlob], `ai-generated-image-${index + 1}.png`, { type: "image/png" });

                return {
                    type: "ai",
                    file: aiImageFile, // File 객체로 저장
                    previewUrl: URL.createObjectURL(aiImageBlob), // 미리보기 URL 생성
                };
            });

            setSelectedImages(newImages);
            setSaveStatus('success'); // 성공 상태로 설정
            setMessage('생성이 성공적으로 완료되었습니다.');
        } catch (err) {
            console.error('생성 중 오류 발생:', err);
            setSaveStatus('error'); // 실패 상태로 설정
            setImageErrorMessage('생성 중 오류가 발생했습니다.');
        } finally {
            setImageLoading(false); // 로딩 상태 종료
            setTimeout(() => {
                setSaveStatus(null);
                setMessage('');
            }, 3000); // 3초 후 메시지 숨기기
        }
    };


    const generateAds = async () => {
        // 입력값 유효성 검사
        if (!title.trim() || !content.trim()) {
            setSaveStatus('error');
            setImageErrorMessage('주제 혹은 문구를 올바르게 입력해 주세요.');
            setTimeout(() => {
                setSaveStatus(null);
                setImageErrorMessage('');
            }, 1500);
            return;
        }

        const formData = new FormData();
        formData.append('store_name', data.store_name);
        formData.append('road_name', data.road_name);
        formData.append('content', content);
        formData.append('use_option', useOption);
        formData.append('title', title);
        const resizedWidth = useOption === '유튜브 썸네일'
            ? 1792
            : optionSizes[useOption]?.width || null;

        // 미드저니 조건 추가
        if (modelOption === 'midJouney') {
            if (!selectedImage) {
                setSaveStatus('error');
                setMessage('미드저니에서 이미지를 선택해주세요.');
                return;
            }

            const img = new Image();
            img.src = selectedImage.previewUrl; // 선택된 이미지의 미리보기 URL 사용

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                const resizedHeight = resizedWidth
                    ? Math.round((resizedWidth / originalWidth) * originalHeight)
                    : null;

                if (resizedWidth && resizedHeight) {
                    const canvas = document.createElement('canvas');
                    canvas.width = resizedWidth;
                    canvas.height = resizedHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);

                    canvas.toBlob(
                        (blob) => {
                            const resizedFile = new File([blob], "selected-midjourney-image.png", { type: "image/png" });
                            formData.append('image', resizedFile);
                            formData.append('image_width', resizedWidth);
                            formData.append('image_height', resizedHeight);

                            // 서버로 전송
                            sendFormData(formData);
                        },
                        "image/png"
                    );
                } else {
                    formData.append('image', selectedImage.file);
                    formData.append('image_width', originalWidth);
                    formData.append('image_height', originalHeight);

                    // 서버로 전송
                    sendFormData(formData);
                }
            };

            return; // 미드저니 조건 처리 후 함수 종료
        }

        // 기존 코드 유지
        if (selectedImages.length > 0 && selectedImages[0].file) {
            const file = selectedImages[0].file;

            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;
                // console.log(originalWidth, originalHeight);
                const resizedHeight = resizedWidth
                    ? Math.round((resizedWidth / originalWidth) * originalHeight)
                    : null;

                if (resizedWidth && resizedHeight) {
                    const canvas = document.createElement('canvas');
                    canvas.width = resizedWidth;
                    canvas.height = resizedHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);

                    canvas.toBlob(
                        (blob) => {
                            const resizedFile = new File([blob], file.name, { type: file.type });
                            formData.append('image', resizedFile);
                            formData.append('image_width', resizedWidth);
                            formData.append('image_height', resizedHeight);

                            // 서버로 전송
                            sendFormData(formData);
                        },
                        file.type
                    );
                } else {
                    formData.append('image', file);
                    formData.append('image_width', originalWidth);
                    formData.append('image_height', originalHeight);

                    // 서버로 전송
                    sendFormData(formData);
                }
            };
        } else {
            setSaveStatus('error');
            setMessage('이미지를 업로드하거나 AI로 생성해주세요.');
            return;
        }
    };



    // const sendFormData = async (formData) => {
    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/combine/image/text`,
    //             formData,
    //             { headers: { 'Content-Type': 'multipart/form-data' } }
    //         );
    //         setCombineImageText(response.data.image);
    //         setSaveStatus('success');
    //         setMessage('생성이 성공적으로 완료되었습니다.');
    //     } catch (err) {
    //         console.error('저장 중 오류 발생:', err);
    //         setSaveStatus('error');
    //         setMessage('저장 중 오류가 발생했습니다.');
    //     } finally {
    //         setTimeout(() => {
    //             setSaveStatus(null);
    //             setMessage('');
    //         }, 3000);
    //     }
    // };

    // 템플릿 2개 처리
    const sendFormData = async (formData) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/combine/image/text`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 두 개의 이미지를 상태로 저장
            setCombineImageTexts(response.data.images);
            setCombineImageText(response.data.images[0])
            // console.log(response.data.image)
            setSaveStatus('success');
            setMessage('생성이 성공적으로 완료되었습니다.');
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
            setSaveStatus('error');
            setMessage('저장 중 오류가 발생했습니다.');
        } finally {
            setTimeout(() => {
                setSaveStatus(null);
                setMessage('');
            }, 3000);
        }
    };


    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        setCombineImageText(value); // 선택된 이미지 URL 저장
    };

    const handleCheckboxMidChange = (e) => {
        const { value } = e.target;
        setSelectedImage(value); // 선택된 이미지 URL 저장
    };


    const getBase64Extension = (base64) => {
        const mimeType = base64.match(/data:(.*?);base64/)[1];
        return mimeType.split("/")[1]; // 확장자 추출
    };

    const onGenerateVideo = async () => {
        setVideoLoading(true)
        const formData = new FormData();
        formData.append('title', title);
        // if (combineImageText) {
        //     const extension = getBase64Extension(combineImageText); // 확장자 추출
        //     const blob = base64ToBlob(combineImageText, `image/${extension}`);
        //     formData.append("final_image", blob, `image.${extension}`); // Blob과 확장자 추가
        // }
        
        if (modelOption === 'midJouney' && selectedImage && selectedImage.file) {
            formData.append('final_image', selectedImage.file, selectedImage.file.name); // 파일과 이름 추가
        }
        else  {
            formData.append('final_image', selectedImages[0].file, selectedImages[0].file.name); // 파일과 이름 추가
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/video`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 성공 시 받은 데이터 상태에 저장
            setVideoUrl(response.data.result_url.result_url); // 성공 시 서버에서 받은 데이터를 상태에 저장
            return response.data;
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
            setSaveStatus('error'); // 실패 상태로 설정
            setImageErrorMessage('저장 중 오류가 발생했습니다.');
        } finally {
            setVideoLoading(false)
        }
    }

    const onSave = async () => {
        // 입력값 유효성 검사
        if (!useOption.trim() || !title.trim()) {
            setSaveStatus('error');
            setImageErrorMessage('광고 채널 혹은 주제를 올바르게 선택해 주세요.');
            setLoading(false); // 로딩 상태 종료
            setTimeout(() => {
                setSaveStatus(null); // 상태 초기화
                setImageErrorMessage(''); // 메시지 초기화
            }, 1500);
            return;
        }
        const formData = new FormData();
        formData.append('store_business_number', storeBusinessNumber);
        formData.append('use_option', useOption);
        formData.append('title', title);
        formData.append('detail_title', detailContent);
        formData.append('content', content);

        selectedImages.forEach((image) => {
            formData.append('image', image.file);
        });
        // 최종 이미지 처리
        if (combineImageText) {
            const extension = getBase64Extension(combineImageText); // 확장자 추출
            const blob = base64ToBlob(combineImageText, `image/${extension}`);
            formData.append("final_image", blob, `image.${extension}`); // Blob과 확장자 추가
        }

        // // 2개 처리 중
        // if (combineImageTexts) {
        //     const extension = getBase64Extension(combineImageTexts); // 확장자 추출
        //     const blob = base64ToBlob(combineImageTexts, `image/${extension}`);
        //     formData.append("final_image", blob, `image.${extension}`); // Blob과 확장자 추가
        // }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/insert`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 성공 시 받은 데이터 상태에 저장
            setData(response.data); // 성공 시 서버에서 받은 데이터를 상태에 저장
            setSaveStatus('success'); // 성공 상태로 설정
            setImageErrorMessage('저장이 성공적으로 완료되었습니다.');
            return response.data;
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
            setSaveStatus('error'); // 실패 상태로 설정
            setImageErrorMessage('저장 중 오류가 발생했습니다.');
        } finally {
            setTimeout(() => {
                setSaveStatus(null);
                setImageErrorMessage('');
            }, 3000); // 3초 후 메시지 숨기기
        }
    };


    const onUpload = async () => {
        // 입력값 유효성 검사
        if (!content.trim()) {
            setSaveStatus('error');
            setImageErrorMessage('컨텐츠를 입력해 주세요.');
            setTimeout(() => {
                setSaveStatus(null);
                setImageErrorMessage('');
            }, 1500);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('use_option', useOption); // 컨텐츠 추가
        formData.append('content', content); // 컨텐츠 추가
        formData.append('store_name', data.store_name);
        formData.append('tag', data.detail_category_name)
        if (combineImageText) {
            const extension = getBase64Extension(combineImageText); // 확장자 추출
            const blob = base64ToBlob(combineImageText, `image/${extension}`);
            formData.append("upload_image", blob, `image.${extension}`); // Blob과 확장자 추가
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        } catch (err) {
            console.error("업로드 중 오류 발생:", err); // 발생한 에러를 콘솔에 출력
            if (err.response) {
                console.error("응답 데이터:", err.response.data); // 서버 응답 에러 메시지
                console.error("응답 상태 코드:", err.response.status); // HTTP 상태 코드
                console.error("응답 헤더:", err.response.headers); // 응답 헤더
            } else if (err.request) {
                console.error("요청 데이터:", err.request); // 서버에 도달하지 못한 요청 정보
            } else {
                console.error("설정 오류:", err.message); // 요청 설정 중 발생한 에러 메시지
            }
        } finally {
            setUploading(false);
        }
    };





    if (!isOpen) return null;

    return (
        <div className="inset-0 flex z-50 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[625px] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold">wizAd</h2>
                        <h5 className="text-l">간편한 고객 맞춤형 자동 AI광고 만들기</h5>
                        <h5 className="text-l">Create easy, personalized, automated AI ads</h5>
                    </div>
                    <button
                        onClick={onClose} // 모달 닫기 함수
                        className="text-2xl text-red-500 hover:text-red-800 focus:outline-none"
                        aria-label="Close"
                    >
                        외국어
                    </button>
                </div>
                {loading && <p>로딩 중...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {saveStatus === 'success' && (
                    <div className="p-3 mb-4 rounded bg-green-100 text-green-800">
                        {message}
                    </div>
                )}
                {saveStatus === 'error' && (
                    <div className="p-3 mb-4 rounded bg-red-100 text-red-800">
                        {message}
                    </div>
                )}

                {data && (
                    <div className="w-full border border-black p-3">
                        <div className="mb-6">
                            <p className="text-xl">매장 명: {data.store_name} </p>
                        </div>
                        <div className="mb-6 flex items-center justify-between">
                            <label className="block text-lg text-gray-700 mb-2">
                                매장 정보 깃허브 테스트
                            </label>
                            <button
                                className="text-gray-500 focus:outline-none"
                                onClick={() => setIsStoreInfoVisible(!isStoreInfoVisible)}
                            >
                                {isStoreInfoVisible ? (
                                    <>
                                        <span>&#xFE3F;</span>  {/* ▼ 아래 방향 화살표 */}
                                    </>
                                ) : (
                                    <>
                                        <span>&#xFE40;</span>  {/* ▶ 오른쪽 방향 화살표 */}
                                    </>
                                )}
                            </button>
                        </div>
                        {isStoreInfoVisible && (
                            <div className="mb-6">
                                <textarea
                                    rows={8}
                                    value={storeInfo}
                                    onChange={(e) => setStoreInfo(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        )}
                        <hr className="border-t border-black opacity-50" />
                        <div className="mb-6 mt-6">
                            <label className="block text-lg text-gray-700 mb-2">광고 채널</label>
                            <select
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={useOption}
                                onChange={(e) => setUseOption(e.target.value)}
                            >
                                <option value="문자메시지">문자메시지 (9:16)</option>
                                <option value="유튜브 썸네일">유튜브 썸네일 (16:9)</option>
                                <option value="인스타그램 스토리">인스타 스토리 (9:16)</option>
                                <option value="인스타그램 피드">인스타 피드 (1:1)</option>
                                <option value="네이버 블로그">네이버 블로그 (16:9)</option>
                                <option value="배너">배너 (16:9)</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-lg text-gray-700 mb-2">주제</label>
                            </div>
                            {/* 주제 선택 셀렉트 */}
                            <select
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={title === "기타" ? "기타" : title}
                                onChange={(e) => {
                                    if (e.target.value === "기타") {
                                        setTitle("기타"); // 기타 선택
                                    } else {
                                        setTitle(e.target.value); // 다른 옵션 선택 시 바로 title 업데이트
                                        setCustomTitle(""); // 기타 입력 초기화
                                    }
                                }}
                            >
                                <option value="매장 소개">매장 소개</option>
                                <option value="이벤트">이벤트</option>
                                <option value="상품 소개">상품 소개</option>
                                <option value="예약">예약</option>
                                <option value="시즌인사">시즌인사</option>
                                <option value="감사">감사</option>
                                <option value="공지">공지</option>
                                <option value="기타">기타</option>
                            </select>
                            {/* 기타 선택 시 추가 입력란 */}
                            {title === "기타" && (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded w-full px-3 py-2"
                                        placeholder="기타 항목을 입력하세요"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        onBlur={() => {
                                            if (customTitle.trim()) {
                                                setTitle(customTitle); // 입력 완료 시 title 업데이트
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-6 w-full">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-lg text-gray-700 mb-2">
                                    주제 세부 정보 입력
                                </label>
                            </div>
                            <div className="relative">
                                <textarea
                                    rows={2}
                                    value={detailContent}
                                    onChange={(e) => setDetailContent(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        </div>
                        <hr className="border-t border-black opacity-100" />
                            <AdsAIInstructionByTitle title={title} gptRole={gptRole} setGptRole={setGptRole}/>
                        <div className="mb-6 flex items-center justify-between">
                            <label className="block text-lg text-gray-700">
                                세부 내용 (DB+정보직접입력)
                            </label>
                            <button
                                className="text-gray-500 focus:outline-none"
                                onClick={() => setIsPromptVisible(!isPromptVisible)}
                            >
                                {isPromptVisible ? (
                                    <>
                                        <span>&#xFE3F;</span>  {/* ▼ 아래 방향 화살표 */}
                                    </>
                                ) : (
                                    <>
                                        <span>&#xFE40;</span>  {/* ▶ 오른쪽 방향 화살표 */}
                                    </>
                                )}
                            </button>
                        </div>
                        {isPromptVisible && (
                            <div className="mb-6">
                                <textarea
                                    rows={10}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        )}
                        <hr className="border-t border-black opacity-100" />
                        <div className="mb-6 mt-6 w-full">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-lg text-gray-700 mb-2">
                                    광고 카피 내용
                                </label>
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300"
                                    onClick={generateContent}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                        />
                                    </svg>
                                    ai 생성
                                </button>
                            </div>
                            <div className="relative">
                                {contentLoading ? (
                                    // 로딩 중일 때 스피너 표시
                                    <div className="h-[100px] flex items-center justify-center">
                                        <div className="w-6 h-6 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        {contentErrorMessage ? (
                                            // 에러 메시지 표시
                                            <div className="text-red-500 text-sm mt-2">{contentErrorMessage}</div>
                                        ) : (
                                            // TextEditor 또는 textarea 표시
                                            <textarea
                                                rows={5}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="border border-gray-300 rounded w-full px-3 py-2"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <hr className="border-t border-black opacity-100" />
                        <div className="mb-6 mt-6">
                            <label className="block text-lg text-gray-700 mb-2">
                                이미지 생성 모델 선택
                            </label>
                            <select
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={modelOption}
                                onChange={(e) => setModelOption(e.target.value)}
                            >
                                <option value="">이미지 생성 모델을 선택하세요</option>
                                <option value="basic">기본(Stable Diffusion)</option>
                                {/* <option value="poster">영화 포스터(Diffusion)</option> */}
                                {/* <option value="food">음식 특화(Diffusion)</option> */}
                                <option value="dalle">DALL·E 3(GPT)</option>
                                <option value="midJouney">Midjourney</option>
                            </select>
                        </div>
                        <div className="mb-6 mt-6">
                            <label className="block text-lg text-gray-700 mb-2">
                                이미지 생성 스타일
                            </label>
                            <select
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={styleOption}
                                onChange={(e) => {
                                    const newStyleOption = e.target.value;
                                    setStyleOption(newStyleOption);
                                    setAiPrompt(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠 이미지를 생성해주세요.
- ${content || "값 없음"}
- 용도 : ${useOption || "값 없음"}
- 주제 : ${title || "값 없음"} 용
- 매장명 : ${data?.store_name || "값 없음"}
- 주소 : ${data?.road_name || "값 없음"}
- 업종 : ${data?.detail_category_name || "값 없음"}
- 스타일 : ${newStyleOption || "값 없음"}`);
                                }}
                            >
                                <option value="">이미지 생성 스타일을 선택하세요</option>
                                <option value="일본 애니메이션">일본 애니메이션</option>
                                <option value="만화책 만화">만화책 만화</option>
                                <option value="사진">사진</option>
                                <option value="3D 그래픽">3D 그래픽</option>
                                <option value="2D animation">2D animation</option>
                                <option value="Illustration">Illustration</option>
                                <option value="Paper Craft">Paper Craft</option>
                                <option value="Diorama">Diorama</option>
                                <option value="아이소메트릭">아이소메트릭</option>
                                <option value="광고포스터.전단지">광고포스터.전단지</option>
                                <option value="판타지">판타지</option>
                                <option value="타이포그래픽">타이포그래픽</option>
                            </select>

                        </div>
                        <div className="mb-6 flex items-center justify-between">
                            <label className="block text-lg text-gray-700">
                                이미지 생성 Prompt
                            </label>
                            <button
                                className="text-gray-500 focus:outline-none"
                                onClick={() => setAiPromptVisible(!isAiPromptVisible)}
                            >
                                {isAiPromptVisible ? (
                                    <>
                                        <span>&#xFE3F;</span>  {/* ▼ 아래 방향 화살표 */}
                                    </>
                                ) : (
                                    <>
                                        <span>&#xFE40;</span>  {/* ▶ 오른쪽 방향 화살표 */}
                                    </>
                                )}
                            </button>
                        </div>
                        {isAiPromptVisible && (
                            <div className="mb-6">
                                <textarea
                                    rows={11}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        )}

                        <div className="mb-6 flex items-center justify-between">
                            <label className="block text-lg text-gray-700">
                                미드저니 생성 Prompt
                            </label>
                            <button
                                className="text-gray-500 focus:outline-none"
                                onClick={() => setAiMidPromptVisible(!isAiMidPromptVisible)}
                            >
                                {isAiMidPromptVisible ? (
                                    <>
                                        <span>&#xFE3F;</span>  {/* ▼ 아래 방향 화살표 */}
                                    </>
                                ) : (
                                    <>
                                        <span>&#xFE40;</span>  {/* ▶ 오른쪽 방향 화살표 */}
                                    </>
                                )}
                            </button>
                        </div>
                        {isAiMidPromptVisible && (
                            <div className="mb-6">
                                <p>미드저니 프롬프트는 다음과 같은 과정을 거쳐 생성 됩니다.</p>
                                <p>아래의 프롬프트를 역할이 설정된 gpt 로 전달하여 미드저니 프롬프트처럼 만들어 달라고 요청</p>
                                <p>생성된 프롬프트를 미드저니에게 전달하여 생성된 이미지 반환</p>
                                <br />
                                <p>gpt 역할</p>
                                <p>You are now a Midjourney prompt engineer.</p>
                                <p>Midjourney AI creates images based on given prompts.</p>
                                <p>Please refer to the link below for Midjourney.</p>
                                <p>https://en.wikipedia.org/wiki/Midjourney.</p>
                                <p>All you have to do is configure the prompt so Midjourney can generate the best image for what you're requesting.</p>
                                <textarea
                                    rows={11}
                                    value={aiMidPrompt}
                                    onChange={(e) => setAiMidPrompt(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-lg text-gray-700 mb-2">
                                    이미지 업로드
                                </label>
                                <button
                                    type="button"
                                    className="flex items-center px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300"
                                    onClick={generateImage}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                        />
                                    </svg>
                                    ai 생성
                                </button>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                onChange={(e) => {
                                    if (!useOption) {
                                        e.target.value = null; // 선택된 파일 초기화
                                        return;
                                    }
                                    const file = e.target.files[0];
                                    if (file) {
                                        const img = new Image();
                                        img.src = URL.createObjectURL(file);
                                        img.onload = () => {
                                            setSelectedImages([
                                                {
                                                    type: "file",
                                                    file,
                                                    previewUrl: img.src,
                                                    width: img.width,
                                                    height: img.height,
                                                },
                                            ]);
                                        };
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-4 justify-center items-center">
                            {imageLoding ? (
                                <div className="h-[100px] flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : imageErrorMessage ? (
                                // 에러 메시지 표시
                                <div className="text-red-500 text-center mt-4">
                                    {imageErrorMessage}
                                </div>
                            ) : modelOption === 'midJouney' && selectedImages.length > 0 ? (
                                <div className="mt-4 flex justify-center">
                                    <Swiper
                                        spaceBetween={30}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        loop={true}
                                        navigation={true} // Navigation 활성화
                                        modules={[Pagination, Navigation]} // Navigation 모듈 포함
                                        className="w-full max-w-3xl"
                                        onSlideChange={(swiper) => {
                                            const currentImage = selectedImages[swiper.realIndex]; // 실제 인덱스 사용
                                            setSelectedImage(currentImage); // 상태 업데이트
                                        }}
                                    >
                                        {selectedImages.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="text-center relative">
                                                    <img
                                                        src={image.previewUrl} // 미리보기 URL 사용
                                                        alt={`미리보기 ${index + 1}`}
                                                        style={{
                                                            maxWidth: "100%", // 부모 요소 크기에 맞게 축소
                                                            maxHeight: "100%", // 화면 크기를 넘지 않도록 설정
                                                            width: `${optionSizes[useOption]?.width || 'auto'}px`, // useOption의 가로 크기로 맞춤
                                                            height: `${optionSizes[useOption]?.width && imageSize?.width && imageSize?.height
                                                                ? (optionSizes[useOption].width / imageSize.width) * imageSize.height // 비율에 맞춘 세로 크기
                                                                : 'auto'
                                                                }px`,
                                                        }}
                                                        className="h-auto rounded-md shadow-md mx-auto"
                                                    />
                                                    <div className="flex justify-center">
                                                        <input
                                                            type="radio"
                                                            name="selectedImage"
                                                            value={image.previewUrl}
                                                            onChange={(e) => handleCheckboxMidChange(e)}
                                                            className="mb-12 mt-4 form-radio w-6 h-6"
                                                            checked={selectedImage?.previewUrl === image.previewUrl}  // 동기화된 상태 유지
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                selectedImages.length > 0 && (
                                    <div className="mt-4 flex justify-center">
                                        <div className="relative">
                                            <img
                                                src={selectedImages[0]?.previewUrl} // 미리보기 URL 사용
                                                alt="미리보기"
                                                style={{
                                                    width: `${optionSizes[useOption]?.width || 'auto'}px`, // useOption의 가로 크기로 맞춤
                                                    height: `${optionSizes[useOption]?.width && imageSize?.width && imageSize?.height
                                                        ? (optionSizes[useOption].width / imageSize.width) * imageSize.height // 비율에 맞춘 세로 크기
                                                        : 'auto'
                                                        }px`,
                                                }}
                                                className="rounded object-contain"
                                            />

                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={generateAds}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                템플릿 적용
                            </button>
                        </div>
                        {/* 이미지 결과물 영역 */}
                        {/* <div className="mt-4">
                            <div className="max-h-screen overflow-auto flex justify-center items-center">
                                {combineImageTexts ? (
                                    <img src={combineImageTexts} alt="결과 이미지" className="h-auto" />
                                ) : (
                                    <p className="text-center text-gray-500 p-4">이미지를 생성해주세요</p>
                                )}
                            </div>
                        </div> */}
                        <div className="mt-4">
                            <div className="flex items-center justify-center">
                                {combineImageTexts && combineImageTexts.length > 0 ? (
                                    <Swiper
                                        spaceBetween={30}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        loop={true}
                                        navigation={true} // Navigation 활성화
                                        modules={[Pagination, Navigation]} // Navigation 모듈 포함
                                        className="w-full max-w-3xl"
                                        onSlideChange={(swiper) => {
                                            const currentImage = combineImageTexts[swiper.realIndex]; // 실제 인덱스 사용
                                            setCombineImageText(currentImage); // 상태 업데이트
                                        }}
                                    >
                                        {combineImageTexts.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="text-center">
                                                    <img
                                                        src={image} // 각각의 이미지 URL
                                                        alt={`결과 이미지 ${index + 1}`}
                                                        className="h-auto rounded-md shadow-md mx-auto"
                                                    />
                                                    <div className="flex justify-center">
                                                        <input
                                                            type="radio"
                                                            name="selectedImage"
                                                            value={image}
                                                            onChange={(e) => handleCheckboxChange(e)}
                                                            className="mb-12 mt-4 form-radio w-6 h-6"
                                                            checked={combineImageText === image} // 동기화된 상태 유지
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <p className="text-center text-gray-500 p-4">이미지를 생성해주세요</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center mt-6">
                    {/* 좌측 닫기 버튼 */}
                    <div>
                        <button
                            onClick={() => window.location.reload()} // 새로고침
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            초기화
                        </button>
                    </div>

                    {/* 우측 수정 및 삭제 버튼 */}
                    <div className="flex space-x-4">
                        <AdsShareKakao
                            title={`[${storeName}] ${title}`}   // 제목 ex) [몽뜨레셰프] 매장 소개
                            storeName={storeName}   // 가게명
                            content={content || "새로운 광고 메시지를 확인하세요!"} // 내용
                            storeBusinessNumber={storeBusinessNumber}   // pk 값
                            base64Image={combineImageText}  // 생성 이미지
                            onSave={onSave} // 저장 함수
                        />
                        <button
                            onClick={onUpload}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex justify-center items-center"
                            disabled={uploading} // 업로드 중일 때 버튼 비활성화
                        >
                            {uploading ? (
                                <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "업로드"
                            )}
                        </button>
                        <button
                            onClick={onGenerateVideo}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            disabled={videoLoading}
                        >
                            {videoLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "영상"
                            )}
                        </button>
                        <button
                            onClick={onSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            저장
                        </button>
                    </div>
                </div>
                <div className="mt-2 flex flex-col items-center justify-center p-4 rounded">
                    <p className="text-gray-600 text-sm">현재 문자메시지는 이메일로 전송됩니다.</p>
                </div>
                <div className="mt-2 flex-col items-center justify-center p-4 rounded hidden">
                    <AdsShareNaver title={title} content={content} storeName={storeName} />
                </div>
                <div>
                    {videoUrl && (
                        <video controls>
                        <source
                            src={`${process.env.REACT_APP_FASTAPI_ADS_URL}${videoUrl}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdsModal;
