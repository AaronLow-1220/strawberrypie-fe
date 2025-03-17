import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "./HeaderContext";
import { jwtDecode } from "jwt-decode";


const LinkLarge = ({ to, text }) => {
  return (
    <Link
      to={to}
      className="text-nowrap w-full max-w-[150px] text-center navHover text-[1.5rem] text-white pb-3"
      style={{
        textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
        fontFamily: "B",
      }}
    >
      {text}
    </Link>
  )
}

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
export const Header = ({ onOpenAccount }) => {
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0); // 滾動透明度狀態
  const is2XLScreen = windowWidth >= 1536; // 判斷是否為 2xl 及以上螢幕尺寸
  const { isHeaderOpen, setIsHeaderOpen } = useContext(HeaderContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/Auth/avatar.jpg');

  // 檢查登入狀態的函數
  const checkLoginStatus = useCallback(() => {
    const authToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!authToken);
  }, []);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  })

  // 解析 JWT token 的函數
  const parseJwt = useCallback((token) => {
    if (!token) {
      return {};
    }
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token 解析錯誤:', error);
      return {};
    }
  }, []);

  // 更新頭像的 useEffect
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          return;
        }
        
        // 解析 JWT token
        const tokenData = jwtDecode(accessToken);
        
        // 設置頭像 (如果 token 中有頭像 URL)
        if (tokenData && tokenData.avatar) {
          setAvatarUrl(tokenData.avatar);
        }
      } catch (error) {
        console.error('處理頭像時出錯:', error);
      }
    }
  }, [isLoggedIn]);

  // 每次路由變化時重新判斷是否為首頁
  useEffect(() => {
    setIsHome(location.pathname === "/");
    // 每次路由變化時也檢查登入狀態
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

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

  // 初始檢查登入狀態
  useEffect(() => {
    checkLoginStatus();

    // 創建一個自定義事件監聽器，用於在登入狀態變化時更新
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // 監聽 storage 事件，當 localStorage 變化時觸發
    window.addEventListener('storage', handleStorageChange);

    // 創建一個自定義事件，用於在登入狀態變化時通知 Header 組件
    window.addEventListener('login-status-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login-status-change', handleStorageChange);
    };
  }, [checkLoginStatus]);

  return (
    <>
      {windowWidth < 1024 ? (
        // 行動版 Header
        <div
          className="mobile__header z-20 fixed top-0 left-0 right-0 pb-2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(27, 8, 10, 0.8) 0%, rgba(27, 8, 10, 0) 100%)",
          }}
        >
          <div className="w-full h-[4rem] flex justify-between items-center px-[1rem]">
            <div
              className={`max-menu cursor-pointer flex flex-col justify-between items-center ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
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
            {isLoggedIn ? (

              <button onClick={() => {
                onOpenAccount();
                setMenuOpen(false);
              }}>
                <img
                  src={avatarUrl}
                  alt="Account"
                  className="w-9 h-9 drop-shadow-lg rounded-full hover:scale-125 transition-transform duration-300 ease-in-out"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    border: "2px solid white",
                  }}
                />
              </button>
            ) : (
              <Link to="/login">
                <img
                  src="/Header/person.svg"
                  alt="Collect"
                  style={{
                    width: "28px",
                    height: "auto",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                />
              </Link>
            )}
          </div>
          <div
            className={`fixed inset-0 bg-black h-screen -z-10 transition-opacity duration-500 ease-in-out ${menuOpen ? "opacity-60" : "opacity-0 pointer-events-none"}`}
            onClick={() => setMenuOpen(false)}
          ></div>
          <div
            className={`z-[-10] absolute top-0 right-0 w-full h-[520px] transition-all duration-700 ease-in-out origin-top-right ${menuOpen
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
                  to="/groups"
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
                  to="/stamps"
                  className="flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>集章兌換</div>
                  <div className="ms-[1rem]">
                    <img src="/Header/stamp.svg" alt="Stamps" />
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
                  <div className="ms-[1rem]">
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
                    <img src="/Header/feedback.svg" alt="Feedback" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // 桌機版 Header - 根據螢幕尺寸和頁面決定是否套用透明度效果
        <div
          className="w-full fixed top-0 flex mx-auto transition-opacity duration-300"
          style={{
            opacity: scrollOpacity,
            background: "linear-gradient(to bottom, rgba(27, 8, 10, 1) 0%, rgba(27, 8, 10, 0) 100%)"
          }}
        >
          <div className="w-full flex mx-auto justify-center mt-[48px] pb-5 navContainer">
            <LinkLarge to={"/groups"} text="組別介紹" />
            <LinkLarge to={"/stamps"} text="集章兌換" />
            <Link to="/" className={`${isHome ? "w-0 !opacity-0" : "w-[180px]"} navHover !transition-all !duration-500 ease-in-out`}>
              <img
                src="/Header/Headline.svg"
                alt="Headline"
                className={`text-nowrap drop-shadow-lg object-cover overflow-visible h-[60px] backface-hidden mt-[-28px] mx-auto transition-all duration-500 ease-in-out`}
              />
            </Link>
            <LinkLarge to={"/psychometric-test"} text="心理測驗" />
            <LinkLarge to={"/feedback"} text="意見回饋" />
          </div>
          {/* 桌面版登入/個人資料按鈕 */}
          <div className="absolute right-10 top-[48px]">
            {isLoggedIn ? (
              <button onClick={onOpenAccount}>
                <img
                  src={avatarUrl}
                  alt="Account"
                  className="w-9 h-9 drop-shadow-lg rounded-full border-2 border-white hover:scale-125 transition-transform duration-300 ease-in-out"
                />
              </button>
            ) : (
              <Link to="/login" className="text-white hover:text-secondary-color transition-colors">
                <img
                  src="/Header/person.svg"
                  alt="Login"
                  className="w-9 h-9 drop-shadow-lg"
                />
              </Link>

            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;