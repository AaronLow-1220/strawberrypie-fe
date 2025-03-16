import { useState } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { LoginHint } from '../Hint/LoginHint';
import { useRef } from 'react';

/**
 * 通用的集章功能組件
 * 接收印章 ID 並處理集章 API 請求
 * 
 * @param {Object} props
 * @param {string} props.stampId - 印章 ID
 * @param {Function} props.onSuccess - 集章成功後的回調
 * @param {Function} props.onError - 發生錯誤時的回調
 * @param {boolean} props.autoSubmit - 是否自動提交 (預設為 true)
 * @param {Function} props.onLoginRequired - 登入需求的回調 (可選)
 * @returns {JSX.Element}
 */
export const StampCollector = ({ 
  stampId, 
  onSuccess, 
  onError, 
  autoSubmit = true,
  onLoginRequired
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showLoginHint, setShowLoginHint] = useState(false);
  const loginHintRef = useRef(null);

  // 處理開啟登入提示彈出層
  const handleOpenLoginHint = () => {
    setShowLoginHint(true);
    if (onLoginRequired) {
      onLoginRequired();
    }
  };

  // 處理關閉登入提示彈出層
  const handleCloseLoginHint = () => {
    setShowLoginHint(false);
  };

  /**
   * 提交印章 ID 到集章 API
   */
  const submitStampId = async () => {
    if (!stampId || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 從 localStorage 獲取 accessToken
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        // 顯示登入提示
        setIsSubmitting(false);
        handleOpenLoginHint();
        return;
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(
        `${apiBaseUrl}/stamp/collect/${stampId}`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log("集章 API 回應:", response.data);
      setApiResponse(response.data);
      
      // 通知父組件集章成功
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("提交印章 ID 失敗:", error.message);
      setError(error.response?.data?.message || "提交失敗，請稍後再試");
      setIsSubmitting(false);
      
      // 通知父組件發生錯誤
      if (onError) {
        onError(error);
      }
    }
  };

  // 如果設置為自動提交且有印章 ID，則自動提交
  if (autoSubmit && stampId && !isSubmitting && !apiResponse && !error && !showLoginHint) {
    submitStampId();
  }

  // 這個組件不直接渲染 UI，只處理 API 調用和登入提示
  return (
    <>
      {/* 登入提示彈出層 */}
      <CSSTransition in={showLoginHint} nodeRef={loginHintRef} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
        <div ref={loginHintRef}>
          <LoginHint onClose={handleCloseLoginHint} />
        </div>
      </CSSTransition>
    </>
  );
};

export default StampCollector; 