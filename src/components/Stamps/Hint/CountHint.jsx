import { ModalTemplate } from '../ModalTemplate';

export const CountHint = ({ onClose, handleOpenRewardDialog, currentCount }) => {
  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-white text-xl font-bold mb-4 text-center">您已集滿 {currentCount} 個章！</h2>
      
      {/* 獎勵內容 */}
      <div className="flex flex-col gap-4 w-full">
        <button onClick={() => { onClose(); handleOpenRewardDialog(); }} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
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