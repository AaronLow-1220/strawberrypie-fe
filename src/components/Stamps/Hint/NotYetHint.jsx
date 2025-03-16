import { ModalTemplate } from '../ModalTemplate';
import { Link } from 'react-router-dom';

export const NotYetHint = ({ onClose, handleOpenRewardDialog, currentCount }) => {
  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-[36px] mb-3 mt-2 text-center font-bold" style={{ fontFamily: "B" }}>尚未開放</h2>
      <p className="text-[18px] opacity-80 mb-6 text-center">展覽當天才開放集章功能，不過你想先看看的話也可以</p>

      {/* 獎勵內容 */}
      <div className="flex flex-col gap-4 w-full">
        <Link to="/" className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
          回首頁
        </Link>
        <button
          onClick={onClose}
          className="mx-auto text-white w-fit text-center opacity-80 underline underline-offset-2  hover:opacity-100"
        >
          先看看
        </button>
      </div>
    </ModalTemplate>
  );
}; 