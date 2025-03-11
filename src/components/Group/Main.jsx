import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Card } from "./Card/Card";
import { FocusCard } from "./Card/FocusCard";
import { Nav } from "./Nav/Nav";
import { CSSTransition, SwitchTransition } from "react-transition-group";

// 添加 CSS 過渡樣式
const transitionStyles = `
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }
  
  /* FocusCard 過渡效果 */
  .focus-card-container {
    position: fixed;
    inset: 0;
    z-index: 1000;
    transform: scale(0.95);
    opacity: 0;
    transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
  }
  
  .focus-card-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  
  .focus-card-overlay.visible {
    opacity: 1;
  }
  
  .focus-card-container.visible {
    transform: scale(1);
    opacity: 1;
  }
`;

// 滾動按鈕組件
const ScrollArrow = ({ direction, isVisible, onClick }) => {
  return (
    <div
      className={`absolute ${
        direction === "left"
          ? "left-0 -translate-x-1/2"
          : "right-0 translate-x-1/2"
      } 
        hidden lg:flex top-[50%] group-arrow w-14 h-14
        items-center justify-center z-10 cursor-pointer
        transition-all duration-300 ease-in-out group/arrow
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-[#6C2028] hover:bg-[#D84050] hover:scale-150 rounded-full transition-all duration-500 ease-in-out"></div>
      <img
        className={`relative z-20 pointer-events-none w-6 h-6 opacity-80 group-hover/arrow:opacity-100 transition-opacity duration-300 ${
          direction === "left"
            ? "transform rotate-180 -translate-x-[1px]"
            : "translate-x-[1px]"
        }`}
        src="/arrow_forward_ios.svg"
        alt={`向${direction === "left" ? "左" : "右"}滾動`}
      />
    </div>
  );
};

export const Group = () => {
  // 用於追蹤各類別的滾動容器參考
  const scrollContainerRefs = useRef({});
  // 用於追蹤各類別的滾動按鈕可見性狀態
  const [buttonVisibility, setButtonVisibility] = useState({});
  // 用於追蹤當前選擇的過濾類別
  const [selectedFilter, setSelectedFilter] = useState("全部");
  // 用於追蹤當前焦點卡片的資料
  const [focusedCard, setFocusedCard] = useState(null);
  // 用於 CSS Transition 的節點引用
  const nodeRef = useRef(null);
  // 後端回傳的卡片資料
  const [cards, setCards] = useState([]);
  const mapGenreToCategory = (genre) => {
    const genreMap = {
      0: "互動",
      1: "遊戲",
      2: "電影",
      3: "動畫",
      4: "行銷",
    };
    return genreMap[genre] || "其他";
  };
  const parseJsonArray = (jsonString) => {
    try {
      const obj = JSON.parse(jsonString);
      return Object.values(obj);
    } catch (error) {
      console.error("解析 member 失敗", error);
      return [];
    }
  };
  const mediaArray = (jsonString) => {
    try {
      const obj = JSON.parse(jsonString);
      return Object.entries(obj).filter(([key, value]) => value !== "");
    } catch (error) {
      console.error("解析 media 失敗", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        // const token =typeof window !== "undefined" ? localStorage.getItem("token") : null;
        //

        const response = await axios.post(
          `${apiBaseUrl}/fe/group/search`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const transformedCards = await Promise.all(
          response.data._data.map(async (card) => {
            let photoImageURL = "";

            if (card.logo_id) {
              try {
                const photoImgResponse = await axios.get(
                  `${apiBaseUrl}/fe/file/download/${card.logo_id}`,
                  {
                    headers: {
                      "Content-Type": "application/octet-stream",
                    },
                    responseType: "blob",
                  }
                );

                photoImageURL = URL.createObjectURL(photoImgResponse.data);
              } catch (imgError) {
                console.error(`無法下載圖片 (image_id)`, imgError);
              }
            }

            return {
              category: mapGenreToCategory(card.genre),
              img: photoImageURL,
              title: card.work_name,
              content: card.short_description,
              secondTitle: card.name,
              detailedContent: card.description,
              member: parseJsonArray(card.member),
              teachers: parseJsonArray(card.tutor),
              media: mediaArray(card.media),
            };
          })
        );

        setCards(transformedCards);
      } catch (error) {
        console.error("獲取卡片資料失敗", error);
      }
    };

    fetchCards();
  }, []);

  // 用於追蹤 FocusCard 的可見性狀態
  const [isFocusCardVisible, setIsFocusCardVisible] = useState(false);

  // 根據選擇的過濾類別過濾卡片
  const filteredCards =
    selectedFilter === "全部"
      ? cards
      : cards.filter((card) => card.category === selectedFilter);

  // 獲取需要顯示的類別（用於分類顯示模式）
  const filteredCategories =
    selectedFilter === "全部"
      ? [...new Set(cards.map((item) => item.category))]
      : [selectedFilter];

  // 更新特定類別的左右滾動按鈕可見性
  const updateButtonVisibility = useCallback((category) => {
    // 獲取該類別的滾動容器元素
    const container = scrollContainerRefs.current[category];
    if (!container) return;

    // 檢查是否可以向左滾動（scrollLeft > 0）
    const canScrollLeft = container.scrollLeft > 0;
    // 檢查是否可以向右滾動（總寬度 - 已滾動寬度 - 可見寬度 > 1）
    const canScrollRight =
      container.scrollWidth - container.scrollLeft - container.clientWidth > 1;

    // 使用函數式更新，確保使用最新的狀態
    setButtonVisibility((prev) => {
      // 檢查是否與之前的狀態相同，如果相同則不更新
      const prevState = prev[category] || {};
      if (
        prevState.showLeftButton === canScrollLeft &&
        prevState.showRightButton === canScrollRight
      ) {
        return prev;
      }

      // 只有在狀態真正變更時才返回新狀態
      return {
        ...prev,
        [category]: {
          showLeftButton: canScrollLeft,
          showRightButton: canScrollRight,
        },
      };
    });
  }, []);

  // 處理滾動功能，根據指定的方向滾動特定類別的內容
  const scroll = useCallback(
    (category, direction) => {
      // 獲取該類別的滾動容器元素
      const container = scrollContainerRefs.current[category];
      if (!container) return;

      // 計算滾動距離（容器寬度的一半）
      const scrollAmount = container.clientWidth / 2;
      // 根據方向設定滾動目標位置
      const scrollTarget =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      // 使用平滑滾動效果移動到目標位置
      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });

      // 滾動後更新按鈕可見性
      setTimeout(() => updateButtonVisibility(category), 300);
    },
    [updateButtonVisibility]
  );

  // 處理卡片點擊事件，設置焦點並顯示詳細資訊
  const handleCardClick = useCallback((cardData) => {
    // 設置焦點卡片資料
    setFocusedCard(cardData);
    // 鎖定背景滾動
    document.body.style.overflow = "hidden";
    // 延遲設置可見性，確保 DOM 已更新
    setTimeout(() => {
      setIsFocusCardVisible(true);
    }, 50);
  }, []);

  // 處理取消焦點事件，返回到主畫面
  const handleCancelFocus = useCallback(() => {
    // 先隱藏 FocusCard
    setIsFocusCardVisible(false);
    // 解除背景滾動鎖定
    document.body.style.overflow = "";
    // 等待過渡效果完成後清除焦點卡片資料
    setTimeout(() => {
      setFocusedCard(null);
    }, 300);
  }, []);

  // 處理過濾器變更事件
  const handleFilterChange = useCallback((category) => {
    // 更新選擇的過濾類別
    setSelectedFilter(category);
  }, []);

  // 初始化所有類別的按鈕可見性
  const initializeButtonVisibility = useCallback(() => {
    // 獲取所有唯一的類別
    const categories = [...new Set(cards.map((item) => item.category))];
    // 為每個類別更新按鈕可見性
    categories.forEach((category) => {
      if (scrollContainerRefs.current[category]) {
        updateButtonVisibility(category);
      }
    });
  }, [cards, updateButtonVisibility]);

  // 處理視窗大小變更事件
  const handleResize = useCallback(() => {
    // 重新初始化按鈕可見性
    initializeButtonVisibility();
  }, [initializeButtonVisibility]);

  // 元件掛載和依賴項變更時的效果
  useEffect(() => {
    // 初始化按鈕可見性
    // 使用 setTimeout 確保 DOM 已經渲染完成
    const timer = setTimeout(() => {
      initializeButtonVisibility();
    }, 0);

    // 添加視窗大小變更事件監聽器
    window.addEventListener("resize", handleResize);

    // 元件卸載時清理事件監聽器和計時器
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [handleResize, initializeButtonVisibility]);

  // 渲染類別內容
  const renderCategoryContent = () => {
    if (selectedFilter !== "全部") {
      // 特定類別顯示，網格佈局
      return (
        <div className="flex justify-center group-padding">
          <div className="w-full mx-auto">
            <div className="card-category">
              {filteredCards.map((card, index) => (
                <Card
                  key={index}
                  img={card.img}
                  title={card.title}
                  content={card.content}
                  secondTitle={card.secondTitle}
                  detailedContent={card.detailedContent}
                  member={card.member}
                  teachers={card.teachers}
                  media={card.media}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // 全部類別顯示，依類別分組並水平滾動展示
      return (
        <>
          {filteredCategories.map((item, index) => (
            <div key={index} className="relative">
              {/* 類別標題 */}
              <div className="flex mt-10 group-padding">
                <div
                  className="text-2xl lg:text-3xl text-white pe-2 leading-none cursor-pointer"
                  style={{ fontFamily: "B" }}
                  onClick={() => handleFilterChange(item)}
                >
                  {item}
                </div>
                <img src="/arrow_forward_ios.svg" alt="" />
              </div>

              {/* 可橫向滾動的卡片容器 */}
              <div
                className="flex relative mt-4 gap-[14px] overflow-x-auto snap-x scrollbar-hide group-scroll-padding"
                ref={(el) => {
                  // 設置滾動容器參考
                  scrollContainerRefs.current[item] = el;
                  // 初始化時檢查按鈕可見性
                  if (el) updateButtonVisibility(item);
                }}
                // 監聽滾動事件以更新按鈕可見性
                onScroll={() => updateButtonVisibility(item)}
              >
                {/* 渲染該類別的卡片 */}
                {filteredCards
                  .filter((card) => card.category === item)
                  .map((card, index) => (
                    <Card
                      key={index}
                      img={card.img}
                      title={card.title}
                      content={card.content}
                      secondTitle={card.secondTitle}
                      selectedFilter={selectedFilter}
                      detailedContent={card.detailedContent}
                      member={card.member}
                      teachers={card.teachers}
                      media={card.media}
                      onClick={() => handleCardClick(card)}
                    />
                  ))}
              </div>

              {/* 左右滾動按鈕 */}
              <ScrollArrow
                direction="left"
                isVisible={buttonVisibility[item]?.showLeftButton}
                onClick={() => scroll(item, "left")}
              />
              <ScrollArrow
                direction="right"
                isVisible={buttonVisibility[item]?.showRightButton}
                onClick={() => scroll(item, "right")}
              />
            </div>
          ))}
        </>
      );
    }
  };

  // 渲染正常視圖，顯示所有類別和卡片
  const renderNormalView = () => (
    <div className="normal-view mb-[10rem]">
      {/* 類別過濾器 */}
      <Nav filter={selectedFilter} onFilterChange={handleFilterChange} />

      {/* 類別內容區塊 - 使用 SwitchTransition 和 CSSTransition 實現淡入淡出效果 */}
      <div className="category-content">
        <style>{transitionStyles}</style>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={selectedFilter}
            nodeRef={nodeRef}
            timeout={200}
            classNames="fade"
            unmountOnExit
          >
            <div ref={nodeRef}>{renderCategoryContent()}</div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );

  // 修改渲染焦點卡片視圖，使用自定義的過渡效果
  const renderFocusCardView = () => (
    <>
      <div
        className={`focus-card-overlay ${isFocusCardVisible ? "visible" : ""}`}
      ></div>
      <div
        className={`focus-card-container flex items-center justify-center overflow-y-auto ${
          isFocusCardVisible ? "visible" : ""
        }`}
      >
        {focusedCard && (
          <FocusCard
            img={focusedCard.img}
            title={focusedCard.title}
            secondTitle={focusedCard.secondTitle}
            detailedContent={focusedCard.detailedContent}
            member={focusedCard.member}
            teachers={focusedCard.teachers}
            media={focusedCard.media}
            onCancel={handleCancelFocus}
          />
        )}
      </div>
    </>
  );

  // 根據焦點狀態渲染不同視圖
  return (
    <>
      <style>{transitionStyles}</style>
      <div className={focusedCard ? "pointer-events-none" : ""}>
        {renderNormalView()}
      </div>
      {focusedCard && renderFocusCardView()}
    </>
  );
};
