import { Link } from 'react-router-dom';
import { ModalTemplate } from '../ModalTemplate';

export const LoginHint = ({ onClose }) => {

  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-[36px] mb-4 text-center font-bold" style={{ fontFamily: "B" }}>請先登入</h2>
      <p className="text-[18px] opacity-80 mb-6 text-center">以便記錄您的章點</p>

      {/* 獎勵內容 */}
      <div className="flex flex-col gap-4 w-full">
        <Link to="/login" className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
          前往登入
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