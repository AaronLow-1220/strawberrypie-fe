import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "./HeaderContext";

// NavBackground 元件：根據 menuOpen 狀態改變 SVG 路徑動畫
const NavBackground = ({ menuOpen }) => {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // 定義展開與關閉的 SVG 路徑
    const openPath =
      "M416 429.5C416 429.5 381.771 466.366 333.102 466.366C284.433 466.366 261.119 529 205.813 529C150.508 529 161.958 472 102.057 494C42.1567 516 -14 396.5 -14 396.5L-14 -9.99998L416 -9.99994L416 429.5Z";
    const closedPath =
      "M416 409.264C416 409.264 375.756 391.753 327.086 391.753C278.417 391.753 263.338 429.772 208.033 429.772C152.727 429.772 128.161 452.785 63.8621 429.772C-0.436921 406.76 -14 414.768 -14 414.768L-14 -10L416 -9.99996L416 409.264Z";

    // 當 menuOpen 為 true 時，執行展開動畫，否則回復關閉狀態
    gsap.to(path, {
      duration: 1,
      ease: "inOut",
      attr: { d: menuOpen ? openPath : closedPath },
    });
  }, [menuOpen]);

  return (
    <svg
      className="nav-bg"
      width="100%"
      height="450"
      viewBox="0 0 400 450" // 保持原始比例
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: "visible",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <g style={{ overflow: "visible" }}>
        <g>
          <path
            ref={pathRef}
            d="M416 409.264C416 409.264 375.756 391.753 327.086 391.753C278.417 391.753 263.338 429.772 208.033 429.772C152.727 429.772 128.161 452.785 63.8621 429.772C-0.436921 406.76 -14 414.768 -14 414.768L-14 -10L416 -9.99996L416 409.264Z"
            fill="#F748C1"
          />
        </g>
      </g>
    </svg>
  );
};



// Header 元件：根據裝置寬度與選單狀態顯示不同版型
export const Header = () => {
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0); // 滾動透明度狀態
  const is2XLScreen = windowWidth >= 1536; // 判斷是否為 2xl 及以上螢幕尺寸
  const { isHeaderOpen, setIsHeaderOpen } = useContext(HeaderContext);


  useEffect(() => {
    setIsHome(location.pathname === "/");
  })

  // 每次路由變化時重新判斷是否為首頁
  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location.pathname]);

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 監聽滾動事件，控制 Header 透明度 - 只在首頁有效
  useEffect(() => {
    const handleScroll = () => {
      // 如果不是首頁，則始終保持完全不透明
      if (!isHome) {
        setScrollOpacity(1);
        return;
      }

      // 如果是 2xl 及以上螢幕尺寸，則不需要透明度效果
      if (is2XLScreen) {
        setScrollOpacity(1); // 始終保持完全不透明
        return;
      }

      // 計算透明度：從 0 到 100px 的滾動範圍內，透明度從 0 變為 1
      const scrollY = window.scrollY;
      const maxScroll = 100; // 滾動 100px 後達到完全不透明
      const opacity = Math.min(scrollY / maxScroll, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    // 初始化時執行一次，確保正確的初始狀態
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [is2XLScreen, isHome]); // 當螢幕尺寸類別或頁面變化時重新設置

  useEffect(() => {
    if (menuOpen) {
      setIsHeaderOpen(true);
    } else {
      setIsHeaderOpen(false);
    }
  }, [menuOpen]);

  return (
    <>
      {windowWidth < 768 ? (
        // 行動版 Header
        <div
          className="fixed top-0 left-0 right-0 z-[100]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(27, 8, 10, 0.5) 0%, rgba(27, 8, 10, 0) 100%)",
          }}
        >
          <div className="w-full h-[4rem] flex justify-between items-center px-[1rem]">
            <img
              src="/Header/menu.svg"
              alt="Menu"
              style={{
                width: "28px",
                height: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {!isHome && (
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img
                  src="/Header/Headline.svg"
                  alt="Headline"
                  style={{
                    width: "7.5rem",
                    height: "auto",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                />
              </Link>
            )}
            <img
              src="/Header/collect.svg"
              alt="Collect"
              style={{
                width: "28px",
                height: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          </div>
          <div
              className={`fixed inset-0 bg-black h-screen -z-10 transition-opacity duration-500 ease-in-out ${menuOpen ? "opacity-60" : "opacity-0 pointer-events-none"}`}
              onClick={() => setMenuOpen(false)}
            ></div>
          <div
            className={`z-[-10] absolute top-0 right-0 w-full h-[480px] transition-all duration-700 ease-in-out origin-top-right ${menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3/4 opacity-0 pointer-events-none"
              }`}
          >
            <div className="pointer-events-none">
              <NavBackground menuOpen={menuOpen} />
            </div>
            {/* 背景覆蓋層：60% 透明黑色，點擊時收合選單 */}

            <ul
              className={`relative z-10 flex flex-col items-center justify-center gap-9 h-full text-white transition-all duration-700 ease-in-out
                ${menuOpen ? "" : "-translate-y-20"}`}
              style={{ fontFamily: "B" }}
            >
              <li className="text-[2rem]">
                <Link
                  to="/group"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>組別介紹</div>
                  <div className="ms-[1rem]">
                    <img src="/Header/category.svg" alt="Category" />
                  </div>
                </Link>
              </li>
              <li className="text-[2rem]">
                <Link
                  to="/collect"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>集章兌換</div>
                  <div className="ms-[1rem]">
                    <img src="/Header/feedback.svg" alt="Feedback" />
                  </div>
                </Link>
              </li>
              <li className="text-[2rem]">
                <Link
                  to="/psychometric-test"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>心理測驗</div>
                  <div className="">
                    <img src="/Header/psychology.svg" alt="Psychology" />
                  </div>
                </Link>
              </li>
              <li className="text-[2rem]">
                <Link
                  to="/feedback"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>意見回饋</div>
                  <div className="ms-[1rem]">
                    <img src="/Header/stamp.svg" alt="Stamp" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // 桌機版 Header - 根據螢幕尺寸和頁面決定是否套用透明度效果
        <div
          className="fixed top-0 left-0 right-0 z-[999] transition-opacity duration-300"
          style={{
            opacity: scrollOpacity,
            background: "linear-gradient(to bottom, rgba(27, 8, 10, 0.5) 0%, rgba(27, 8, 10, 0) 100%)"
          }}
        >
          <div className="w-full flex justify-center mt-[48px] px-[1rem] navContainer">
            <Link
              to="/group"
              className="navHover text-[1.5rem] px-[27px] leading-none text-white"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                fontFamily: "B",
              }}
            >
              組別介紹
            </Link>
            <Link
              to="/collect"
              className="navHover text-[1.5rem] px-[27px] leading-none text-white"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                fontFamily: "B",
              }}
            >
              集章兌換
            </Link>
            <Link to="/">
              <img
                src="/Header/Headline.svg"
                alt="Headline"
                className={` drop-shadow-lg object-cover overflow-visible h-[60px] backface-hidden mt-[-27.25px] 2xl:mt-[-30px] w-0 mx-0 opacity-0 ${!isHome && "!w-[150px] !mx-[16px] !opacity-100"} transition-all duration-500 ease-in-out`}
              />
            </Link>
            <Link
              to="/psychometric-test"
              className="navHover text-[1.5rem] px-[27px] leading-none text-white"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                fontFamily: "B",
              }}
            >
              心理測驗
            </Link>
            <Link
              to="/feedback"
              className="navHover text-[1.5rem] px-[27px] leading-none text-white"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                fontFamily: "B",
              }}
            >
              意見回饋
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;