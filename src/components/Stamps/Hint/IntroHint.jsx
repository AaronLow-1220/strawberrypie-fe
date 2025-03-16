import { useState } from 'react';
import { ModalTemplate } from '../ModalTemplate';
import { Link } from 'react-router-dom';

const Amount = ({ amount }) => {
  return (
    <div className="absolute z-10 drop-shadow-[4px_6px_6px_rgba(0,0,0,0.4)] bottom-0 right-0 -me-4 -mb-2">
      <div className='flex absolute top-[10px] left-0 w-full h-full justify-center items-baseline'>
        <p className='text-white text- text-[36px] font-bold' style={{ fontFamily: "R" }}>{amount}</p>
        <p className='text-white text-[16px] font-bold' style={{ fontFamily: "R" }}>名</p>
      </div>
      <img src="/strawberry-young.svg" className='w-[60px] ' alt="" />
    </div>
  )
}

export const IntroHint = ({ onClose }) => {

  // 控制不再顯示的核取方塊狀態
  const [hideForever, setHideForever] = useState(false);


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
      <div className="w-full px-4 my-8">
        <div className="relative mb-8">
          <div className="absolute z-10 top-0 left-0 text-[24px] px-5 py-1 -ms-5 -my-5 shadow-md rounded-full bg-layer3" style={{ fontFamily: "B" }}>
            首獎
          </div>
          <Amount amount={1} />
          <div className="rounded-[8px] p-2 bg-white overflow-hidden">
            <p className='text-black text-[24px] text-center mt-2'>Switch</p>
            <img src="/Stamps/switch.png" alt="" />
          </div>
        </div>
        <div className="flex gap-7 items-stretch">
          <div className="relative w-full">
            <div className="absolute z-10 top-0 left-0 text-[24px] px-5 py-1 -ms-5 -my-5 shadow-md rounded-full bg-layer3" style={{ fontFamily: "B" }}>
              二獎
            </div>
            <Amount amount={1} />
            <div className="rounded-[8px] h-full bg-white overflow-hidden">
              <p className='text-black text-[16px] text-center opacity-60 mt-6 -mb-1'>Marshall</p>
              <p className='text-black text-[24px] text-center'>藍牙喇叭</p>
              <img src="/Stamps/speaker.png" className="scale-90" alt="" />
            </div>
          </div>
          <div className="relative w-full">
            <div className="absolute z-10 top-0 left-0 text-[24px] px-5 py-1 -ms-5 -my-5 shadow-md rounded-full bg-layer3" style={{ fontFamily: "B" }}>
              三獎
            </div>
            <Amount amount={5} />
            <div className="rounded-[8px] h-full bg-white overflow-hidden">
              <p className='text-black text-[16px] text-center opacity-60 mt-6 -mb-1'>創創文化</p>
              <p className='text-black text-[24px] text-center'>桌遊</p>
              <img src="/Stamps/cracrate.png" className="scale-90" alt="" />
            </div>
          </div>
        </div>
      </div>
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
                  先登入才能開始呦
                </p>
                <p className='text-white text-[16px] text-center'>
                  我們才能記錄您的章數
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
      {localStorage.getItem("hideIntroHint") !== "true" && (
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
      )}
    </ModalTemplate>
  )
}