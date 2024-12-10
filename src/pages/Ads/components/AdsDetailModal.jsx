import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import AdsDeatilShareKakao from './AdsDeatilShareKakao';

const AdsDetailModal = ({ isOpen, onClose }) => {
    const location = useLocation();

    // URL 쿼리 파라미터를 파싱
    const queryParams = new URLSearchParams(location.search);
    const ads = Object.fromEntries(queryParams.entries()); // 쿼리 파라미터를 객체로 변환
    const storeBusinessNumber = ads.store_business_number;
    const storeName = ads.store_name
    const adsId = ads.ads_id


    const previousAds = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // 결과 처리
    const [message, setMessage] = useState(''); // 기본 성공 또는 실패 메시지

    const [data, setData] = useState(null); // 모달창 열릴 때 가져오는 기본 정보

    const [useOption, setUseOption] = useState("");  // 사이즈 용도
    const [title, setTitle] = useState("");    // 주제 용도
    const [customTitle, setCustomTitle] = useState(""); // 주제 기타 입력값 별도 관리
    const [detailContent, setDetailContent] = useState("");   // 실제 적용할 문구 ex)500원 할인
    const [gptRole, setGptRole] = useState(''); // gpt 역할 부여 - 지시 내용
    const [prompt, setPrompt] = useState(''); // gpt 내용 부여 - 전달 내용

    const [content, setContent] = useState(''); // gpt 문구 생성 결과물
    const [contentLoading, setContentLoading] = useState(false) // gpt 문구 생성 로딩
    const [contentErrorMessage, setContentErrorMessage] = useState('');   // gpt 문구 생성 에러

    const [selectedImages, setSelectedImages] = useState([]); // 파일 업로드 기존 이미지

    const [imageErrorMessage, setImageErrorMessage] = useState('');   // 이미지 생성 에러
    const [imageStatus, setImageStatus] = useState('');   // 이미지 생성 상태

    const [combineImageText, setCombineImageText] = useState(null)  // 텍스트 + 이미지 결과물
    const [combineImageTexts, setCombineImageTexts] = useState([]);  // 템플릿 2개

    const [showButtons, setShowButtons] = useState(false);  // 공유하기 버튼 상태값
    const [uploading, setUploading] = useState(false)
    const buttonsContainerRef = useRef(null); // 버튼 컨테이너 참조

    const optionSizes = {
        "문자메시지": { width: 333, height: 458 },
        "유튜브 썸네일": { width: 412, height: 232 },
        "인스타그램 스토리": { width: 412, height: 732 },
        "인스타그램 피드": { width: 412, height: 514 },
        "네이버 블로그": { width: 400, height: 400 },
        "배너": { width: 377, height: 377 },
    };

    const resetModalState = () => {
        setLoading(false);
        setError(null);
        setData(null);
        setSelectedImages([]);
        setTitle(''); // 초기값 유지
        setContent('');
        setContentLoading(false);
        setSaveStatus(null);
        setMessage('');
        setUseOption(''); // 초기값 유지
        setCombineImageText('');
        setPrompt('');
        setDetailContent('');
    };

    useEffect(() => {
        if (isOpen) {
            resetModalState();
        }
    }, [isOpen]);


    useEffect(() => {
        const fetchInitialData = async () => {
            const currentAdsString = JSON.stringify(ads);
            const previousAdsString = previousAds.current;
            if (isOpen && ads && currentAdsString !== previousAdsString) {
                try {
                    setLoading(true);
                    const response = await axios.post(
                        `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/select/init/info`,
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
                    previousAds.current = currentAdsString; // 현재 상태 저장
                    setData(updatedData);
                    setTitle(ads.title)
                    setUseOption(ads.use_option)
                    setDetailContent(ads.detail_title && ads.detail_title !== "null" ? ads.detail_title : "");
                    setContent(ads.content)

                } catch (err) {
                    console.error("초기 데이터 로드 중 오류 발생:", err);
                    setError("초기 데이터 로드 중 오류가 발생했습니다.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInitialData();
    }, [isOpen, storeBusinessNumber, ads]);

    useEffect(() => {
        if (data) {
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
            const formattedToday = `${yyyy}-${mm}-${dd} (${dayName}) ${hours}:${minutes}`;
            setGptRole(`다음과 같은 내용을 바탕으로 온라인 광고 콘텐츠를 제작하려고 합니다. 
잘 어울리는 광고 문구를 생성해주세요.
- 현재 날짜, 날씨, 시간, 계절 등의 상황에 어울릴 것
- 주제 세부 정보 내용을 바탕으로 40자 이상 60자 이내로 작성할 것
- 특수기호, 이모티콘은 제외할 것
- 주제 : ${title} 형태로 작성할 것`);
            setPrompt(`매장명 : ${data.store_name || "값 없음"}
주소 : ${data.road_name || "값 없음"}
업종 : ${data.detail_category_name || "값 없음"}
날짜 : ${formattedToday}
날씨 : ${data.main}, ${data.temp}℃
매출이 가장 높은 시간대 : ${timeMap[data.maxSalesTime] || data.maxSalesTime || "값 없음"}
매출이 가장 높은 남성 연령대 : ${maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음"}
매출이 가장 높은 여성 연령대 : ${femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음"}
주제 세부 정보 : ${detailContent}`);
            
        }
    }, [data, useOption, title, detailContent, content]);


    useEffect(() => {
        const processImageAsFile = async () => {
            if (ads?.ads_image_url && selectedImages.length === 0) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_FASTAPI_ADS_URL}${ads.ads_image_url}`);
                    const blob = await response.blob();
                    const file = new File([blob], "existing-image.jpg", { type: blob.type });

                    setSelectedImages([
                        {
                            type: "file", // 파일로 표시
                            file, // 실제 파일 객체
                            previewUrl: URL.createObjectURL(file), // 미리보기 URL
                        },
                    ]);
                } catch (error) {
                    console.error("이미지를 파일로 처리하는 중 오류 발생:", error);
                }
            }
        };

        processImageAsFile();
    }, [ads?.ads_image_url, selectedImages]);





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
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/generate/content`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
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
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    // // 이미지 생성
    // const generateImage = async () => {
    //     setImageLoading(true)
    //     const basicInfo = {
    //         use_option: useOption,
    //         ai_model_option: modelOption,
    //         ai_prompt: aiPrompt,
    //     };

    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/generate/image`,
    //             basicInfo,
    //             { headers: { 'Content-Type': 'application/json' } }
    //         );
    //         // 성공 시 받은 데이터 상태에 저장
    //         const { image: base64Image } = response.data; // AI로 생성된 Base64 이미지
    //         // Base64 -> Blob -> File 변환
    //         const aiImageBlob = base64ToBlob(base64Image);
    //         const aiImageFile = new File([aiImageBlob], "ai-generated-image.png", { type: "image/png" });
    //         // selectedImages에 추가
    //         setSelectedImages([
    //             {
    //                 type: "ai",
    //                 file: aiImageFile, // File 객체로 저장
    //                 previewUrl: URL.createObjectURL(aiImageBlob), // 미리보기 URL
    //             },
    //         ]);
    //         setSaveStatus('success'); // 성공 상태로 설정
    //         setMessage('생성이 성공적으로 완료되었습니다.');
    //         setImageLoading(false)
    //     } catch (err) {
    //         console.error('생성 중 오류 발생:', err);
    //         setSaveStatus('error'); // 실패 상태로 설정
    //         setImageErrorMessage('생성 중 오류가 발생했습니다.');
    //     } finally {
    //         setImageLoading(false); // 로딩 상태 종료
    //         setTimeout(() => {
    //             setSaveStatus(null);
    //             setMessage('');
    //         }, 3000); // 3초 후 메시지 숨기기
    //     }
    // };

    const generateAds = async () => {
        if (!title.trim() || !content.trim()) {
            setImageStatus("error");
            setImageErrorMessage("주제 혹은 문구를 올바르게 입력해 주세요.");
            setTimeout(() => {
                setImageStatus(null);
                setImageErrorMessage("");
            }, 1500);
            return;
        }



        const formData = new FormData();
        formData.append("store_name", data.store_name);
        formData.append("road_name", data.road_name);
        formData.append("content", content);

        const resizedWidth = optionSizes[useOption]?.width || null;

        if (selectedImages.length > 0) {
            if (selectedImages[0]?.file) {
                // 파일 처리
                const file = selectedImages[0].file;

                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    const originalWidth = img.width;
                    const originalHeight = img.height;

                    const resizedHeight = resizedWidth
                        ? Math.round((resizedWidth / originalWidth) * originalHeight)
                        : null;

                    if (resizedWidth && resizedHeight) {
                        const canvas = document.createElement("canvas");
                        canvas.width = resizedWidth;
                        canvas.height = resizedHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);

                        canvas.toBlob(
                            (blob) => {
                                const resizedFile = new File([blob], file.name, { type: file.type });
                                formData.append("image", resizedFile);
                                formData.append("image_width", resizedWidth);
                                formData.append("image_height", resizedHeight);

                                sendFormData(formData);
                            },
                            file.type
                        );
                    } else {
                        formData.append("image", file);
                        formData.append("image_width", originalWidth);
                        formData.append("image_height", originalHeight);

                        sendFormData(formData);
                    }
                };
            } else if (selectedImages[0]?.type === "url") {
                // URL 처리
                const response = await fetch(selectedImages[0]?.previewUrl);
                const blob = await response.blob();
                const file = new File([blob], "existing-image.jpg", { type: blob.type });

                formData.append("image", file);
                formData.append("image_width", resizedWidth || "auto");
                formData.append("image_height", "auto");

                sendFormData(formData);
            }
        } else {
            setSaveStatus("error");
            setMessage("이미지를 업로드하거나 AI로 생성해주세요.");
            setTimeout(() => {
                setSaveStatus(null);
                setMessage("");
            }, 1500);
        }
    };

    // const sendFormData = async (formData) => {
    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/combine/image/text`,
    //             formData,
    //             { headers: { "Content-Type": "multipart/form-data" } }
    //         );
    //         setCombineImageText(response.data.image); // 새로 생성된 이미지를 상태로 설정
    //         setSaveStatus("success");
    //         setMessage("생성이 성공적으로 완료되었습니다.");
    //     } catch (err) {
    //         console.error("저장 중 오류 발생:", err);
    //         setSaveStatus("error");
    //         setMessage("저장 중 오류가 발생했습니다.");
    //     } finally {
    //         setTimeout(() => {
    //             setSaveStatus(null);
    //             setMessage("");
    //         }, 3000);
    //     }
    // };

    // 템플릿 2개 처리
    const sendFormData = async (formData) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/combine/image/text`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 두 개의 이미지를 상태로 저장
            setCombineImageTexts(response.data.images);
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

    const getBase64Extension = (base64) => {
        const mimeType = base64.match(/data:(.*?);base64/)[1];
        return mimeType.split("/")[1]; // 확장자 추출
    };

    const onUpdate = async () => {
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

        // 기존 이미지 처리
        selectedImages.forEach((image) => {
            formData.append('image', image.file);
        });
        // 최종 이미지 처리
        if (combineImageText) {
            const extension = getBase64Extension(combineImageText); // 확장자 추출
            const blob = base64ToBlob(combineImageText, `image/${extension}`);
            formData.append("final_image", blob, `image.${extension}`); // Blob과 확장자 추가
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/update`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // 성공 시 받은 데이터 상태에 저장
            if (response.status === 200) {
                // 부모 페이지에 메시지 전송
                if (window.opener) {
                    window.opener.postMessage("reload", "*");
                }
                // 모달 창 닫기
                window.close();
            } else {
                console.log("수정 실패");
                alert("수정 실패: 항목을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("수정 중 오류 발생:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    const onShow = () => {
        setShowButtons((prev) => !prev);

        // 버튼 보이게 설정된 후 스크롤 이동
        setTimeout(() => {
            if (buttonsContainerRef.current) {
                buttonsContainerRef.current.scrollIntoView({
                    behavior: "smooth", // 부드러운 스크롤
                    block: "nearest", // 컨테이너 위치를 화면에서 가장 가까운 곳에 맞춤
                });
            }
        }, 0); // 상태 업데이트 후 실행
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
        } else {
            // ads.final_image_url 경로에서 이미지 가져와 처리
            const response = await axios.get(`${process.env.REACT_APP_FASTAPI_BASE_URL}${ads.ads_final_image_url}`, {
                responseType: "blob",
            });

            const file = new File([response.data], "uploaded_image.png", { type: response.data.type });
            formData.append("upload_image", file);
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/upload`,
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

    const onDelete = async () => {
        const basicInfo = {
            ads_id: ads.ads_id,
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/ads/delete/status`,
                basicInfo,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                // 부모 페이지에 메시지 전송
                if (window.opener) {
                    window.opener.postMessage("reload", "*");
                }
                // 모달 창 닫기
                window.close();
            } else {
                console.log("삭제 실패");
                alert("삭제 실패: 항목을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("삭제 중 오류 발생:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };
    if (!isOpen) return null;

    return (
        <div className="inset-0 flex z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[625px] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold">wizAd</h2>
                        <h5 className="text-l">간편한 고객 맞춤형 자동 AI광고 만들기</h5>
                        <h5 className="text-l">Create easy, personalized, automated AI ads</h5>
                    </div>
                    {/* <button
                        onClick={onClose} // 모달 닫기 함수
                        className="text-2xl text-red-500 hover:text-red-800 focus:outline-none"
                        aria-label="Close"
                    >
                        외국어
                    </button> */}
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

                        <hr className="border-t border-black opacity-100" />
                        <div className="mb-6 mt-6">
                            <label className="block text-lg text-gray-700 mb-2">광고 채널</label>
                            <select
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={useOption}
                                onChange={(e) => setUseOption(e.target.value)}
                            >
                                <option value="문자메시지">문자메시지 (333x458)</option>
                                <option value="유튜브 썸네일">유튜브 썸네일 (412x232)</option>
                                <option value="인스타그램 스토리">인스타 스토리 (412x732)</option>
                                <option value="인스타그램 피드">인스타 피드 (412x514)</option>
                                <option value="네이버 블로그">네이버 블로그</option>
                                <option value="배너">배너 (377x377)</option>
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
                                    주제 세부 정보
                                </label>
                            </div>
                            <textarea
                                rows={2}
                                value={detailContent || ""} // null 또는 undefined를 빈 문자열로 변환
                                onChange={(e) => setDetailContent(e.target.value)}
                                className="border border-gray-300 rounded w-full px-3 py-2"
                            />
                        </div>
                        <hr className="border-t border-black opacity-100" />


                        <hr className="border-t border-black opacity-100" />

                        {/* 숨김 내용 */}
                        <div className="mb-6 mt-6 hidden">
                            <label className="block text-lg text-gray-700 mb-2">
                                AI에게 명령할 내용 (지시문)
                            </label>
                            <div>
                                <textarea
                                    rows={8}
                                    value={gptRole}
                                    onChange={(e) => setGptRole(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="mb-6 hidden">
                            <label className="block text-lg text-gray-700">
                                세부 내용 (DB+정보직접입력)
                            </label>
                            <div className="">
                                <textarea
                                    rows={10}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        </div>

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
                                    AI 재생성하기
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
                        {/* <hr className="border-t border-black opacity-100" />
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
                                <option value="poster">영화 포스터(Diffusion)</option>
                                <option value="food">음식 특화(Diffusion)</option>
                                <option value="dalle">DALL·E 3(GPT)</option>
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
                        <div className="mb-6 hidden">
                            <label className="block text-lg text-gray-700">
                                이미지 생성 Prompt
                            </label>
                            <div className="mb-6">
                                <textarea
                                    rows={11}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>
                        </div>
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
                                    AI 이미지 재생성하기
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
                        </div> */}
                        {/* <div className="mt-4 flex justify-center">
                            {imageLoding ? (
                                <div className="flex justify-center items-center w-48 h-48">
                                    <div className="w-6 h-6 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : selectedImages.length > 0 ? (
                                // 선택되거나 변경된 이미지를 표시
                                <div className="mt-4 flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={selectedImages[0]?.previewUrl}
                                            alt="이미지 미리보기"
                                            style={{
                                                width: `${optionSizes[useOption]?.width || 'auto'}px`,
                                                height: `${optionSizes[useOption]?.width && imageSize?.width && imageSize?.height
                                                    ? (optionSizes[useOption].width / imageSize.width) * imageSize.height
                                                    : 'auto'
                                                    }px`,
                                            }}
                                            className="rounded object-contain"
                                        />
                                        
                                        <button
                                            className="absolute top-4 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                            onClick={() => setSelectedImages([])}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center mt-4">이미지를 업로드해주세요.</p>
                            )}
                        </div> */}


                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={generateAds}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                템플릿 재적용
                            </button>
                        </div>

                        {/* 이미지 결과물 영역 */}
                        <div className="mt-4">
                            <div className="max-h-screen overflow-auto flex items-center justify-center">
                                {imageStatus === "error" && imageErrorMessage ? (
                                    // 에러 메시지를 최우선으로 처리
                                    <div className="text-red-500 text-center p-4">
                                        {imageErrorMessage}
                                    </div>
                                ) : combineImageTexts && combineImageTexts.length > 0 ? (
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
                                ) : ads.ads_final_image_url ? (
                                    <div className="text-center">
                                        {/* 기존 이미지 표시 */}
                                        <img
                                            src={`${process.env.REACT_APP_FASTAPI_ADS_URL}${ads.ads_final_image_url}`}
                                            alt="기존 이미지"
                                            className="h-auto rounded-md shadow-md"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 p-4">이미지를 생성해주세요</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* 수정, 삭제, 닫기 버튼 */}
                <div className="flex justify-between items-center mt-6">
                    {/* 좌측 닫기 버튼 */}
                    <div>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            닫기
                        </button>
                    </div>

                    {/* 우측 수정 및 삭제 버튼 */}
                    <div className="flex space-x-4">
                        <button
                            onClick={onShow}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                        >
                            <img
                                className="w-6 h-6"
                                src={require("../../../assets/sns/sns.png")}
                                alt="user-img"
                            />
                        </button>
                        <button
                            onClick={onDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            삭제
                        </button>
                        <button
                            onClick={onUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            수정
                        </button>
                    </div>
                </div>
                {showButtons && (
                    <div 
                        className="flex justify-end items-center mt-6"
                        ref={buttonsContainerRef}
                    >
                        <div className="flex space-x-4">
                            <div>
                                <AdsDeatilShareKakao
                                    id="kakaoShareButton" // 버튼 ID
                                    title={title}
                                    content={content}
                                    storeName={storeName}
                                    storeBusinessNumber={storeBusinessNumber}
                                    filePath={
                                        combineImageText
                                            ? `${combineImageText}` // combineImageText 있을 경우
                                            : `${process.env.REACT_APP_FASTAPI_ADS_URL}${ads.ads_final_image_url}` // 없을 경우 기존 값 유지
                                    }
                                    adsPkValue={adsId}
                                />
                                <p className="mt-2 text-center">카카오톡</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setUseOption("문자메시지"); // 값 변경
                                        onUpload(); // 업로드 동작 호출
                                    }}
                                    className="flex flex-col items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-md"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <img
                                            className="w-8 h-8"
                                            src={require("../../../assets/sns/mail.png")}
                                            alt="mail_img"
                                        />
                                    )}
                                </button>
                                <p className="mt-2 text-center">메일</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setUseOption("인스타그램 피드"); // 값 변경
                                        onUpload(); // 업로드 동작 호출
                                    }}
                                    className="flex flex-col items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-md"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <img
                                            className="w-8 h-8"
                                            src={require("../../../assets/sns/insta_feed.png")}
                                            alt="insta_feed_img"
                                        />
                                    )}
                                </button>
                                <p className="mt-2 text-center">피드</p>
                            </div>
                            {/* 인스타 스토리 버튼 */}
                            <div>
                                <button
                                    onClick={() => {
                                        setUseOption("인스타그램 스토리"); // 값 변경
                                        onUpload(); // 업로드 동작 호출
                                    }}
                                    className="flex flex-col items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-md"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <img
                                            className="w-8 h-8"
                                            src={require("../../../assets/sns/insta_story.png")}
                                            alt="insta_story_img"
                                        />
                                    )}
                                </button>
                                <p className="mt-2 text-center">스토리</p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsDetailModal;
