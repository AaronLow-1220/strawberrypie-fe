import { useState, useEffect } from "react";
import { Model } from "./components/MainVision/Model";
import { Logo } from "./components/MainVision/Logo";
import { Slogan } from "./components/IntroduceComponents/Slogan";
import { IpModel } from "./components/IntroduceComponents/IpModel";
import { DateMap } from "./components/DateMapComponents/DateMap";
import { Unit } from "./components/UnitComponents/Unit";

function App() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Logo 動畫觸發方法
  const handleLogoAnimation = () => {
    doAnimation();
  };
  const doAnimation = () => {
    setAnimate(true);
  };
  // 處理動畫結束回調
  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  useEffect(() => {
    if (!isAnimationComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAnimationComplete]);

  return (
    <div className="bg-black">
      <div className="bg-pink-radial ">
        <Logo beginAnimation={animate} />
        <Model
          onAnimationEnd={handleAnimationEnd} // 傳遞動畫結束回調
          logoAnimation={handleLogoAnimation} // 傳遞 Logo 動畫觸發方法
        />
      </div>
      <div className="w-full h-[60rem] bg-black">
        <Slogan title="創意滿腦永不衰" secondTitle="左手畫圖，右手寫code" />
        <div className="w-full h-[49.4rem] mt-[2.6rem] ">
          <IpModel
            height="8.75rem"
            title="互動"
            secondTitle="Digital Experience"
            img="/互動_web.png"
            imgWidth="9.5rem"
            rowReverse="true"
          />
          <IpModel
            height="6.5rem"
            title="遊戲"
            secondTitle="Game Design"
            img="/遊戲_web.png"
            imgWidth="7.625rem"
            paddingLeft="126px"
          />
          <IpModel
            height="10rem"
            title="影視"
            secondTitle="Film Production"
            img="/影視_web.png"
            imgWidth="7.5rem"
            rowReverse="true"
            textMarginLeft="12px"
          />
          <IpModel
            height="8.25rem"
            title="行銷"
            secondTitle="Marketing"
            img="/行銷_web.png"
            imgWidth="9.3rem"
            paddingLeft="128px"
          />
          <IpModel
            height="7.75rem"
            title="動畫"
            secondTitle="Animation"
            img="/動畫_web.png"
            imgWidth="10.25rem"
            rowReverse="true"
            textMarginLeft="12px"
          />
        </div>
      </div>
      <div className="w-full h-[75.5rem] bg-black">
        <Slogan title="跨域築夢不徘徊" secondTitle="提案練習日日在" />
        <div
          style={{
            backgroundImage: `url(/public/wave_1-1.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "500px",
            height: "35rem",
            paddingTop: "3rem",
          }}
        >
          <DateMap
            backgroundColor="#FFFFFF"
            color="#E04AA9"
            title="校內展"
            date="04.07"
            secondDate="04.11"
            place="元智大學•五館三樓 / 六館玻璃屋"
          />
        </div>
        <div
          style={{
            backgroundImage: `url(/public/wave_2-1.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "500px",
            height: "35rem",
            paddingTop: "3rem",
          }}
        >
          <DateMap
            backgroundColor="#E04AA9"
            color="#FFFFFF"
            title="校外展"
            date="04.25"
            secondDate="04.28"
            place="松三文創園區• 三號倉庫"
          />
        </div>
      </div>
      <div className="w-full h-[68rem] bg-black">
        <Slogan title="草莓派，有夠π～" secondTitle="記住我們的名字" />
        <Unit title="主辦單位" img="/元智大學資訊傳播學系.svg" />
        <Unit title="指導單位" img="/第28屆畢業展覽籌備會.svg" />
        <Unit
          title="贊助單位"
          img="/華視文教基金會_mobile.png"
          img2="/教育部高等深耕教育計劃_mobile.png"
        />
        <Unit
          title="贊助單位"
          img="/public/桃園市政府.svg"
          img2="/public/桃園市政府青年事務局.png"
          img3="/public/桃園市議會.svg"
          img4="/public/元智大學-資訊學院.svg"
        />
      </div>
    </div>
  );
}

export default App;
