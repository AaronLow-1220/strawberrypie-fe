import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Card } from "./Card/Card";
import { FocusCard } from "./Card/FocusCard";
import { Nav } from "./Nav/Nav";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";

// 添加 CSS 過渡樣式
const transitionStyles = `
@media (max-width: 768px) {
  .mobile__header{
    background-color: none !important;
    padding-bottom: 0px !important;
  }
  .groups__nav{
    z-index: 100;
    background-color: linear-gradient(to bottom, rgba(27, 8, 10, 1) 0%, rgba(27, 8, 10, 0) 100%) ;
  }
}

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
  .focus-card-enter {
    opacity: 0;
    transform: scale(0.95);
  }
  .focus-card-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
  .focus-card-exit {
    opacity: 1;
    transform: scale(1);
  }
  .focus-card-exit-active {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
  
  /* 背景遮罩過渡效果 */
  .overlay-enter {
    opacity: 0;
  }
  .overlay-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in-out;
  }
  .overlay-exit {
    opacity: 1;
  }
  .overlay-exit-active {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  
  /* 模態框過渡效果 */
  .modal-enter {
    opacity: 0;
    transform: scale(0.95);
  }
  .modal-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
  .modal-exit {
    opacity: 1;
    transform: scale(1);
  }
  .modal-exit-active {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
`;

