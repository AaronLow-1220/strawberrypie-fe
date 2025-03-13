import { useState, useEffect, useCallback, memo } from "react";

// 圖片骨架屏組件 - 用於圖片加載過程中顯示的佔位元素
const ImageSkeleton = () => (
  <div className="w-full aspect-[4/3] bg-[#361014] animate-pulse rounded-lg flex justify-center items-center"></div>
);

// 抽離社交媒體圖標組件 - 用於顯示各種社交媒體連結按鈕
const SocialMediaIcon = memo(({ src, alt, url }) => (
  <div
    className="bg-[#6C2028] w-[40px] lg:w-[48px] lg:h-[48px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color"
    onClick={() => window.open(url, "_blank")} // 點擊時在新標籤頁打開連結
  >
    <img
      className="w-[20px] lg:w-[24px] lg:h-[24px] h-[20px]"
      src={src}
      alt={alt}
    />
  </div>
));

SocialMediaIcon.displayName = "SocialMediaIcon"; // 設置組件的 displayName，便於開發工具中識別

export default SocialMediaIcon;

// 專案詳情卡片組件 - 使用 memo 優化渲染性能
export const FocusCard = memo(
  ({
    img, // 專案圖片
    title, // 專案標題
    secondTitle, // 專案副標題
    detailedContent, // 專案詳細內容
    member, // 專案成員
    teachers, // 指導老師
    media, // 社交媒體連結
    onCancel, // 關閉卡片的回調函數
  }) => {
    // 狀態管理
    const [isWideScreen, setIsWideScreen] = useState(false); // 是否為寬屏幕
    const [mediaArray, setMediaArray] = useState([]); // 處理後的社交媒體數據
    const [imgLoaded, setImgLoaded] = useState(false); // 圖片是否加載完成
    const [imgError, setImgError] = useState(false); // 圖片是否加載出錯

    // 社交媒體圖標映射
    const mediaIcon = {
      web: "/Group/globe21.svg", // 網站圖標
      ig: "/Group/instagram 1.svg", // Instagram 圖標
      threads: "/Group/Threads.svg", // Threads 圖標
      other_link: "/Group/link-45deg 1.svg", // 其他連結圖標
    };

    // 處理社交媒體數據
    useEffect(() => {
      const mediaArray = media.map((item, index) => ({
        src: mediaIcon[item[0]], // 根據類型獲取對應圖標
        type: item[0], // 媒體類型
        url: item[1], // 媒體連結
      }));
      setMediaArray(mediaArray);
    }, []);

    // 監聽視窗大小變化，決定使用哪種佈局
    useEffect(() => {
      const handleResize = () => {
        setIsWideScreen(window.innerWidth >= 1024); // 1024px 以上視為寬屏
      };

      handleResize(); // 初始化
      window.addEventListener("resize", handleResize); // 添加事件監聽
      return () => window.removeEventListener("resize", handleResize); // 清理事件監聽
    }, []);

    // 當圖片來源變化時，重設圖片加載狀態
    useEffect(() => {
      setImgLoaded(false);
      setImgError(false);
    }, [img]);

    // 處理關閉按鈕點擊事件
    const handleClose = useCallback(() => {
      onCancel?.(); // 調用關閉回調函數
    }, [onCancel]);

    // 處理容器點擊事件 - 點擊背景時關閉卡片
    const handleContainerClick = useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onCancel?.();
        }
      },
      [onCancel]
    );

    // 處理圖片加載完成事件
    const handleImageLoad = useCallback(() => {
      setImgLoaded(true);
    }, []);

    // 處理圖片加載錯誤事件
    const handleImageError = useCallback(() => {
      setImgError(true);
    }, []);

    // 根據標題長度動態調整字體大小
    const getTitleFontSize = (title) => {
      if (!title) return "text-[48px]";
      const length = title.length;
      if (length > 10) return "text-[36px]"; // 標題較長時使用較小字體
      return "text-[48px]"; // 標題較短時使用較大字體
    };

    // 渲染圖片區域 - 處理不同狀態下的圖片顯示
    const renderImage = () => {
      // 無圖片或圖片加載錯誤時顯示提示
      if (!img || imgError) {
        return (
          <div className="w-full aspect-[4/3] bg-[#361014] flex justify-center items-center">
            <p className="text-white text-lg">無圖片</p>
          </div>
        );
      }

      // 圖片加載中顯示骨架屏
      if (!imgLoaded) {
        return (
          <>
            <ImageSkeleton />
            <img
              className="hidden" // 隱藏實際圖片，僅用於加載
              src={img}
              alt={title || "卡片圖片"}
              onLoad={handleImageLoad} // 圖片加載完成時觸發
              onError={handleImageError} // 圖片加載錯誤時觸發
            />
          </>
        );
      }

      // 圖片加載完成後顯示
      return (
        <img
          className="aspect-[4/3] bg-white w-full object-cover rounded-[8px]"
          src={img}
          alt={title || "卡片圖片"}
        />
      );
    };

    // 寬屏佈局 - 左右分欄顯示
    const WideScreenLayout = (
      <div
        className="w-full h-full flex justify-center px-16"
        onClick={handleContainerClick} // 點擊背景關閉
      >
        <div className="my-auto">
          <div className="focus-card my-8 max-w-[1200px] bg-[#361014] p-[64px] rounded-[48px] flex gap-[48px] relative">
            {/* 左側區域 - 圖片和成員信息 */}
            <div className="w-full">
              {renderImage()} {/* 渲染圖片 */}
              <div className="px-3 mt-5">
                {/* 成員信息 */}
                <div className="text-[20px] text-white opacity-[80%] mt-5">
                  成員：
                </div>
                <div className="flex flex-wrap">
                  {member?.map((item, index) => (
                    <div key={index} className="text-[20px] text-white">
                      {item}
                      {index !== member.length - 1 && "、"} {/* 非最後一個成員後添加頓號 */}
                    </div>
                  ))}
                </div>
                {/* 指導老師信息 */}
                <div className="text-[20px] text-white opacity-[80%] mt-4">
                  指導老師：
                </div>
                <div className="flex flex-wrap">
                  {teachers?.map((item, index) => (
                    <div key={index} className="text-[20px] text-white">
                      {item}
                      {index !== teachers.length - 1 && "、"} {/* 非最後一個老師後添加頓號 */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 右側區域 - 標題和詳細內容 */}
            <div className="w-full">
              {/* 專案標題 */}
              <div
                className={`text-[#FFFFFF] font-bold leading-[1.2em] ${getTitleFontSize(
                  title
                )}`}
                style={{ fontFamily: "B" }} // 使用特定字體
              >
                {title}
              </div>
              {/* 專案副標題 */}
              <div className="text-secondary-color mt-1 text-[24px]">
                {secondTitle}
              </div>
              {/* 社交媒體連結 */}
              <div className="flex flex-wrap gap-[12px] mt-[12px]">
                {mediaArray?.map((item, index) => (
                  <SocialMediaIcon
                    key={index}
                    src={item.src}
                    alt={item.alt}
                    url={item.url}
                  />
                ))}
              </div>
              {/* 專案詳細內容 */}
              <div className="text-white mt-[24px] overflow-auto flex-1 opacity-[80%] text-[20px]">
                {detailedContent}
              </div>
            </div>
            {/* 關閉按鈕 */}
            <button
              className="absolute top-8 right-8 cursor-pointer"
              onClick={handleClose}
              aria-label="關閉"
            >
              <img src="/Group/close.svg" alt="關閉按鈕" />
            </button>
          </div>
        </div>
      </div>
    );

    // 窄屏佈局 - 上下分欄顯示
    const NarrowScreenLayout = (
      <div
        className="w-full h-full flex justify-center px-16"
        onClick={handleContainerClick} // 點擊背景關閉
      >
        <div className="my-auto">
          <div
            className="max-w-[480px] w-[calc(100vw-50px)] rounded-3xl overflow-hidden my-8 bg-[#361014] rounded-[12px] mx-auto"
            onClick={handleContainerClick}
          >
            <div className="relative flex flex-col justify-center align-top">
              {/* 上方圖片區域 */}
              <div className="w-full aspect-[4/3] relative rounded-t-[12px]">
                {/* 關閉按鈕 */}
                <button
                  className="flex items-center justify-center absolute top-[12px] right-[12px] w-9 h-9 cursor-pointer bg-[rgba(0,0,0,0.2)] rounded-full z-10"
                  onClick={handleClose}
                  aria-label="關閉"
                >
                  <img
                    className="w-6 h-6"
                    src="/Group/close.svg"
                    alt="關閉按鈕"
                  />
                </button>
                {/* 圖片顯示邏輯 */}
                {!imgLoaded && !imgError && img ? (
                  <>
                    <ImageSkeleton /> {/* 加載中顯示骨架屏 */}
                    <img
                      className="hidden" // 隱藏實際圖片，僅用於加載
                      src={img}
                      alt={title || "卡片圖片"}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </>
                ) : imgError || !img ? (
                  <div className="w-full h-full bg-[#361014] flex justify-center items-center">
                    <p className="text-white text-lg">無圖片</p>
                  </div>
                ) : (
                  <img
                    className="w-full h-full object-cover bg-white"
                    src={img}
                    alt={title || "卡片圖片"}
                  />
                )}
              </div>
              {/* 下方內容區域 */}
              <div className="bg-[#361014] p-[20px_24px_32px_24px] flex flex-col flex-grow">
                {/* 專案標題 */}
                <div
                  className="text-[#FFFFFF] leading-[1.2em] font-bold text-[32px]"
                  style={{ fontFamily: "B" }}
                >
                  {title}
                </div>
                {/* 專案副標題 */}
                <div className="text-secondary-color mt-1 text-[16px]">
                  {secondTitle}
                </div>
                {/* 社交媒體連結 */}
                <div className="flex flex-wrap gap-[10px] mt-[12px]">
                  {mediaArray?.map((item, index) => (
                    <SocialMediaIcon
                      key={index}
                      src={item.src}
                      alt={item.alt}
                      url={item.url}
                    />
                  ))}
                </div>
                {/* 專案詳細內容 */}
                <div className="text-white mt-[24px] overflow-auto flex-1 opacity-[80%] text-[14px]">
                  {detailedContent}
                </div>
                {/* 成員信息 */}
                <div className="text-[14px] text-white opacity-[80%] mt-5">
                  成員：
                </div>
                <div className="flex flex-wrap">
                  {member?.map((item, index) => (
                    <div
                      key={index}
                      className="text-[14px] mt-[2px] text-white"
                    >
                      {item}
                      {index !== member.length - 1 && "、"} {/* 非最後一個成員後添加頓號 */}
                    </div>
                  ))}
                </div>
                {/* 指導老師信息 */}
                <div className="text-[14px] text-white opacity-[80%] mt-3">
                  指導老師：
                </div>
                <div className="flex flex-wrap">
                  {teachers?.map((item, index) => (
                    <div
                      key={index}
                      className="text-[14px] mt-[2px] text-white"
                    >
                      {item}
                      {index !== teachers.length - 1 && "、"} {/* 非最後一個老師後添加頓號 */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // 根據屏幕寬度返回對應佈局
    return isWideScreen ? WideScreenLayout : NarrowScreenLayout;
  }
);

// 設置組件的 displayName，便於開發工具中識別
FocusCard.displayName = "FocusCard";
