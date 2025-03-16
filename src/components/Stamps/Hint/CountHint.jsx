import { ModalTemplate } from '../ModalTemplate';

export const CountHint = ({ onClose, handleOpenRedeemDialog, currentCount }) => {
  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-[36px] mb-3 mt-2 text-center font-bold" style={{ fontFamily: "B" }}>您已集滿 {currentCount} 個章！</h2>
      <p className="text-[18px] opacity-80 mb-6 text-center">獲得小獎兌換資格！</p>
      
      {/* 獎勵內容 */}
      <div className="flex flex-col gap-4 w-full">
        <button onClick={() => { onClose(); handleOpenRedeemDialog(); }} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
          兌換小獎
        </button>
        <button
          onClick={onClose}
          className="mx-auto text-white w-fit text-center opacity-80 underline underline-offset-2  hover:opacity-100"
        >
          不用，謝謝
        </button>
      </div>
    </ModalTemplate>
  );
}; 