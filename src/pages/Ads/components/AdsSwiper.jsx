import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// title, useOption 값에 따라 폴더명을 변환하는 매핑 객체
const titleMap = {
  "매장 소개": "intro",
  "이벤트": "event",
};

const useOptionMap = {
  "인스타그램 스토리": "4to7",
  "카카오톡": "4to7",
  "문자메시지":"4to7",
  "": "4to7",
  "인스타그램 피드": "1to1",
};

const AdsSwiper = ({ imageTemplateList, content, title, useOption, checkImages, handleImageClick, storeName, roadName, weather, tag, weekday, isCaptured  }) => {
  const [templates, setTemplates] = useState([]);

  // title, useOption 값을 변환하여 템플릿 경로 결정
  const folderTitle = titleMap[title] || title;
  const folderUseOption = useOptionMap[useOption] || useOption;

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateModules = [];
        for (let i = 1; i <= 10; i++) {
          try {
            const module = await import(`../../../pages/Ads/template/${folderTitle}/${folderUseOption}/Template${i}.jsx`);
            templateModules.push({ id: i, Component: module.default });
          } catch (error) {
            if (error.message.includes("Cannot find module")) {
              continue; // 파일이 없으면 건너뜀
            } else {
              throw error; // 다른 오류는 그대로 발생
            }
          }
        }
        setTemplates(templateModules);
      } catch (error) {
        console.error("템플릿을 불러오는 중 오류 발생:", error);
      }
    };

    loadTemplates();
  }, [folderTitle, folderUseOption]); // ✅ `useEffect`의 의존성을 최소화하여 ESLint 경고 해결

  if (!imageTemplateList || imageTemplateList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center rounded-[16px] text-white pb-4">
        <p>이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center rounded-[16px] text-white pb-4">
      <Swiper spaceBetween={10} slidesPerView={1} loop={true} pagination={{ clickable: true, el: ".custom-pagination" }} modules={[Pagination]} className="w-full h-full relative">
        {/* 원본 이미지 */}
        <SwiperSlide key={0}>
          <div className="flex justify-center items-center relative pt-4 pb-4">
            <img src={imageTemplateList[0]} alt="원본" className="max-w-full object-cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer w-16 h-16" onClick={() => handleImageClick(0)}>
              <img src={checkImages.includes(0) ? require("../../../assets/icon/check_icon.png") : require("../../../assets/icon/non_check_icon.png")} alt={checkImages.includes(0) ? "Checked" : "Non-checked"} className="w-full h-full" />
            </div>
          </div>
        </SwiperSlide>

        {/* 동적 템플릿 */}
        {templates.map(({ id, Component }) => (
          <SwiperSlide key={id}>
            <div className="flex justify-center items-center relative pt-4 pb-4">
            <Component imageUrl={imageTemplateList[0]} text={content} storeName={storeName} roadName={roadName} weather={weather} tag={tag} weekday={weekday} isCaptured={isCaptured}/>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center cursor-pointer w-16 h-16" onClick={() => handleImageClick(id)}>
                <img src={checkImages.includes(id) ? require("../../../assets/icon/check_icon.png") : require("../../../assets/icon/non_check_icon.png")} alt={checkImages.includes(id) ? "Checked" : "Non-checked"} className="w-full h-full" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지네이션 */}
      <div className="custom-pagination mt-4 flex justify-center items-center"></div>
    </div>
  );
};

export default AdsSwiper;
