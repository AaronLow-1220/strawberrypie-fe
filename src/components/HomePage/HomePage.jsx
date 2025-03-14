import { useState, useEffect } from "react";
import { Model } from "./MainVision/Model";
import { Logo } from "./MainVision/Logo";
import { Slogan } from "./IntroduceComponents/Slogan";
import { IpModel } from "./IntroduceComponents/IpModel";
import { DateMap } from "./DateMapComponents/DateMap";
import { Unit } from "./UnitComponents/Unit";


const ImageDialog = ({ imgSrc, title, onClose }) => {
  // 防止點擊事件冒泡
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // 在對話框打開時禁止滾動
  useEffect(() => {
    // 保存原始的 overflow 值
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 計算滾動條寬度
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 禁止滾動並添加右邊距，防止頁面跳動
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // 禁止觸摸滾動
    const preventTouch = (e) => {
      e.preventDefault();
    };

    // 禁止滾輪滾動
    const preventWheel = (e) => {
      e.preventDefault();
    };

    // 添加事件監聽器
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });

    // 組件卸載時恢復原始設置
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener('touchmove', preventTouch);
      document.removeEventListener('wheel', preventWheel);
    };
  }, []);

  // 按ESC鍵關閉對話框
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
      style={{ touchAction: 'none' }}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg"
        onClick={stopPropagation}
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full text-black hover:bg-opacity-100 transition-all duration-300"
          onClick={onClose}
          aria-label="關閉"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imgSrc}
          alt={title}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export const HomePage = ({ handleLogoAnimation, setShowHeader }) => {
  // 狀態管理
  const [isAnimationComplete, setIsAnimationComplete] = useState(false); // 動畫是否完成
  const [animate, setAnimate] = useState(false); // Logo 動畫觸發狀態

  // 響應式設計狀態
  const [windowTrue, setWindowTrue] = useState(false); // 是否為平板以上尺寸
  const [windowLargeDesktop, setWindowLargeDesktop] = useState(false); // 是否為大型桌面尺寸

  // 圖片對話框狀態
  const [dialogImage, setDialogImage] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");

  // 處理動畫結束回調
  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  // 處理 Logo 動畫觸發
  const triggerLogoAnimation = () => {
    setAnimate(true);
    if (handleLogoAnimation) {
      handleLogoAnimation();
    }
  };

  // 處理圖片點擊事件
  const handleImageClick = (imgSrc, title) => {
    setDialogImage(imgSrc);
    setDialogTitle(title);
    // 隱藏 Header
    if (setShowHeader) {
      setShowHeader(false);
    }
  };

  // 關閉圖片對話框
  const closeImageDialog = () => {
    setDialogImage(null);
    // 顯示 Header
    if (setShowHeader) {
      setShowHeader(true);
    }
  };

  // 監聽視窗大小變化，設定響應式狀態
  useEffect(() => {
    const handleResize = () => {
      // 手機尺寸 (<768px)
      if (window.innerWidth < 768) {
        setWindowTrue(false);
        setWindowLargeDesktop(false);
      }
      // 平板尺寸 (768px-1023px)
      else if (window.innerWidth < 1024) {
        setWindowTrue(true);
        setWindowLargeDesktop(false);
      }
      // 桌面尺寸 (1024px-1535px)
      else if (window.innerWidth < 1536) {
        setWindowTrue(true);
        setWindowLargeDesktop(false);
      }
      // 大型桌面尺寸 (>=1536px)
      else {
        setWindowTrue(true);
        setWindowLargeDesktop(true);
      }
    };

    // 初始化時執行一次
    handleResize();

    // 添加視窗大小變化的監聽器
    window.addEventListener("resize", handleResize);

    // 組件卸載時移除監聽器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 動畫完成前禁止滾動
  useEffect(() => {
    if (!dialogImage) {
      document.body.style.overflow = isAnimationComplete ? "auto" : "hidden";
    }

    // 組件卸載時恢復滾動和顯示 Header
    return () => {
      document.body.style.overflow = "auto";
      if (setShowHeader) {
        setShowHeader(true);
      }
    };
  }, [isAnimationComplete, dialogImage, setShowHeader]);

  // 渲染 IP 模型區塊
  const renderIpModels = () => {
    // 大型桌面版面 - 並排顯示所有 IP 模型
    if (windowTrue) {
      return (
        <div className="w-full flex 2xl:justify-center pt-[4.5rem] 2xl:pt-[5.375rem] pb-1 overflow-x-auto gap-[4.5rem] scroll-smooth scrollbar-hide px-[4.5rem]">
          <IpModel title="互動" secondTitle="Digital Experience" img="/IPs/互動.png" />
          <IpModel title="遊戲" secondTitle="Game Design" img="/IPs/遊戲.png" />
          <IpModel title="影視" secondTitle="Film Production" img="/IPs/影視.png" />
          <IpModel title="行銷" secondTitle="Marketing" img="/IPs/行銷.png" />
          <IpModel title="動畫" secondTitle="Animation" img="/IPs/動畫.png" />
        </div>
      );
    }
    // 手機版面 - 垂直排列的 IP 模型
    else {
      return (
        <div className="max-w-[33.75rem] mt-[2.6rem] mx-auto">
          <IpModel title="互動" secondTitle="Digital Experience" img="/IPs/互動.png"/>
          <IpModel title="遊戲" secondTitle="Game Design" img="/IPs/遊戲.png" rowReverse="true"/>
          <IpModel title="影視" secondTitle="Film Production" img="/IPs/影視.png"  />
          <IpModel title="行銷" secondTitle="Marketing" img="/IPs/行銷.png" rowReverse="true"/>
          <IpModel title="動畫" secondTitle="Animation" img="/IPs/動畫.png" />
        </div>
      );
    }
  };

  // 渲染日期地圖區塊
  const renderDateMap = () => {
    // 桌面版面
    if (windowTrue) {
      return (
        <>
          <div className="wave-container">
            <div className="img-container wave_0">
              <img src="/HomePage/wave_0.webp" alt="" className="wave" loading="lazy" />
              <img src="/HomePage/wave_0.webp" alt="" className="wave" loading="lazy" />
            </div>
            <div className="img-container wave_1">
              <img src="/HomePage/wave_1.webp" alt="" className="wave" loading="lazy" />
              <img src="/HomePage/wave_1.webp" alt="" className="wave" loading="lazy" />
            </div>
            <div className="relative px-5 lg:w-[90vw] xl:w-[85vw] 2xl:w-[80vw] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <DateMap
                backgroundColor="#FFFFFF"
                color="#F748C1"
                title="校內展"
                date="04.07"
                secondDate="04.12"
                place="元智大學•五館三樓 / 六館玻璃屋"
                imgSrc="/HomePage/校內地圖.png"
                onImageClick={handleImageClick}
              />
            </div>
          </div>
          <div className="wave-container relative left-1/2 transform -translate-x-1/2 -translate-y-[30%]">
            <div className="img-container wave_2">
              <img src="/HomePage/wave_2.webp" alt="" className="wave" loading="lazy" />
              <img src="/HomePage/wave_2.webp" alt="" className="wave" loading="lazy" />
            </div>
            <div className="relative px-5 lg:w-[90vw] xl:w-[85vw] 2xl:w-[80vw] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <DateMap
                backgroundColor="#F748C1"
                color="#FFFFFF"
                title="校外展"
                date="04.25"
                secondDate="04.28"
                place="松山文創園區• 三號倉庫"
                reverseRow="true"
                imgSrc="/HomePage/松菸.png"
                onImageClick={handleImageClick}
              />
            </div>
          </div>
          <div
            className="wave-container absolute z-0"
            style={{
              height: "230px",
              transform: "translateY(-180%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="img-container wave_3">
              <img src="/HomePage/wave_3.webp" alt="" className="wave" />
              <img src="/HomePage/wave_3.webp" alt="" className="wave" />
            </div>
          </div>
        </>
      );
    }
    // 手機版面
    else {
      return (
        <>
          <div className="wave-container left-1/2 transform -translate-x-1/2 -mt-6">
            <div className="img-container wave_0">
              <img src="/HomePage/wave_0.webp" alt="" className="wave" />
              <img src="/HomePage/wave_0.webp" alt="" className="wave" />
            </div>
            <div className="img-container wave_1">
              <img src="/HomePage/wave_1.webp" alt="" className="wave" />
              <img src="/HomePage/wave_1.webp" alt="" className="wave" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-[20px]  max-w-[380px] w-[100vw]">
              <DateMap
                backgroundColor="#FFFFFF"
                color="#F748C1"
                title="校內展"
                date="04.07"
                secondDate="04.12"
                place="元智大學•五館三樓 / 六館玻璃屋"
                imgSrc="/HomePage/校內地圖.png"
                onImageClick={handleImageClick}
              />
            </div>
          </div>
          <div className="wave-container left-1/2 transform -translate-x-1/2 -translate-y-[27%]">
            <div className="img-container wave_2">
              <img src="/HomePage/wave_2.webp" alt="" className="wave" />
              <img src="/HomePage/wave_2.webp" alt="" className="wave" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-[20px] max-w-[380px] w-[100vw]">
              <DateMap
                backgroundColor="#F748C1"
                color="#FFFFFF"
                title="校外展"
                date="04.25"
                secondDate="04.28"
                place="松山文創園區• 三號倉庫"
                imgSrc="/HomePage/松菸.png"
                onImageClick={handleImageClick}
              />
            </div>
          </div>
          <div
            className="wave-container absolute z-0"
            style={{
              height: "200px",
              transform: " translateY(-190%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="img-container wave_3"
            >
              <img src="/HomePage/wave_3.webp" alt="" className="wave" />
              <img src="/HomePage/wave_3.webp" alt="" className="wave" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </>
      );
    }
  };

  // 渲染單位區塊
  const renderUnits = () => {
    return (
      <>
        <div className="flex justify-center flex-col md:flex-row md:gap-16 mx-auto">
          <Unit
            title="主辦單位"
            images={[`/HomePage/元智大學資訊傳播學系.svg`]}
            imgWidth="15.625rem"
          />
          <Unit
            title="執行單位"
            images={[`/HomePage/第28屆畢業展覽籌備會.svg`]}
            imgWidth="15.625rem"
          />
        </div>
        <Unit
          title="贊助單位"
          images={[
            `/HomePage/教育部高等深耕教育計劃.png`,
            `/HomePage/華視文教基金會.png`,
            `/HomePage/創創文化.svg`,
            `/HomePage/yogibo.png`
          ]}
          imgWidth="15.625rem"
        />
        <Unit
          title="指導單位"
          images={[
            `/HomePage/桃園市政府.svg`,
            `/HomePage/桃園市政府青年事務局.png`,
            `/HomePage/桃園市議會.svg`,
            `/HomePage/元智大學-資訊學院.svg`
          ]}
          imgWidth="15.625rem"
        />
      </>
    );
  };

  return (
    <div>
      {/* 頂部視覺區塊 - 背景、Logo 和 3D 模型 */}
      <div>
        <div className="bg-pink-radial">
          <div className="w-full h-full relative flex justify-center items-center">
            <img
              style={{ maxWidth: "initial" }}
              className="h-full"
              src="/HomePage/Background_web.jpg"
              alt="背景圖片"
            />
          </div>
        </div>
        <Logo beginAnimation={animate} />
        <Model
          onAnimationEnd={handleAnimationEnd}
          logoAnimation={triggerLogoAnimation}
        />
      </div>

      {/* IP 模型區塊 - 展示各專業領域 */}
      <div className="w-full mt-[4rem] md:mt-[8rem]">
        <Slogan title="創意滿腦永不衰" secondTitle="左手畫圖，右手寫code" />
        {renderIpModels()}
      </div>

      {/* 日期地圖區塊 - 展示展覽資訊 */}
      <div className="w-full overflow-x-clip h-[75.5rem] mt-[6rem] md:mt-[8rem] xl:mt-[10rem]">
        <Slogan title="跨域築夢不徘徊" secondTitle="提案練習日日在" />
        {renderDateMap()}
      </div>

      {/* 單位區塊 - 展示主辦、執行、贊助和指導單位 */}
      <div className="relative w-full mt-[12rem] mb-[4rem] md:mt-[14rem] xl:mt-[16rem]">
        <Slogan title="草莓派，有夠π～" secondTitle="記住我們的名字" />
        {renderUnits()}
      </div>

      {/* 圖片對話框 */}
      {dialogImage && (
        <ImageDialog
          imgSrc={dialogImage}
          title={dialogTitle}
          onClose={closeImageDialog}
        />
      )}
    </div>
  );
};
