import { useState, useEffect, useRef, useCallback } from "react";
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
`;

// 滾動按鈕組件
const ScrollArrow = ({ direction, isVisible, onClick }) => {
  return (
    <div
      className={`absolute ${direction === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} 
        hidden lg:flex top-[50%] group-arrow w-14 h-14
        items-center justify-center z-10 cursor-pointer
        transition-all duration-300 ease-in-out group/arrow
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-[#6C2028] hover:bg-[#D84050] hover:scale-150 rounded-full transition-all duration-500 ease-in-out"></div>
      <img
        className={`relative z-20 pointer-events-none w-6 h-6 opacity-80 group-hover/arrow:opacity-100 transition-opacity duration-300 ${direction === 'left' ? 'transform rotate-180 -translate-x-[1px]' : 'translate-x-[1px]'}`}
        src="/arrow_forward_ios.svg"
        alt={`向${direction === 'left' ? '左' : '右'}滾動`}
      />
    </div>
  );
};

// 模擬的 Card 資料
const cards = [
  {
    category: "互動",
    img: "/遊戲_web.png",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "行銷",
    img: "",
    title: "行銷策略大揭秘",
    content: "探討最新的數位行銷策略，如何吸引目標受眾，創造品牌影響力。",
    secondTitle: "Marketing Pro",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "/影視_web.png",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
  {
    category: "互動",
    img: "",
    title: "完了！！怎麼辦！！青春戀愛攻防戰",
    content:
      "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
    secondTitle: "Timeout Studio",
    detailedContent:
      "在這個寬廣的世界中，探查那些未知的奧秘和探險世界上最危險未知現象的探險家們被稱為「StormSeeker」。 玩家將扮演其中一員，在探索過程中不得已進入一處廢棄神廟躲避災難，好奇心驅使下深入探索，發現神廟深處有一具扇子造型的寶物，靠近時不小心誤觸封印機關，跌入最深層，跌入後雖身處險境，但神器依舊被自己成功帶走，而這神器具有神力可讓使用者獲得操控風的能力，廢棄神廟充滿了機關與敵人，主角將一路解開機關，擊敗敵人逃出生天。",
    member: ["陳嘉鴻", "張鈞", "張銘", "張銘", "張銘"],
    teachers: ["張銘", "張銘", "張銘"],
  },
];

export const Group = ({ focus }) => {
  // 用於追蹤各類別的滾動容器參考
  const scrollContainerRefs = useRef({});
  // 用於追蹤各類別的滾動按鈕可見性狀態
  const [buttonVisibility, setButtonVisibility] = useState({});
  // 用於追蹤當前選擇的過濾類別
  const [selectedFilter, setSelectedFilter] = useState("全部");
  // 用於追蹤當前焦點卡片的資料
  const [focusedCard, setFocusedCard] = useState(null);
  // 使用外部定義的卡片資料
  const data = cards;
  
  // 用於 CSS Transition 的節點引用
  const nodeRef = useRef(null);

  // 根據選擇的過濾類別過濾卡片
  const filteredCards = selectedFilter === "全部"
    ? data
    : data.filter(item => item.category === selectedFilter);

  // 獲取所有唯一的類別
  const categories = [...new Set(data.map(item => item.category))];

  // 獲取需要顯示的類別（用於分類顯示模式）
  const filteredCategories = selectedFilter === "全部"
    ? [...new Set(data.map(item => item.category))]
    : [selectedFilter];

  // 更新特定類別的左右滾動按鈕可見性
  const updateButtonVisibility = useCallback((category) => {
    // 獲取該類別的滾動容器元素
    const container = scrollContainerRefs.current[category];
    if (!container) return;

    // 檢查是否可以向左滾動（scrollLeft > 0）
    const canScrollLeft = container.scrollLeft > 0;
    // 檢查是否可以向右滾動（總寬度 - 已滾動寬度 - 可見寬度 > 1）
    const canScrollRight = container.scrollWidth - container.scrollLeft - container.clientWidth > 1;

    // 使用函數式更新，確保使用最新的狀態
    setButtonVisibility(prev => {
      // 檢查是否與之前的狀態相同，如果相同則不更新
      const prevState = prev[category] || {};
      if (prevState.showLeftButton === canScrollLeft && prevState.showRightButton === canScrollRight) {
        return prev;
      }

      // 只有在狀態真正變更時才返回新狀態
      return {
        ...prev,
        [category]: {
          showLeftButton: canScrollLeft,
          showRightButton: canScrollRight
        }
      };
    });
  }, []);

  // 處理滾動功能，根據指定的方向滾動特定類別的內容
  const scroll = useCallback((category, direction) => {
    // 獲取該類別的滾動容器元素
    const container = scrollContainerRefs.current[category];
    if (!container) return;

    // 計算滾動距離（容器寬度的一半）
    const scrollAmount = container.clientWidth / 2;
    // 根據方向設定滾動目標位置
    const scrollTarget = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

    // 使用平滑滾動效果移動到目標位置
    container.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    });

    // 滾動後更新按鈕可見性
    setTimeout(() => updateButtonVisibility(category), 300);
  }, [updateButtonVisibility]);

  // 處理卡片點擊事件，設置焦點並顯示詳細資訊
  const handleCardClick = useCallback((cardData) => {
    // 設置焦點卡片資料
    setFocusedCard(cardData);
  }, []);

  // 處理取消焦點事件，返回到主畫面
  const handleCancelFocus = useCallback(() => {
    // 清除焦點卡片資料
    setFocusedCard(null);
  }, []);

  // 處理過濾器變更事件
  const handleFilterChange = useCallback((category) => {
    // 更新選擇的過濾類別
    setSelectedFilter(category);
  }, []);

  // 初始化所有類別的按鈕可見性
  const initializeButtonVisibility = useCallback(() => {
    // 獲取所有唯一的類別
    const categories = [...new Set(data.map(item => item.category))];
    // 為每個類別更新按鈕可見性
    categories.forEach(category => {
      if (scrollContainerRefs.current[category]) {
        updateButtonVisibility(category);
      }
    });
  }, [data, updateButtonVisibility]);

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
    window.addEventListener('resize', handleResize);

    // 元件卸載時清理事件監聽器和計時器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [handleResize, initializeButtonVisibility]);

  // 渲染類別內容
  const renderCategoryContent = () => {
    if (selectedFilter !== "全部") {
      // 特定類別顯示，網格佈局
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
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
                onClick={() => handleCardClick(card)}
              />
            ))}
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
                  onClick={() => setSelectedFilter(item)}
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
      <Nav onFilterChange={handleFilterChange} />

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
            <div ref={nodeRef}>
              {renderCategoryContent()}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );

  // 渲染焦點卡片視圖，顯示卡片詳細資訊
  const renderFocusCardView = () => (
    <>
      {/* 保持正常視圖在背景中 */}
      <div className="normal-view mb-[10rem] pointer-events-none opacity-50">
        {/* 類別過濾器 */}
        <Nav onFilterChange={handleFilterChange} />

        {/* 類別內容區塊 */}
        <div className="category-content">
          <style>{transitionStyles}</style>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={selectedFilter}
              nodeRef={nodeRef}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <div ref={nodeRef}>
                {renderCategoryContent()}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>

      {/* 焦點卡片作為對話框顯示在頂層 */}
      {focusedCard && (
        <FocusCard
          img={focusedCard.img}
          title={focusedCard.title}
          secondTitle={focusedCard.secondTitle}
          detailedContent={focusedCard.detailedContent}
          member={focusedCard.member}
          teachers={focusedCard.teachers}
          onCancel={handleCancelFocus}
        />
      )}
    </>
  );

  // 根據焦點狀態渲染不同視圖
  return focusedCard ? renderFocusCardView() : renderNormalView();
};