import { useNavigate } from 'react-router-dom';
import { ModalTemplate } from '../ModalTemplate';

export const LoginHint = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-white text-xl font-bold mb-4 text-center">請先登入</h2>
      
      {/* 內容 */}
      <div className="flex flex-col gap-4 w-full">
        <p className="text-white text-center mb-2">您需要登入才能使用此功能</p>
        <button onClick={handleLogin} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
          前往登入
        </button>
        <button
          onClick={onClose}
          className="mx-auto text-white w-fit text-center opacity-80 hover:underline"
        >
          取消
        </button>
      </div>
    </ModalTemplate>
  );
}; 