// 滾動按鈕組件
const ScrollArrow = ({ direction, isVisible, onClick }) => {
  return (
    <div
      className={`absolute ${direction === "left"
        ? "left-0 -translate-x-1/2"
        : "right-0 translate-x-1/2"
        } 
        hidden lg:flex top-[50%] group-arrow w-14 h-14
        items-center justify-center z-10 cursor-pointer
        transition-all duration-300 ease-in-out group/arrow
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClick}
    >
      <div className="absolute shadow-[0_8px_8px_rgba(0,0,0,0.2)] inset-0 bg-[#6C2028] hover:bg-[#D84050] hover:scale-150 rounded-full transition-all duration-500 ease-in-out"></div>
      <img
        className={`relative z-20 pointer-events-none w-6 h-6 opacity-80 group-hover/arrow:opacity-100 transition-opacity duration-300 ${direction === "left"
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
  const location = useLocation();
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
  // 用於 FocusCard 的 CSS Transition 節點引用
  const focusCardRef = useRef(null);
  // 用於背景遮罩的 CSS Transition 節點引用
  const overlayRef = useRef(null);
  // 後端回傳的卡片資料
  const [cards, setCards] = useState([]);
  // 追蹤已載入的圖片
  const [loadedImages, setLoadedImages] = useState({});
  // 用於追蹤 FocusCard 的可見性狀態
  const [isFocusCardVisible, setIsFocusCardVisible] = useState(false);
  // 用於防止 resize 事件頻繁觸發
  const resizeTimeoutRef = useRef(null);

  // 定義類別順序和映射，使用單一數據源
  const categoryConfig = [
    { id: 0, name: "互動" },
    { id: 4, name: "行銷" },
    { id: 3, name: "動畫" },
    { id: 1, name: "遊戲" },
    { id: 2, name: "影視" },
  ];

  // 將 genre ID 映射到類別名稱
  const mapGenreToCategory = (genre) => {
    // 確保 genre 是數字類型
    const genreId = Number(genre);
    // 使用數字比較找到對應的類別
    const category = categoryConfig.find(cat => cat.id === genreId);
    return category ? category.name : "其他";
  };

  // 獲取所有類別名稱，按照定義的順序
  const getAllCategories = useCallback(() => {
    return categoryConfig.map(cat => cat.name);
  }, []);

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

  // 按順序載入圖片
  const loadImagesInOrder = async (cardsData, apiBaseUrl) => {
    // 載入單個卡片的圖片
    const loadCardImage = async (card, index) => {
      if (!card.logo_id || loadedImages[card.id]) return;

      try {
        const imgResponse = await axios.get(
          `${apiBaseUrl}/fe/file/download/${card.logo_id}`,
          {
            headers: {
              "Content-Type": "application/octet-stream",
            },
            responseType: "blob",
          }
        );

        const imageURL = URL.createObjectURL(imgResponse.data);

        // 更新已載入的圖片
        setLoadedImages(prev => ({
          ...prev,
          [card.id]: imageURL
        }));

        // 更新卡片列表中的圖片
        setCards(prevCards => {
          const newCards = [...prevCards];
          if (newCards[index]) {
            newCards[index] = {
              ...newCards[index],
              img: imageURL,
              imageLoading: false,
            };
          }
          return newCards;
        });
      } catch (imgError) {
        console.error(`無法下載圖片 (logo_id: ${card.logo_id})`, imgError);

        // 標記圖片載入失敗
        setCards(prevCards => {
          const newCards = [...prevCards];
          if (newCards[index]) {
            newCards[index] = {
              ...newCards[index],
              imageLoading: false,
            };
          }
          return newCards;
        });
      }
    };

    // 開始載入所有卡片的圖片
    cardsData.forEach((card, index) => {
      loadCardImage(card, index);
    });
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dev-api.strawberrypie.tw';
        let responseData;
        
        // 檢查是否有預載的組別數據
        if (window.preloadedData && window.preloadedData.groupData) {
          console.log('使用預載的組別數據');
          responseData = window.preloadedData.groupData;
        } else {
          // 如果沒有預載數據，則進行 API 請求
          console.log('無預載數據，進行 API 請求');
          const response = await axios.post(
            `${apiBaseUrl}/fe/group/search`,
            {
              pageSize: 25
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          responseData = response.data;
        }

        console.log(responseData);

        // 先處理文字內容，不等待圖片
        const cardsData = responseData._data.map(card => ({
          id: card.id,
          logo_id: card.logo_id,
          category: mapGenreToCategory(card.genre),
          img: "", // 先設置為空，稍後再載入
          title: card.work_name,
          content: card.short_description,
          secondTitle: card.name,
          detailedContent: card.description,
          member: parseJsonArray(card.member),
          teachers: parseJsonArray(card.tutor),
          media: mediaArray(card.media),
          imageLoading: !!card.logo_id, // 如果有logo_id，標記為正在載入
        }));

        // 先設置卡片文字內容
        setCards(cardsData);

        // 開始異步載入圖片
        loadImagesInOrder(cardsData, apiBaseUrl);
      } catch (error) {
        console.error("獲取卡片資料失敗", error);
      }
    };

    fetchCards();
  }, []);

  // 處理 URL 參數，設置初始過濾器
  useEffect(() => {
    // 從 URL 中獲取 category 參數
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      // 檢查 categoryParam 是否是有效的類別
      const validCategories = getAllCategories();
      if (validCategories.includes(categoryParam)) {
        setSelectedFilter(categoryParam);
      }
    }
    
    // 確保頁面滾動到頂部
    window.scrollTo(0, 0);
  }, [location, getAllCategories]);

  // 根據選擇的過濾類別過濾卡片
  const filteredCards =
    selectedFilter === "全部"
      ? cards
      : cards.filter((card) => card.category === selectedFilter);

  // 獲取需要顯示的類別（用於分類顯示模式）
  const filteredCategories =
    selectedFilter === "全部"
      ? getAllCategories().filter(category => 
          cards.some(card => card.category === category)
        )
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
    // 設置可見性，CSSTransition 會處理過渡效果
    setIsFocusCardVisible(true);
  }, []);

  // 處理取消焦點事件，返回到主畫面
  const handleCancelFocus = useCallback(() => {
    // 先隱藏 FocusCard，CSSTransition 會處理過渡效果
    setIsFocusCardVisible(false);
    // 解除背景滾動鎖定
    document.body.style.overflow = "";
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

  // 處理視窗大小變更事件 - 使用防抖動技術減少觸發頻率
  const handleResize = useCallback(() => {
    // 清除之前的計時器
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // 設置新的計時器，延遲執行初始化按鈕可見性
    resizeTimeoutRef.current = setTimeout(() => {
      initializeButtonVisibility();
      resizeTimeoutRef.current = null;
    }, 200); // 200ms 的防抖動延遲
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
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
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
                  imageLoading={card.imageLoading}
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
          </div>
        </div>
      );
    } else {
      // 全部類別顯示，依類別分組並水平滾動展示
      return (
        <>
          {filteredCategories.map((item, index) => (
            <div key={index} className={`relative ${index}`}>
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
              <div>
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
                        imageLoading={card.imageLoading}
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

  // 使用 CSSTransition 渲染焦點卡片視圖
  const renderFocusCardView = () => (
    <>
      {/* 背景遮罩 */}
      <CSSTransition
        in={isFocusCardVisible}
        nodeRef={overlayRef}
        timeout={300}
        classNames="overlay"
        unmountOnExit
      >
        <div 
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-40 z-[999]"
        ></div>
      </CSSTransition>
      
      {/* 焦點卡片 */}
      <CSSTransition
        in={isFocusCardVisible}
        nodeRef={focusCardRef}
        timeout={300}
        classNames="modal"
        unmountOnExit
        onExited={() => setFocusedCard(null)} // 過渡結束後清除焦點卡片資料
      >
        <div 
          ref={focusCardRef}
          className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[1000]"
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
      </CSSTransition>
    </>
  );

  // 根據焦點狀態渲染不同視圖
  return (
    <>
      <style>{transitionStyles}</style>
      <div className={focusedCard ? "pointer-events-none" : ""}>
        {renderNormalView()}
      </div>
      {renderFocusCardView()}
    </>
  );
};
