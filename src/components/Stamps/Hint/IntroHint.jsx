import { useState } from 'react';
import { ModalTemplate } from '../ModalTemplate';
import { Link } from 'react-router-dom';

// 獎品項目組件
const PrizeItem = ({ rank, amount, brand, name, image, isLarge = false }) => {
  return (
    <div className={`relative ${isLarge ? "mb-8" : "w-full"}`}>
      <div className="absolute z-10 top-0 left-0 text-[24px] px-5 py-1 -ms-5 -my-5 shadow-md rounded-full bg-layer3" style={{ fontFamily: "B" }}>
        {rank}
      </div>
      <div className="absolute z-10 drop-shadow-[4px_6px_6px_rgba(0,0,0,0.4)] bottom-0 right-0 -me-4 -mb-2">
      <div className='flex absolute top-[10px] left-0 w-full h-full justify-center items-baseline'>
        <p className='text-white text-shadow text-[36px] font-bold' style={{ fontFamily: "R" }}>{amount}</p>
        <p className='text-white text-shadow text-[16px] font-bold' style={{ fontFamily: "R" }}>名</p>
      </div>
      <img src="/strawberry-young.svg" className='w-[60px] ' alt="" />
    </div>
      <div className={`rounded-[8px] ${isLarge ? "p-2" : "h-full"} bg-white overflow-hidden`}>
        {brand && <p className='text-black text-[16px] text-center opacity-60 mt-6 -mb-1'>{brand}</p>}
        <p className={`text-black ${isLarge ? "text-[24px]" : "text-[24px]"} text-center ${!brand && isLarge ? "mt-2" : ""}`}>{name}</p>
        <img src={image} className={!isLarge ? "scale-90" : ""} alt={name} />
      </div>
    </div>
  )
}

export const IntroHint = ({ onClose }) => {
  // 控制不再顯示的核取方塊狀態
  const [hideForever, setHideForever] = useState(false);

  const DoNotShow = () => {
    return (
      <div className="flex items-center justify-center mt-4 mb-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={hideForever}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded focus:ring-0 accent-white"
        />
        <span className="ml-2 text-white text-sm">不再顯示</span>
      </label>
    </div>
    )
  }

  // 處理關閉按鈕點擊
  const handleClose = () => {
    // 如果勾選了"不再顯示"，則將設定保存到 localStorage
    if (hideForever) {
      localStorage.setItem("hideIntroHint", "true");
    }
    onClose();
  }

  // 處理核取方塊狀態變更
  const handleCheckboxChange = (e) => {
    setHideForever(e.target.checked);
  };

  return (
    <ModalTemplate onClose={onClose}>
      <h2 className="text-xl mb-1 text-center text-secondary-color">造訪各組，搜集章點</h2>
      <h1 className="text-white text-center text-[32px] font-bold mb-4" style={{ fontFamily: "B" }}>即有機會抽中大獎 !</h1>
      <div className="w-full px-4 mt-8 mb-6">
        {/* 首獎 */}
        <PrizeItem 
          rank="首獎"
          amount={1}
          name="Switch"
          image="/Stamps/switch.png"
          isLarge={true}
        />
        <div className="flex gap-7 items-stretch">
          {/* 二獎 */}
          <PrizeItem 
            rank="二獎"
            amount={1}
            brand="Marshall"
            name="藍牙喇叭"
            image="/Stamps/speaker.png"
          />
          {/* 三獎 */}
          <PrizeItem 
            rank="三獎"
            amount={5}
            brand="創創文化"
            name="桌遊"
            image="/Stamps/cracrate.png"
          />
        </div>
      </div>
      <div className='w-full mb-6'>
        <img src="/Stamps/merches.png" alt="" />
        <p className='text-white text-[20px] text-center' style={{ fontFamily: "R" }}>及周邊商品等你來抽！</p>
      </div>
      <hr className='mx-4 opacity-20 mb-4' />
      <div className='w-full mb-6'>
        <ol>
          <li className='text-center'>每<span className='text-[32px] px-1 text-secondary-color' style={{ fontFamily: "B"}}>7</span>個章，即可抽周邊商品</li>
          <li className='text-center'>集滿<span className='text-[32px] px-1 text-secondary-color' style={{ fontFamily: "B"}}>22</span>個章，即可線上抽大獎 !</li>
          <li className='text-[14px] opacity-60 px-6 mt-4 text-center'>將於 4 月 30 號禮拜三進行 instagram 直播抽大獎，並以電子信箱的方式聯繫得主! 詳細時間會再公布於
          <a className='ps-1 inline-block underline underline-offset-2 hover:opacity-100' target='_blank' href='https://www.instagram.com/yzuic_28?igsh=ZWNvMDd6NzV4bTM1'>instagram: @yzuic_28</a></li>
        </ol>
      </div>
      <hr className='mx-4 opacity-20 mb-8' />

      {/* 確認按鈕 */}
      <div className="flex justify-center mt-4">
        {localStorage.getItem("accessToken") ? (
          <button
            onClick={handleClose}
            className="max-w-[200px] w-full mx-auto py-3 primary-button text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            集章集起來！
          </button>
        ) : (
          <div className="flex flex-col gap-2 w-full justify-center">
            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className='text-white text-[16px] text-center'>
                  登入以記錄您的章點
                </p>
              </div>
              <Link to="/login" className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
                前往登入
              </Link>
              <button
                onClick={onClose}
                className="mx-auto text-white w-fit text-center opacity-80 underline underline-offset-2 hover:opacity-100"
              >
                我就看看
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 不再顯示的核取方塊 */}
      {localStorage.getItem("accessToken") == null ? (
        null
      ) : localStorage.getItem("hideIntroHint") !== "true" && (
        <DoNotShow />
      )}
    </ModalTemplate>
  )
}