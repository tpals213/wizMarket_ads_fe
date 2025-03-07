import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import "swiper/css";
import "swiper/css/pagination"; // pagination 스타일 추가
import "./../../../styles/swiper.css";

import AdsAIInstructionByTitle from './AdsAIInstructionByTitle';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Clipboard, ClipboardCheck } from "lucide-react"; // 아이콘 추가
import "./../../../styles/drag.css";
import AdsSwiper from './AdsSwiper';
import "../../../styles/templateFont.css"
import AdsSeedPrompt from './AdsSeedPrompt';
import { toPng } from "html-to-image";



const AdsModalTemVer2 = ({ isOpen, onClose, storeBusinessNumber }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // 결과 처리
    const [message, setMessage] = useState(''); // 기본 성공 또는 실패 메시지

    const [data, setData] = useState(null); // 모달창 열릴 때 가져오는 기본 정보

    const [useOption, setUseOption] = useState("");  // 사이즈 용도
    const [title, setTitle] = useState("매장 소개");    // 주제 용도
    const [detailContent, setDetailContent] = useState('');   // 실제 적용할 문구 ex)500원 할인

    const [adsChan, setAdsChan] = useState(''); // gpt가 생성한 추천 광고 채널
    const [adsChanLoading, setAdsChanLoading] = useState(false); // 추천 광고 채널 로딩 처리
    const [adsChanVisible, setAdsChanVisible] = useState(false);    // 보이기

    const [gptRole, setGptRole] = useState(''); // gpt 역할 부여 - 지시 내용

    const [content, setContent] = useState(''); // gpt 문구 생성 결과물
    const [withoutSign, setWithoutSign] = useState(''); // "gpt 문구 생성 결과물"에서 "" 제거
    const [contentLoading, setContentLoading] = useState(false) // gpt 문구 생성 로딩
    const [checkImages, setCheckImages] = useState([]); // 선택된 이미지들의 인덱스
    const [uploadImages, setUploadImages] = useState([]); // 선택된 이미지들
    const [uploading, setUploading] = useState(false)   // 이미지 업로드 로딩 처리

    const [selectedImages, setSelectedImages] = useState([]); // 기존 이미지 파일 업로드 
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 사진 선택 메뉴 열기

    const [instaCopytight, setInstaCopyright] = useState('')
    const [weekday, setWeekday] = useState(''); // 요일

    // 프론트 이미지 처리
    const [convertTempImg, setConvertTempImg] = useState([]);
    const [isReadyToUpload, setIsReadyToUpload] = useState(false);
    const [imageTemplateList, setImageTemplateList] = useState([]);
    const [isCaptured, setIsCaptured] = useState(false); // ✅ 캡처 여부 상태



    // 문구 복사 처리
    const [copied, setCopied] = useState(false);


    // 디자인 스타일 선택 값
    const [designStyle, setDesignStyle] = useState('포토실사');

    // 이미지에 맞는 시드 프롬프트 값들
    const [seedPrompt, setSeedPrompt] = useState("");

    // 템플릿 선택되게끔
    const [exampleImage, setExampleImage] = useState(null);

    // 시드 템플릿 선택
    const handleTemplateClick = (imgObj) => {
        if (exampleImage === imgObj.src) {
            // 현재 선택된 이미지라면 선택 해제
            setExampleImage(null);
            setSeedPrompt("");
        } else {
            // 새로운 이미지 선택
            setExampleImage(imgObj.src);
            setSeedPrompt(AdsSeedPrompt[imgObj.src] || "");
        }
    };

    // 디자인 스타일 드래그 처리
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const startDragging = useCallback((e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    }, []);

    const onDrag = useCallback((e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // 이동 거리 조절
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    const stopDragging = useCallback(() => {
        isDragging.current = false;
    }, []);



    // 선택한 스타일에 따라 이미지 필터링
    const filteredImages = (() => {
        const baseURL = "/assets/template"; // public 폴더 내 정적 파일 경로
        switch (designStyle) {
            case "3D감성":
                return [
                    { src: `${baseURL}/3D/3D_image_1.png` },
                    { src: `${baseURL}/3D/3D_image_2.png` },
                    { src: `${baseURL}/3D/3D_image_3.png` },
                    { src: `${baseURL}/3D/3D_image_4.png` },
                    { src: `${baseURL}/3D/3D_image_5.png` },
                    { src: `${baseURL}/3D/3D_image_6.png` },
                    { src: `${baseURL}/3D/3D_image_7.png` },
                    { src: `${baseURL}/3D/3D_image_8.png` },
                    // { src: `${baseURL}/3D/3D_image_9.png` },
                    // { src: `${baseURL}/3D/3D_image_10.png` },
                ];
            case "포토실사":
                return [
                    { src: `${baseURL}/photo/photo_image_1.png` },
                    { src: `${baseURL}/photo/photo_image_2.png` },
                    { src: `${baseURL}/photo/photo_image_3.png` },
                    { src: `${baseURL}/photo/photo_image_4.png` },
                    { src: `${baseURL}/photo/photo_image_5.png` },
                    { src: `${baseURL}/photo/photo_image_6.png` },
                    { src: `${baseURL}/photo/photo_image_7.png` },
                ];
            case "캐릭터만화":
                return [
                    { src: `${baseURL}/character/character_image_1.png` },
                    { src: `${baseURL}/character/character_image_2.png` },
                    { src: `${baseURL}/character/character_image_3.png` },
                    { src: `${baseURL}/character/character_image_4.png` },
                ];
            case "레트로":
                return [
                    { src: `${baseURL}/retro/retro_image_1.png` },
                    { src: `${baseURL}/retro/retro_image_2.png` },
                    { src: `${baseURL}/retro/retro_image_3.png` },
                    { src: `${baseURL}/retro/retro_image_4.png` },
                ];
            case "AI모델":
                return [
                    { src: `${baseURL}/aiModel/aiModel_image_1.png` },
                    { src: `${baseURL}/aiModel/aiModel_image_2.png` },
                    { src: `${baseURL}/aiModel/aiModel_image_3.png` },
                    { src: `${baseURL}/aiModel/aiModel_image_4.png` },
                ];
            case "예술":
                return [
                    { src: `${baseURL}/art/art_image_1.png` },
                    { src: `${baseURL}/art/art_image_2.png` },
                    { src: `${baseURL}/art/art_image_3.png` },
                    { src: `${baseURL}/art/art_image_4.png` },
                    { src: `${baseURL}/art/art_image_5.png` },
                ];
            default:
                return [];
        }
    })();


    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        scrollContainer.addEventListener("mousedown", startDragging);
        scrollContainer.addEventListener("mousemove", onDrag);
        scrollContainer.addEventListener("mouseup", stopDragging);
        scrollContainer.addEventListener("mouseleave", stopDragging);

        return () => {
            scrollContainer.removeEventListener("mousedown", startDragging);
            scrollContainer.removeEventListener("mousemove", onDrag);
            scrollContainer.removeEventListener("mouseup", stopDragging);
            scrollContainer.removeEventListener("mouseleave", stopDragging);
        };
    }, [filteredImages, onDrag, startDragging, stopDragging]);


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

        setCheckImages([])
        setUploadImages([])
        setUploading(false)

        setGptRole('');
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
                    setTitle('매장 소개')

                    // ✅ 오늘의 요일 설정
                    const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                    const today = new Date().getDay(); // 0(일) ~ 6(토)
                    setWeekday(daysOfWeek[today]);

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
                setUploadImages([...uploadImages, imageTemplateList[index]]);
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
                setUploadImages([imageTemplateList[index]]);
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
        setContentLoading(true);

        const updatedTitle = title === "" ? "매장 소개" : title;
        const updatedUseOption = useOption === "" ? "인스타그램 스토리" : useOption;

        const formData = new FormData();
        formData.append('store_name', data.store_name);
        formData.append('road_name', data.road_name);
        formData.append('tag', data.detail_category_name);
        formData.append('weather', data.main);
        formData.append('temp', data.temp);
        formData.append('male_base', maleMap[data.maxSalesMale] || data.maxSalesMale || "값 없음");
        formData.append('female_base', femaleMap[data.maxSalesFemale] || data.maxSalesFemale || "값 없음");
        formData.append('gpt_role', gptRole);
        formData.append('detail_content', detailContent || "값 없음");
        formData.append('use_option', updatedUseOption);
        formData.append('title', updatedTitle);


        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/exist/image/template2`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setContent(response.data.copyright); // 성공 시 데이터 저장
            setInstaCopyright(response.data.insta_copyright);
            setWithoutSign(response.data.copyright.replace(/["']/g, "").trim());
            // 🔥 파일을 Base64로 변환해서 저장
            const fileToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            };

            const base64Image = await fileToBase64(imageData.file);
            setImageTemplateList([base64Image]); // 🔥 Base64 데이터 저장

        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setContentLoading(false);
        }
    };


    // AI 로생성
    const generateAds = async () => {
        // 기본 값 부여
        const updatedTitle = title === "" ? "매장 소개" : title;
        const updatedUseOption = useOption === "" ? "인스타그램 스토리" : useOption;
        const aiModelOption = "imagen3"; // 이미지 생성 모델 옵션
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
            seed_prompt: seedPrompt
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/template2`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setContent(response.data.copyright); // 성공 시 서버에서 받은 데이터를 상태에 저장
            // setOriginImage(response.data.origin_image)
            const formattedOriginImage = `data:image/png;base64,${response.data.origin_image[0]}`;
            // console.log(response.data);
            setWithoutSign(response.data.copyright.replace(/["']/g, "").trim());
            setImageTemplateList([formattedOriginImage])
            setInstaCopyright(response.data.insta_copyright)
            setContentLoading(false)
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
            console.log(selectedImages)
        } finally {
            setContentLoading(false)
        }
    };

    // 선택한 템플릿 업로드
    const onUpload = async () => {
        const index = checkImages[0];
    
        let useOptionPath = "";
        let titlePath = "";
    
        if (title === "매장 소개") {
          titlePath = "intro";
        } else if (title === "이벤트") {
          titlePath = "event";
        }
    
        if (useOption === "인스타그램 스토리" || useOption === "카카오톡" || useOption === "") {
          useOptionPath = "4to7";
        } else if (useOption === "인스타그램 피드") {
          useOptionPath = "1to1";
        }
    
        const templateElement = document.getElementById(`template_${titlePath}_${useOptionPath}_${index}`);
    
        if (templateElement) {
          setIsCaptured(true); // ✅ 캡처 시작 (깜빡이는 커서 숨김)
    
          setTimeout(async () => {
            // ✅ html-to-image를 사용하여 PNG 이미지 변환
            const imageData = await toPng(templateElement, {
              cacheBust: true, // 캐시 방지 (이미지 변경 감지)
              quality: 1, // 이미지 품질 (0~1)
            });
    
            setConvertTempImg(imageData);
    
            // ✅ 카카오톡 공유는 `shareOnKakao`에서 처리
            if (useOption === "카카오톡") {
              console.log("카카오톡이 선택되었습니다.");
              shareOnKakao(imageData);
              setIsCaptured(false); // ✅ 캡처 완료 (커서 다시 표시)
              return; // 카카오톡 처리 후 다른 로직 실행 방지
            }
    
            // ✅ 상태 업데이트 후 업로드 준비 완료
            setIsReadyToUpload(true);
            setIsCaptured(false); // ✅ 캡처 완료 (커서 다시 표시)
          }, 300); // ✅ 300ms 딜레이 추가 (상태 반영 후 캡처 실행)
        }
      };


    // ✅ `uploadData`를 `useCallback`으로 감싸서 의존성 배열 문제 해결
    const uploadData = useCallback(async () => {
        if (!isReadyToUpload || !convertTempImg) return;

        console.log("업로드 시작...");

        setUploading(true);

        const updatedUseOption = useOption === "" ? "인스타그램 스토리" : useOption;
        const formData = new FormData();
        formData.append("use_option", updatedUseOption);
        formData.append("content", content);
        formData.append("store_name", data.store_name);
        formData.append("tag", data.detail_category_name);
        formData.append("insta_copyright", instaCopytight);

        if (convertTempImg) {
            const extension = getBase64Extension(convertTempImg);
            const blob = base64ToBlob(convertTempImg, `image/${extension}`);
            formData.append("upload_images", blob, `image.${extension}`);
        }

        for (const [key, value] of formData.entries()) {
            console.log(`Key: ${key}, Value:`, value);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (useOption === "" || useOption === "인스타그램 피드" || useOption === "인스타그램 스토리") {
                const [instaName, instaFollowers, instaCount] = response.data;
                navigate("/ads/detail/insta", {
                    state: {
                        instaName,
                        instaFollowers,
                        instaCount,
                        convertTempImg,
                        updatedUseOption,
                        storeBusinessNumber,
                    },
                });
            }
        } catch (err) {
            console.error("업로드 중 오류 발생:", err);
        } finally {
            setUploading(false);
            setIsReadyToUpload(false); // 업로드 완료 후 초기화
        }
    }, [
        convertTempImg,
        isReadyToUpload,
        content,
        instaCopytight,
        data,
        navigate,
        storeBusinessNumber,
        useOption,
    ]);

    // ✅ `uploadData` 실행 `useEffect` (data가 `null`이 아닐 때만 실행)

    useEffect(() => {
        if (!isReadyToUpload || !convertTempImg || !data) return;
        uploadData();
    }, [isReadyToUpload, convertTempImg, data, uploadData]);





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
    const shareOnKakao = async (imageData) => {
        if (!imageData) {
            console.error("업로드할 이미지가 없습니다.");
            return;
        }

        console.log("카카오톡 공유 시작...");

        // ✅ 카카오 SDK가 정상적으로 로드되었는지 확인 후 초기화
        const kakaoJsKey = process.env.REACT_APP_KAKAO_JS_API_KEY;
        if (!kakaoJsKey) {
            console.error("Kakao JavaScript Key가 설정되지 않았습니다.");
            return;
        }

        if (!window.Kakao) {
            console.log("카카오 SDK 로드 중...");
            const script = document.createElement("script");
            script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
            script.async = true;
            script.onload = () => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoJsKey);
                }
                shareOnKakao(imageData); // ✅ 스크립트 로드 후 공유 실행
            };
            document.body.appendChild(script);
            return;
        }

        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(kakaoJsKey);
        }

        try {
            // ✅ 이미지 변환 후 Blob 형태로 변환
            const base64ToBlob = (base64Data) => {
                const byteString = atob(base64Data.split(",")[1]);
                const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([byteArray], { type: mimeString });
            };

            const blob = base64ToBlob(imageData);
            const file = new File([blob], "uploaded_image.png", { type: "image/png" });

            // ✅ 카카오 이미지 업로드
            const response = await window.Kakao.Share.uploadImage({ file: [file] });

            if (!response || !response.infos || !response.infos.original || !response.infos.original.url) {
                console.error("카카오 이미지 업로드 실패:", response);
                return;
            }

            const uploadedImageUrl = response.infos.original.url;

            // ✅ 공유할 광고 정보 URL 생성
            const adsInfoUrl = `?title=${encodeURIComponent(title || "기본 제목")}
                &content=${encodeURIComponent(content || "기본 내용")}
                &storeName=${encodeURIComponent(data?.store_name || "기본 매장명")}
                &roadName=${encodeURIComponent(data?.road_name || "기본 매장 주소")}
                &imageUrl=${encodeURIComponent(uploadedImageUrl || "기본 내용")}`;

            // ✅ 카카오톡 공유 실행
            window.Kakao.Share.sendCustom({
                templateId: 115008, // 생성한 템플릿 ID
                templateArgs: {
                    title: title || "기본 제목",
                    imageUrl: uploadedImageUrl,
                    storeName: data?.store_name || "기본 매장명",
                    content: content || "기본 내용",
                    adsInfo: adsInfoUrl,
                    store_business_id: storeBusinessNumber,
                },
            });

        } catch (error) {
            console.error("카카오톡 공유 중 오류 발생:", error);
        }
    };



    // const convertTempToImg = async (index) => {
    //     console.log(index);
    //     const templateElement = document.getElementById(`template_intro_4to7_1`);
    
    //     if (templateElement) {
    //         try {
    //             // html-to-image를 사용하여 PNG 이미지로 변환
    //             const imageData = await toPng(templateElement, {
    //                 cacheBust: true, // 캐시 방지 (이미지 변경 감지)
    //                 quality: 1,      // 이미지 품질 (0~1)
    //             });
    
    //             // 변환된 이미지 데이터 저장
    //             setConvertTempImg(imageData);
    //         } catch (error) {
    //             console.error("이미지 변환 실패:", error);
    //         }
    //     }
    // };

    if (!isOpen) return null;

    return (
        <div className="inset-0 flex z-50 bg-opacity-50 h-full">
            <div className="bg-white p-6 pb-24 rounded-lg shadow-lg w-full overflow-auto" onClick={closeMenu}>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col w-full">
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
                        </div>
                        {/* 텍스트 영역 */}
                        <h5 className="text-base font-bold">
                            간편한 고객 맞춤형 자동 AI 광고 만들기 ver2
                        </h5>
                        <h5 className="text-base font-medium">
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
                    <div className="w-full justify-center flex-col flex">
                        <div>
                            {/* 주제 선택 영역 */}
                            <div className="pt-6 pb-6">
                                <p className="text-[16px] text-black font-bold leading-normal tracking-[-0.154px] font-pretendard pb-2">
                                    어떤 홍보를 원하세요?
                                </p>

                                <div className="flex w-full bg-gray-100 rounded-lg pt-1 pb-1">
                                    {[
                                        { label: "매장홍보", value: "매장 소개" },
                                        { label: "이벤트", value: "이벤트" },
                                        { label: "상품소개", value: "상품소개" },
                                        { label: "감사인사", value: "인사" },
                                        { label: "명함", value: "명함" },
                                    ].map((option, index, array) => (
                                        <div key={option.value} className="flex items-center flex-1">
                                            <button
                                                className={`flex-1 py-2 rounded-lg font-[Pretendard] font-semibold text-center text-sm transition ${title === option.value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                                                    }`}
                                                onClick={() => setTitle(option.value)}
                                            >
                                                {option.label}
                                            </button>
                                            {/* 마지막 요소가 아닐 때만 | 구분자 추가 */}
                                            {index < array.length - 1 && <span className="text-gray-500">|</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 광고 채널 추천 받기 */}
                            <div className="flex-col justify-center">
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
                                            <p
                                                className="text-[#FF1664] font-pretendard cursor-pointer text-[16px] font-bold leading-normal tracking-[-0.154px] ml-2"
                                                onClick={generateAdsChan}
                                            >
                                                지금 나에게 가장 효과가 좋은 광고는?
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

                            {/* 디자인 스타일 선택 영역 */}
                            <div className="pt-6">
                                {/* 제목 & 아이콘 */}
                                <div className="flex items-center gap-2 pb-4">
                                    <p className="text-base text-black font-bold">디자인 스타일을 선택해주세요.</p>
                                </div>

                                {/* 디자인 스타일 선택 버튼 */}
                                <div
                                    ref={scrollRef}
                                    className="w-full overflow-x-auto whitespace-nowrap no-scrollbar flex gap-2 pb-4 rounded-lg"
                                >
                                    {[
                                        { label: "3D감성", value: "3D감성" },
                                        { label: "포토실사", value: "포토실사" },
                                        { label: "캐릭터·만화", value: "캐릭터만화" },
                                        { label: "레트로", value: "레트로" },
                                        { label: "AI모델", value: "AI모델" },
                                        { label: "예술", value: "예술" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            className={`flex-shrink-0 px-4 py-1 rounded-full border transition ${designStyle === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-500 border-gray-300"
                                                }`}
                                            onClick={() => setDesignStyle(option.value)}
                                        >
                                            {option.icon ? (
                                                <span className="flex items-center gap-1 text-sm">
                                                    {option.label} {option.icon}
                                                </span>
                                            ) : (
                                                option.label
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* 이미지 선택 영역 */}
                                <div className="grid grid-cols-3 gap-2 pb-2">
                                    {filteredImages.length > 0 ? (
                                        filteredImages.map((img, index) => (
                                            <div
                                                key={img.src}
                                                className={`relative border-4 w-[114px] h-[120px] rounded-lg transition ${exampleImage === img.src ? "border-[#FF029A]" : "border-transparent"}`}
                                                onClick={() => handleTemplateClick(img)}
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={`이미지 ${index + 1}`}
                                                    className="w-[114px] h-[114px] object-cover cursor-pointer"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p key="no-images" className="col-span-3 text-gray-500 text-center">
                                            해당하는 이미지가 없습니다.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 주제 세부 정보 선택 영역 */}
                            <div className="w-full pt-6">
                                <fieldset className="border border-gray-300 rounded  w-full px-3">
                                    <legend className="text-[14px] font-bold text-[#1D1B20] px-2 font-pretendard">세부정보입력</legend>
                                    <input
                                        type="text"
                                        value={detailContent}
                                        onChange={(e) => setDetailContent(e.target.value)}
                                        className="rounded w-full px-3 py-2 text-sm"
                                        placeholder="추가하실 세부정보 내용이 있다면 입력해주세요."
                                    />
                                </fieldset>
                                <p className="flex items-center justify-between mb-2 pl-4 text-gray-400 text-sm">
                                    예 : 오늘 방문하신 고객들에게 테이블당 소주 1병 서비스!!
                                </p>
                            </div>

                            {/* gpt 역할 영역 */}
                            <AdsAIInstructionByTitle
                                useOption={useOption} title={title} setGptRole={setGptRole}
                            />

                            {/* 광고 채널 선택 영역 */}
                            <div className="">
                                <fieldset className="border border-gray-300 rounded w-full px-3 py-2">
                                    <legend className="text-[14px] font-bold text-[#1D1B20] px-2 font-pretendard">광고채널</legend>
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
                            </div>
                        </div>


                        {/* 생성 버튼 영역 */}
                        <div className="w-full justify-center items-center flex-col flex pb-4">
                            <div className="mb-4 pt-6 w-1/3 justify-center items-center">
                                <div className="flex justify-center items-center bg-[#2196F3] rounded-full px-4 py-2 w-auto shadow-md relative">
                                    {/* 드롭 메뉴 열기 버튼 */}
                                    <button
                                        id="selectMenu"
                                        onClick={() => setIsMenuOpen((prev) => !prev)}
                                        className="flex justify-center items-center w-16 h-12"
                                    >
                                        <img
                                            src={require("../../../assets/icon/camera_icon.png")}
                                            alt="파일 선택"
                                            className="w-11 h-11"
                                        />
                                    </button>
                                    <div className="h-11 w-[1px] bg-white mx-2"></div>
                                    {/* 드롭 메뉴들 */}
                                    {isMenuOpen && (
                                        <div
                                            className="absolute bottom-16 h-auto text-black bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-10 mb-2"
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
                                                    className="cursor-pointer p-2 hover:bg-[#2196F3] flex justify-between items-center"
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
                                        className="flex justify-center items-center w-16 h-12 text-white rounded transition-all duration-300"
                                        onClick={generateAds}
                                        disabled={contentLoading}
                                    >
                                        {contentLoading ? (
                                            <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <img
                                                src={
                                                    imageTemplateList && imageTemplateList.length > 0
                                                        ? require("../../../assets/icon/retry_icon.png")
                                                        : require("../../../assets/icon/ai_gen_icon.png")
                                                }
                                                alt="AI 광고 생성 아이콘 !!!!!!!"
                                                className="w-6 h-6"
                                            />
                                        )}
                                    </button>
                                </div>
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
                                        className="absolute top-2 right-3 text-white hover:opacity-80 transition-opacity hidden"
                                        title="내용 복사"
                                    >
                                        {copied ? (
                                            <ClipboardCheck size={20} strokeWidth={2.5} className="text-green-400" />
                                        ) : (
                                            <Clipboard size={20} strokeWidth={2.5} />
                                        )}
                                    </button>
                                </CopyToClipboard>

                                {/* ✅ 줄바꿈된 content 표시 */}
                                {content ? (
                                    <p className="text-xl whitespace-pre-line">
                                        {content.replace(/(제목:|내용:)/g, "\n$1").trim()}
                                    </p>
                                ) : (
                                    <span>&nbsp;</span>
                                )}
                            </div>
                        )}



                        {/* 이미지 영역 */}
                        <AdsSwiper
                            imageTemplateList={imageTemplateList}
                            content={withoutSign}
                            title={title}
                            useOption={useOption}
                            checkImages={checkImages}
                            handleImageClick={handleImageClick}
                            storeName={data.store_name}
                            roadName={data.road_name}
                            weather={data.main}
                            tag={data.detail_category_name}
                            weekday={weekday}
                            isCaptured={isCaptured}
                        />

                        {/* <div className="flex justify-center">
                            <button onClick={() => convertTempToImg(1)} className='p-4 bg-slate-600'>변환하기</button>
                        </div>
                        {!!convertTempImg && (
                            <div className="flex justify-center items-center relative pt-4 pb-4">
                                <img src={convertTempImg} alt='변환된 템플릿 이미지'></img>
                            </div>
                        )} */}

                        {/* 생성 된 문구 영역 */}
                        <div className='pb-4'>
                            {instaCopytight && instaCopytight.length > 0 && (
                                <>
                                    <p>인스타그램 게시물 내용</p>
                                    <textarea
                                        value={instaCopytight}
                                        onChange={(e) => setInstaCopyright(e.target.value)}
                                        className="w-full p-4 rounded-[16px] text-black bg-transparent border border-gray-300 resize-none"
                                        style={{
                                            fontSize: "14px",
                                            minHeight: "200px",
                                        }}
                                    />
                                </>
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
                                    `${useOption !== "" ? useOption : "인스타그램 스토리"}에 업로드하기`
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsModalTemVer2;
