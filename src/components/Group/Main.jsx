import { useState, useEffect, useRef } from "react";
import { Card } from "./Card/Card";
import { FocusCard } from "./Card/FocusCard";
import { Nav } from "./Nav/Nav";

export const Group = ({ focus }) => {
  // 狀態管理
  const [windowWidthTrue, setWindowWidthTrue] = useState(true); // 視窗寬度狀態，用於判斷是否為桌面版
  const [selectedFilter, setSelectedFilter] = useState("全部"); // 目前選中的過濾類別
  const [buttonVisibility, setButtonVisibility] = useState({}); // 控制各類別卡片區域左右滾動按鈕的可見性
  const [focusCard, setFocusCard] = useState(null); // 儲存目前聚焦的卡片資料
  const [fade, setFade] = useState(false); // 控制聚焦卡片的淡入淡出效果

  // 使用 ref 存儲每個類別的卡片區域滾動元素
  const scrollRefs = useRef({});

  // 更新特定類別卡片區域的按鈕可見性
  const updateButtonVisibility = (category) => {
    if (scrollRefs.current[category]) {
      const cardScroll = scrollRefs.current[category];
      const scrollLeft = cardScroll.scrollLeft; // 目前滾動位置
      const scrollWidth = cardScroll.scrollWidth; // 元素總寬度
      const clientWidth = cardScroll.clientWidth; // 可視區域寬度

      const minScrollThreshold = 315; // 最小滾動閾值

      setButtonVisibility((prev) => ({
        ...prev,
        [category]: {
          showLeftButton: scrollLeft > minScrollThreshold, // 當滾動距離超過 316 才顯示左側按鈕
          showRightButton:
            scrollWidth - clientWidth - scrollLeft > minScrollThreshold, // 當剩餘可滾動距離大於 316 才顯示右側按鈕
        },
      }));
    }
  };

  // 執行卡片區域的滾動
  const scroll = (category, direction) => {
    if (scrollRefs.current[category]) {
      const cardScroll = scrollRefs.current[category];
      const cardWidth = cardScroll.querySelector(".cardItem")?.offsetWidth + 16; // 卡片寬度加上間距
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth; // 根據方向決定滾動量

      // 執行滾動
      cardScroll.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // 平滑滾動
      });
      // 滾動後更新按鈕可見性
      setTimeout(() => updateButtonVisibility(category), 300);
    }
  };

  // 處理卡片點擊事件
  const handleCardClick = (cardData) => {
    setFocusCard(cardData); // 設置聚焦卡片資料
    focus(true); // 通知父元件進入聚焦狀態
    setFade(false); // 進入 focus 狀態時，初始為不透明（透明度 0）
  };

  // 當聚焦卡片改變時添加淡入效果
  useEffect(() => {
    if (focusCard) {
      // 延遲幾毫秒後觸發過渡效果
      const timer = setTimeout(() => {
        setFade(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [focusCard]);

  // 處理取消聚焦事件
  const handleCancelFocus = () => {
    setFade(false); // 先關閉淡入效果
    // 延遲關閉聚焦卡片，等待動畫完成
    setTimeout(() => {
      setFocusCard(null);
      focus(false); // 通知父元件退出聚焦狀態
    }, 500);
  };

  // 初始化並維護按鈕可見性
  useEffect(() => {
    const initializeButtonVisibility = () => {
      Object.keys(scrollRefs.current).forEach((category) => {
        updateButtonVisibility(category);
      });
    };

    // 當畫面載入或篩選變更時執行
    setTimeout(initializeButtonVisibility, 100);

    // 監聽視窗大小變更
    window.addEventListener("resize", initializeButtonVisibility);
    return () =>
      window.removeEventListener("resize", initializeButtonVisibility);
  }, [selectedFilter]);

  // 偵測視窗寬度變化並設置對應的顯示模式
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        //手機
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        //平板直立
        setWindowWidthTrue(true);
      } else if (window.innerWidth < 1584) {
        //平板
        setWindowWidthTrue(true);
      } else {
        //電腦
        setWindowWidthTrue(true);
      }
    };
    handleResize(); // 初始執行一次
    // 監聽視窗大小變更
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // 獲取所有不重複的卡片類別
  const filteredCategories = [...new Set(cards.map((card) => card.category))];
  // 根據選中的過濾類別篩選卡片
  const filteredCards =
    selectedFilter === "全部"
      ? cards // 顯示所有卡片
      : cards.filter((card) => card.category === selectedFilter); // 只顯示指定類別的卡片

  // 根據視窗寬度呈現不同的版面
  return windowWidthTrue ? (
    <>
      {focusCard ? (
        // 聚焦模式下的渲染
        <>
          {/* 背景內容（半透明顯示） */}
          <div
            className="mt-[2rem] opacity-[50%] fixed inset-0"
            style={{
              zIndex: -1,
              pointerEvents: "none", // 禁用點擊
            }}
          >
            <Nav onFilterChange={setSelectedFilter} />
            {selectedFilter != "全部" ? (
              // 特定類別篩選下的網格排列
              <div className="flex justify-center">
                <div
                  className={
                    window.innerWidth < 1024
                      ? "grid grid-cols-2 gap-4 mt-[2.5rem] px-[1rem]" // 平板直立時 2 欄
                      : window.innerWidth < 1536
                        ? "grid grid-cols-3 gap-4  px-[1rem]" // 平板時 3 欄
                        : "grid grid-cols-4 gap-4  px-[1rem]" // 電腦時 4 欄
                  }
                >
                  {filteredCards.map((card, index) => (
                    <Card
                      TitleFontSize={setWindowWidthTrue ? "20px" : "1rem"}
                      secondTitleFontSize={setWindowWidthTrue ? "16px" : "14px"}
                      ContentFontSize={setWindowWidthTrue ? "15px" : "0px"}
                      key={index}
                      img={card.img}
                      title={card.title}
                      content={card.content}
                      secondTitle={card.secondTitle}
                      detailedContent={card.detailedContent}
                      member={card.member}
                      teachers={card.teachers}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // 全部類別顯示，依類別分組並水平滾動展示
              <div>
                {filteredCategories.map((item, index) => (
                  <div className="relative" key={index}>
                    {/* 左側滾動按鈕 */}
                    {buttonVisibility[item]?.showLeftButton && (
                      <div
                        className={`absolute arrowPositionLeft -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer hover:bg-[#D84050] transition-all duration-1000 ease-in-out`}
                        style={{ top: "calc(50% + 30px)", left: "220px" }}
                        onClick={() => scroll(item, "left")}
                      >
                        <img
                          style={{
                            width: "24px",
                            height: "24px",
                            transform: "rotate(180deg)", // 左箭頭
                          }}
                          src="/arrow_forward_ios.svg"
                          alt=""
                        />
                      </div>
                    )}

                    {/* 類別標題 */}
                    <div
                      className={
                        window.innerWidth < 1024
                          ? "flex mt-[2.5rem] px-[20px]" // 平板直立
                          : window.innerWidth < 1536
                            ? "flex  px-[128px]" // 平板
                            : "flex  px-[256px]" // 電腦
                      }
                    >
                      <div
                        className="text-[28px] text-white  pe-[0.5rem] pb-[0.1rem]"
                        style={{ fontFamily: "B" }}
                        onClick={() => setSelectedFilter(item)}
                      >
                        {item}
                      </div>
                      <img src="/arrow_forward_ios.svg" alt="" />
                    </div>

                    {/* 卡片水平捲動容器 */}
                    <div
                      ref={(el) => (scrollRefs.current[item] = el)}
                      onScroll={() => updateButtonVisibility(item)}
                      className="cardScroll"
                    >
                      {filteredCards
                        .filter((card) => card.category === item)
                        .map((card, index) => (
                          <div key={index} className="cardItem">
                            <Card
                              TitleFontSize="20px"
                              secondTitleFontSize="1rem"
                              ContentFontSize="15px"
                              img={card.img}
                              title={card.title}
                              content={card.content}
                              secondTitle={card.secondTitle}
                              selectedFilter={selectedFilter}
                              detailedContent={card.detailedContent}
                              member={card.member}
                              teachers={card.teachers}
                              onClick={handleCardClick}
                            />
                          </div>
                        ))}
                    </div>

                    {/* 右側滾動按鈕 */}
                    {buttonVisibility[item]?.showRightButton && (
                      <div
                        className="absolute  arrowPositionRight -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer hover:bg-[#D84050] transition-all duration-1000 ease-in-out"
                        style={{ top: "calc(50% + 30px)", right: "220px" }}
                        onClick={() => scroll(item, "right")}
                      >
                        <img
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                          src="/arrow_forward_ios.svg"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 聚焦卡片顯示 */}
          <div
            className={`absolute top-[100px] left-0 right-0 px-[40px] z-[1000] transform transition-all duration-500 ease-in-out ${fade ? "translate-y-0" : "translate-y-[100%]"
              }`}
          >
            <FocusCard
              {...focusCard}
              TitleFontSize="48px"
              secondTitleFontSize="16px"
              ContentFontSize="14px"
              onClick={handleCancelFocus}
            ></FocusCard>
          </div>
        </>
      ) : (
        // 非聚焦模式下的渲染
        <div className="mt-[5rem]">
          <Nav onFilterChange={setSelectedFilter} />
          {selectedFilter != "全部" ? (
            // 特定類別篩選下的網格排列
            <div className="flex justify-center">
              <div
                className={
                  window.innerWidth < 1024
                    ? "grid grid-cols-2 gap-4 mt-[2.5rem] px-[1rem]" // 平板直立時 2 欄
                    : window.innerWidth < 1536
                      ? "grid grid-cols-3 gap-4  px-[1rem]" // 平板時 3 欄
                      : "grid grid-cols-4 gap-4  px-[1rem]" // 電腦時 4 欄
                }
              >
                {filteredCards.map((card, index) => (
                  <Card
                    TitleFontSize={setWindowWidthTrue ? "20px" : "1rem"}
                    secondTitleFontSize={setWindowWidthTrue ? "16px" : "14px"}
                    ContentFontSize={setWindowWidthTrue ? "15px" : "0px"}
                    key={index}
                    img={card.img}
                    title={card.title}
                    content={card.content}
                    secondTitle={card.secondTitle}
                    detailedContent={card.detailedContent}
                    member={card.member}
                    teachers={card.teachers}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            // 全部類別顯示，依類別分組並水平滾動展示
            <div>
              {filteredCategories.map((item, index) => (
                <div className="relative" key={index}>
                  {/* 左側滾動按鈕 */}
                  {buttonVisibility[item]?.showLeftButton && (
                    <div
                      className={`absolute arrowPositionLeft -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer hover:bg-[#D84050] transition-all duration-1000 ease-in-out`}
                      style={{ top: "calc(50% + 30px)", left: "220px" }}
                      onClick={() => scroll(item, "left")}
                    >
                      <img
                        style={{
                          width: "24px",
                          height: "24px",
                          transform: "rotate(180deg)", // 左箭頭
                        }}
                        src="/arrow_forward_ios.svg"
                        alt=""
                      />
                    </div>
                  )}

                  {/* 類別標題 */}
                  <div
                    className={
                      window.innerWidth < 1024
                        ? "flex mt-[2.5rem] px-[20px]" // 平板直立
                        : window.innerWidth < 1536
                          ? "flex  px-[128px]" // 平板
                          : "flex  px-[256px]" // 電腦
                    }
                  >
                    <div
                      className="text-[28px] text-white  pe-[8px] leading-none"
                      style={{ fontFamily: "B" }}
                      onClick={() => setSelectedFilter(item)}
                    >
                      {item}
                    </div>
                    <img src="/arrow_forward_ios.svg" alt="" />
                  </div>

                  {/* 卡片水平捲動容器 */}
                  <div
                    ref={(el) => (scrollRefs.current[item] = el)}
                    onScroll={() => updateButtonVisibility(item)}
                    className="cardScroll"
                  >
                    {filteredCards
                      .filter((card) => card.category === item)
                      .map((card, index) => (
                        <div key={index} className="cardItem">
                          <Card
                            TitleFontSize="20px"
                            secondTitleFontSize="1rem"
                            ContentFontSize="15px"
                            img={card.img}
                            title={card.title}
                            content={card.content}
                            secondTitle={card.secondTitle}
                            selectedFilter={selectedFilter}
                            detailedContent={card.detailedContent}
                            member={card.member}
                            teachers={card.teachers}
                            onClick={handleCardClick}
                          />
                        </div>
                      ))}
                  </div>

                  {/* 右側滾動按鈕 */}
                  {buttonVisibility[item]?.showRightButton && (
                    <div
                      className="absolute  arrowPositionRight -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer hover:bg-[#D84050] transition-all duration-1000 ease-in-out"
                      style={{ top: "calc(50% + 30px)", right: "220px" }}
                      onClick={() => scroll(item, "right")}
                    >
                      <img
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                        src="/arrow_forward_ios.svg"
                        alt=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  ) : (
    // 手機版排版
    <>
      {focusCard ? (
        // 聚焦模式下的渲染（手機版）
        <>
          {/* 背景內容（半透明顯示） */}
          <div
            className="mt-[3rem] opacity-[50%] fixed inset-0"
            style={{
              zIndex: -1,
              pointerEvents: "none", // 禁用點擊
            }}
          >
            <Nav onFilterChange={setSelectedFilter} />
            {selectedFilter != "全部" ? (
              // 特定類別篩選下的網格排列（手機版）
              <>
                <div className="grid grid-cols-2 gap-4 mt-[2.5rem] px-[20px]">
                  {filteredCards.map((card, index) => (
                    <Card
                      TitleFontSize="1rem"
                      secondTitleFontSize="14px"
                      ContentFontSize="0px"
                      key={index}
                      img={card.img}
                      title={card.title}
                      content={card.content}
                      secondTitle={card.secondTitle}
                      detailedContent={card.detailedContent}
                      member={card.member}
                      teachers={card.teachers}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              // 全部類別顯示，依類別分組並水平滾動展示（手機版）
              <>
                {filteredCategories.map((item, index) => (
                  <div key={index}>
                    {/* 類別標題 */}
                    <div className="flex mt-[2.5rem]  px-[20px]">
                      <div
                        className="text-[28px] text-white pe-[8px] leading-none"
                        style={{ fontFamily: "B" }}
                        onClick={() => setSelectedFilter(item)}
                      >
                        {item}
                      </div>
                      <img src="/arrow_forward_ios.svg" alt="" />
                    </div>
                    {/* 卡片水平捲動容器 */}
                    <div className="cardScroll">
                      {filteredCards
                        .filter((card) => card.category === item)
                        .map((card, index) => (
                          <Card
                            TitleFontSize="20px"
                            secondTitleFontSize="1rem"
                            ContentFontSize="15px"
                            key={index}
                            img={card.img}
                            title={card.title}
                            content={card.content}
                            secondTitle={card.secondTitle}
                            selectedFilter={selectedFilter}
                            detailedContent={card.detailedContent}
                            member={card.member}
                            teachers={card.teachers}
                            onClick={handleCardClick}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* 聚焦卡片顯示（手機版） */}
          <div
            className={`absolute top-[50px] left-0 right-0 px-[20px] z-[1000] transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
              }`}
          >
            <FocusCard
              {...focusCard}
              TitleFontSize="2rem"
              secondTitleFontSize="24px"
              ContentFontSize="20px"
              onClick={handleCancelFocus}
            ></FocusCard>
          </div>
        </>
      ) : (
        // 非聚焦模式下的渲染（手機版）
        <div className="mt-[5rem]">
          <Nav onFilterChange={setSelectedFilter} />
          {selectedFilter != "全部" ? (
            // 特定類別篩選下的網格排列（手機版）
            <>
              <div className="grid grid-cols-2 gap-4 mt-[2.5rem] px-[20px]">
                {filteredCards.map((card, index) => (
                  <Card
                    TitleFontSize="1rem"
                    secondTitleFontSize="14px"
                    ContentFontSize="0px"
                    key={index}
                    img={card.img}
                    title={card.title}
                    content={card.content}
                    secondTitle={card.secondTitle}
                    detailedContent={card.detailedContent}
                    member={card.member}
                    teachers={card.teachers}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </>
          ) : (
            // 全部類別顯示，依類別分組並水平滾動展示（手機版）
            <>
              {filteredCategories.map((item, index) => (
                <div key={index}>
                  {/* 類別標題 */}
                  <div className="flex px-[20px]">
                    <div
                      className="text-[28px] text-white pe-[8px] leading-none"
                      style={{ fontFamily: "B" }}
                      onClick={() => setSelectedFilter(item)}
                    >
                      {item}
                    </div>
                    <img src="/arrow_forward_ios.svg" alt="" />
                  </div>
                  {/* 卡片水平捲動容器 */}
                  <div className="cardScroll">
                    {filteredCards
                      .filter((card) => card.category === item)
                      .map((card, index) => (
                        <Card
                          TitleFontSize="20px"
                          secondTitleFontSize="1rem"
                          ContentFontSize="15px"
                          key={index}
                          img={card.img}
                          title={card.title}
                          content={card.content}
                          secondTitle={card.secondTitle}
                          selectedFilter={selectedFilter}
                          detailedContent={card.detailedContent}
                          member={card.member}
                          teachers={card.teachers}
                          onClick={handleCardClick}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};