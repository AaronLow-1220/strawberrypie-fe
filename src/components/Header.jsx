import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NavBackground = ({ timeline }) => {
  const pathRef = useRef(null);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const openPath =
      "M416 429.5C416 429.5 381.771 466.366 333.102 466.366C284.433 466.366 261.119 529 205.813 529C150.508 529 161.958 472 102.057 494C42.1567 516 -14 396.5 -14 396.5L-14 -9.99998L416 -9.99994L416 429.5Z";
    const closedPath =
      "M416 409.264C416 409.264 375.756 391.753 327.086 391.753C278.417 391.753 263.338 429.772 208.033 429.772C152.727 429.772 128.161 452.785 63.8621 429.772C-0.436921 406.76 -14 414.768 -14 414.768L-14 -10L416 -9.99996L416 409.264Z";

    timeline.current = gsap.timeline({ paused: true });

    gsap.set(".mobile-menu-container", { scaleY: 0, opacity: 0 });
    gsap.set(path, { attr: { d: closedPath } });

    // timeline 內容：打開時 scaleY -> 1、同時 path -> openPath
    timeline.current
      .to(
        ".mobile-menu-container",
        {
          duration: 0.8,
          scaleY: 1,
          opacity: 1,
          transformOrigin: "top",
          ease: "power3.inOut",
        },
        0 // 從時間軸 0 秒開始
      )
      .to(
        path,
        {
          duration: 0.8,
          attr: { d: openPath },
          ease: "power3.inOut",
        },
        0
      );
  }, [timeline]);

  return (
    <svg
      className="nav-bg"
      width="100%"
      height="450"
      viewBox="0 0 400 450"
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
      <defs>
        <filter
          id="filter0_i_2695_15960"
          x="-14"
          y="-10"
          width="430"
          height="800"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="6" dy="1" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_2695_15960"
          />
        </filter>
      </defs>
      <g style={{ overflow: "visible" }}>
        <g filter="url(#filter0_i_2695_15960)">
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

export const Header = () => {
  const [isHome, setIsHome] = useState(false);
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 建立一個 ref，存放 GSAP Timeline（NavBackground 裡會初始化它）
  const menuTimeline = useRef(null);

  // 判斷是否為首頁
  useEffect(() => {
    setIsHome(window.location.pathname === "/");
  }, []);

  // 監聽視窗寬度改變，判斷是桌機或行動版
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1584) {
        setWindowWidthTrue(true);
      } else {
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 每次 menuOpen 改變時，判斷要播放還是倒轉 timeline
  useEffect(() => {
    if (!menuTimeline.current) return;
    if (menuOpen) {
      menuTimeline.current.play();
    } else {
      menuTimeline.current.reverse();
    }
  }, [menuOpen]);

  return (
    <>
      {windowWidthTrue ? (
        // 桌機版 Header （略）
        <div
          style={{
            background:
              "linear-gradient(to bottom, rgba(27, 8, 10, 0.5) 0%, rgba(27, 8, 10, 0) 100%)",
          }}
        >
          <div className="fixed top-0 left-0 right-0 z-[999]">
            <div className="w-full  flex justify-center  mt-[48px] px-[1rem] navContainer">
              <a
                className="navHover text-[1.5rem] mx-[1.6875rem]  leading-none"
                style={{
                  textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                  fontFamily: "B",
                }}
                href="/group"
              >
                組別介紹
              </a>
              <a
                className="navHover text-[1.5rem] mx-[1.6875rem]  leading-none"
                style={{
                  textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                  fontFamily: "B",
                }}
                href="/collect"
              >
                集章兌換
              </a>
              {!isHome ? (
                <img
                  src="/Headline.svg"
                  alt="Headline"
                  className={
                    window.innerWidth < 1584
                      ? "w-[7.5rem] h-auto backface-hidden mx-[14.4px] mt-[-27.25px]"
                      : "w-[9.5rem] h-auto backface-hidden mt-[-30px] mx-[14.4px]"
                  }
                />
              ) : (
                <div className="w-[180px]"></div>
              )}
              <a
                className="navHover text-[1.5rem] mx-[1.6875rem]  leading-none "
                style={{
                  textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                  fontFamily: "B",
                }}
                href="/PsychologicalTest"
              >
                心理測驗
              </a>
              <div
                className="navHover text-[1.5rem] mx-[1.6875rem]  leading-none "
                style={{
                  textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                  fontFamily: "B",
                }}
              >
                意見回饋
              </div>
            </div>
          </div>
        </div>
      ) : (
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

          {/* 將行動版容器的展開／收起，也交給 GSAP 控制 */}
          <div
            className="mobile-menu-container z-[-10] absolute top-0 right-0 w-full h-[33.75rem]"
            style={{
              // 移除原本的 transition、scale-y-0 / scale-y-100
              // 只保留必要定位與圖層設定
              willChange: "transform",
              transformOrigin: "top",
            }}
          >
            <NavBackground menuOpen={menuOpen} timeline={menuTimeline} />
            <ul
              className="relative z-10 flex flex-col items-center justify-center h-full text-white"
              style={{ fontFamily: "B" }}
            >
              <li className="pb-[2.25rem] text-[2rem]">
                <a href="/group">
                  <div className="flex items-center">
                    <div>組別介紹</div>
                    <div className="ms-[1rem]">
                      <img src="/Header/category.svg" alt="Category" />
                    </div>
                  </div>
                </a>
              </li>
              <li className="pb-[2.25rem] text-[2rem]">
                <a href="/collect">
                  <div className="flex items-center">
                    <div>集章兌換</div>
                    <div className="ms-[1rem]">
                      <img src="/Header/feedback.svg" alt="Feedback" />
                    </div>
                  </div>
                </a>
              </li>
              <li className="pb-[2.25rem] text-[2rem]">
                <a href="/psychologicalTest">
                  <div className="flex items-center">
                    <div>心裡測驗</div>
                    <div className="ms-[1rem]">
                      <img src="/Header/psychology.svg" alt="Psychology" />
                    </div>
                  </div>
                </a>
              </li>
              <li className="text-[2rem]">
                <a href="/contact">
                  <div className="flex items-center">
                    <div>意見回饋</div>
                    <div className="ms-[1rem]">
                      <img src="/Header/stamp.svg" alt="Stamp" />
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
