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
  const [ipModelWindowHeight, setIpModelWindowHeight] = useState("60rem");
  const [ipModelWidth, setIpModelWidth] = useState("100%");
  const [dateMapWindowHeight, setDateMapWindowHeight] = useState("78rem");
  const [unitWindowHeight, setUnitWindowHeight] = useState("68rem");
  const [windowTrue, setWindowTrue] = useState(false);

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
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIpModelWindowHeight("60rem");
      } else if (window.innerWidth < 1024) {
        setIpModelWindowHeight("29.45rem");
        setDateMapWindowHeight("59.375rem");
        setUnitWindowHeight("55.25rem");
        setIpModelWidth("calc(100% - 9rem)");
        setWindowTrue(true);
      } else {
        setIpModelWindowHeight("29.45rem");
        setDateMapWindowHeight("59.375rem");
        setUnitWindowHeight("52rem");
        setIpModelWidth("83rem");
        setWindowTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="bg-[#1B080A]">
      <div className="relative">
        <div className="bg-pink-radial "></div>
        <Logo beginAnimation={animate} />
        <Model
          onAnimationEnd={handleAnimationEnd} // 傳遞動畫結束回調
          logoAnimation={handleLogoAnimation} // 傳遞 Logo 動畫觸發方法
        />
      </div>
      <div
        className="w-full bg-black mb-[6rem]"
        style={{ height: ipModelWindowHeight }}
      >
        <Slogan title="創意滿腦永不衰" secondTitle="左手畫圖，右手寫code" />
        {windowTrue === true ? (
          <div
            className="ipModelScroll mx-auto"
            style={{ width: ipModelWidth }}
          >
            <IpModel
              title="互動"
              secondTitle="Digital Experience"
              img="/互動_web.png"
            />
            <IpModel
              title="遊戲"
              secondTitle="Game Design"
              img="/遊戲_web.png"
            />
            <IpModel
              title="影視"
              secondTitle="Film Production"
              img="/影視_web.png"
            />
            <IpModel title="行銷" secondTitle="Marketing" img="/行銷_web.png" />
            <IpModel title="動畫" secondTitle="Animation" img="/動畫_web.png" />
          </div>
        ) : (
          <div className="max-w-[33.75rem] h-[49.4rem] mt-[2.6rem] mx-auto">
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
        )}
      </div>
      <div className="w-full bg-black" style={{ height: dateMapWindowHeight }}>
        <Slogan title="跨域築夢不徘徊" secondTitle="提案練習日日在" />
        {windowTrue === true ? (
          <>
            <div className="mt-[4.125rem]">
              <div className="w-full h-[100px] overflow-hidden relative">
                <div
                  className="waveMoveIMG"
                  style={{
                    background: 'url("/wave_0-extend.svg") repeat-x',
                  }}
                ></div>
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 8%, rgba(0, 0, 0, 1) 15%),
                url('/wave_1-extend.svg')`,
                  }}
                ></div>
              </div>
              <DateMap
                backgroundColor="#FFFFFF"
                color="#E04AA9"
                title="校內展"
                date="04.07"
                secondDate="04.11"
                place="元智大學•五館三樓 / 六館玻璃屋"
              />
            </div>
            <div>
              <div className="w-full h-[100px] overflow-hidden relative">
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 8%, rgba(0, 0, 0, 1) 15%),
                url('/wave_2-extend.svg')`,
                  }}
                ></div>
              </div>
              <DateMap
                backgroundColor="#E04AA9"
                color="#FFFFFF"
                title="校外展"
                date="04.25"
                secondDate="04.28"
                place="松三文創園區• 三號倉庫"
              />
            </div>
            <div>
              <div
                className="w-full h-[100px] overflow-hidden relative"
                style={{
                  transform: "rotate(180deg)",
                }}
              >
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 3%, rgba(0, 0, 0, 1) 15%),
                url('/wave_0-extend.svg')`,
                  }}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="w-full h-[50px] overflow-hidden relative">
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 1) 20%),
                url('/wave_0-extend.svg')`,
                  }}
                ></div>
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 1) 20%),
                url('/wave_1-extend.svg')`,
                  }}
                ></div>
              </div>
              <DateMap
                backgroundColor="#FFFFFF"
                color="#E04AA9"
                title="校內展"
                date="04.07"
                secondDate="04.11"
                place="元智大學•五館三樓 / 六館玻璃屋"
              />
            </div>
            <div>
              <div className="w-full h-[50px] overflow-hidden relative">
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 8%, rgba(0, 0, 0, 1) 15%),
                url('/wave_2-extend.svg')`,
                  }}
                ></div>
              </div>
              <DateMap
                backgroundColor="#E04AA9"
                color="#FFFFFF"
                title="校外展"
                date="04.25"
                secondDate="04.28"
                place="松三文創園區• 三號倉庫"
              />
            </div>
            <div>
              <div
                className="w-full h-[50px] overflow-hidden relative"
                style={{
                  transform: "rotate(180deg)",
                }}
              >
                <div
                  className="waveMoveIMG"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 3%, rgba(0, 0, 0, 1) 15%),
                url('/wave_0-extend.svg')`,
                  }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="w-full bg-black mt-[4.125rem]"
        style={{ height: unitWindowHeight }}
      >
        <Slogan title="草莓派，有夠π～" secondTitle="記住我們的名字" />
        {windowTrue === true ? (
          <>
            <div className="w-[35.25rem] flex justify-between mx-auto">
              <Unit
                title="主辦單位"
                img="/元智大學資訊傳播學系.svg"
                imgWidth="15.625rem"
              />
              <Unit
                title="指導單位"
                img="/第28屆畢業展覽籌備會.svg"
                imgWidth="15.625rem"
              />
            </div>
            <Unit
              title="贊助單位"
              img="/華視文教基金會.png"
              img2="/教育部高等深耕教育計劃.png"
              imgWidth="15.625rem"
            />
            <Unit
              title="贊助單位"
              img="/桃園市政府.svg"
              img2="/桃園市政府青年事務局.png"
              img3="/桃園市議會.svg"
              img4="/元智大學-資訊學院.svg"
              imgWidth="15.625rem"
            />
          </>
        ) : (
          <>
            <Unit title="主辦單位" img="/元智大學資訊傳播學系.svg" />
            <Unit title="指導單位" img="/第28屆畢業展覽籌備會.svg" />
            <Unit
              title="贊助單位"
              img="/華視文教基金會_mobile.png"
              img2="/教育部高等深耕教育計劃_mobile.png"
            />
            <Unit
              title="贊助單位"
              img="/桃園市政府.svg"
              img2="/桃園市政府青年事務局.png"
              img3="/桃園市議會.svg"
              img4="/元智大學-資訊學院.svg"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
