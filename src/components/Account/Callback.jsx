import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        // 從 URL 中獲取令牌
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('access_token');
        const error = searchParams.get('error');

        console.log("code: ",code)
        console.log("error: ",error)

        if (error) {
          throw new Error(`認證失敗: ${error}`);
        }

        if (!code) {
          throw new Error('未接收到認證碼');
        }

        localStorage.setItem('access_token', code);

        // 重定向到首頁
        navigate('/');

        
      } catch (err) {
        console.error('認證處理錯誤:', err);
        setError(err.message || '認證過程中發生錯誤');
        setLoading(false);
      }
    };

    processAuthentication();
  }, [location, navigate]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-[#361014]">
        <div className="text-4xl font-bold mb-4" style={{ fontFamily: "B" }}>處理中...</div>
        <div className="animate-pulse w-16 h-16 bg-secondary-color rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-[#361014]">
        <div className="text-4xl font-bold mb-4" style={{ fontFamily: "B" }}>認證失敗</div>
        <div className="text-xl mb-8">{error}</div>
        <button 
          onClick={() => navigate('/login')} 
          className="primary-button bg-primary-color text-white text-lg px-6 py-2 rounded-full transition-all duration-300"
        >
          返回登入
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white px-8">
        <h1 className="font-bold text-center text-[48px] lg:text-[72px]" style={{fontFamily:"B"}}>登入成功</h1>
        <p className="text-[20px] lg:text-[24px] text-center text-secondary-color">速速帶你回首頁...</p>
    </div>
  );
};
