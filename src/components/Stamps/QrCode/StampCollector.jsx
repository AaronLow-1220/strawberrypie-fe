import { useState } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { LoginHint } from '../Hint/LoginHint';
import { useRef } from 'react';

export const StampCollector = ({ 
  stampId, 
  onSuccess, 
  onError, 
  autoSubmit = true,
  onLoginRequired,
  stamps = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showLoginHint, setShowLoginHint] = useState(false);
  const [stampInfo, setStampInfo] = useState(null);
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
   * 從已有印章數據中獲取印章信息
   */
  const getStampInfoFromProps = async (stampId) => {
    // 從props.stamps中查找
    if (stamps && stamps.length > 0) {
      const stamp = stamps.find(s => s.id === stampId || s.stampid === stampId);
      if (stamp) {
        console.log("從現有印章數據中找到:", stamp);
        
        // 如果圖片已經載入，直接使用
        if (stamp.icon && typeof stamp.icon === 'string' && stamp.icon.length > 0) {
          const stampInfo = {
            id: stamp.id,
            stampid: stamp.stampid,
            name: stamp.name,
            icon: stamp.icon,
            genre: stamp.genre
          };
          
          console.log("從現有數據成功獲取印章信息:", stampInfo);
          setStampInfo(stampInfo);
          return stampInfo;
        }
        
        // 如果需要載入圖片
        if (stamp.icon_id) {
          try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const imgResponse = await axios.get(`${apiBaseUrl}/fe/file/download/${stamp.icon_id}`, {
              headers: {
                "Content-Type": "application/octet-stream",
              },
              responseType: "blob",
            });
            const iconUrl = URL.createObjectURL(imgResponse.data);
            
            const stampInfo = {
              id: stamp.id,
              stampid: stamp.stampid,
              name: stamp.name,
              icon: iconUrl,
              genre: stamp.genre
            };
            
            console.log("從現有數據成功獲取印章信息(含圖片):", stampInfo);
            setStampInfo(stampInfo);
            return stampInfo;
          } catch (imgError) {
            console.error("獲取印章圖片失敗:", imgError);
          }
        }
      }
    }
    return null;
  };

  /**
   * 獲取印章信息
   */
  const fetchStampInfo = async (stampId) => {
    try {
      // 先嘗試從props獲取印章信息
      const propsStampInfo = await getStampInfoFromProps(stampId);
      if (propsStampInfo) {
        return propsStampInfo;
      }
      
      // 如果無法從props獲取，則從API查詢
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      
      // 查詢所有印章
      const response = await axios.post(
        `${apiBaseUrl}/fe/stamp/search`,
        {
          pageSize: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data && response.data._data) {
        // 從所有印章中找到匹配的印章
        const stamp = response.data._data.find(stamp => stamp.stampid === stampId || stamp.id === stampId);
        
        if (!stamp) {
          console.error(`未找到ID為 ${stampId} 的印章`);
          return null;
        }

        // 獲取圖示URL
        let iconUrl = "";
        if (stamp.icon_id) {
          try {
            const imgResponse = await axios.get(`${apiBaseUrl}/fe/file/download/${stamp.icon_id}`, {
              headers: {
                "Content-Type": "application/octet-stream",
              },
              responseType: "blob",
            });
            iconUrl = URL.createObjectURL(imgResponse.data);
          } catch (imgError) {
            console.error("獲取印章圖片失敗:", imgError);
          }
        }
        
        // 設置印章信息
        const stampInfo = {
          id: stamp.id,
          stampid: stamp.stampid,
          name: stamp.name,
          icon: iconUrl,
          genre: stamp.genre
        };
        
        console.log("從API成功獲取印章信息:", stampInfo);
        setStampInfo(stampInfo);
        return stampInfo;
      }
      return null;
    } catch (error) {
      console.error("獲取印章資訊失敗:", error);
      return null;
    }
  };

  /**
   * 獲取印章信息的備選方法
   */
  const fetchStampInfoAlternative = async (stampId) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        console.error("沒有訪問令牌，無法獲取印章信息");
        return null;
      }
      
      // 嘗試從已收集的印章中查詢
      const collectResponse = await axios.post(
        `${apiBaseUrl}/stamp-collect/search`,
        {
          userId: parseJwt(accessToken).id,
          pageSize: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (collectResponse.data && collectResponse.data._data) {
        // 找到對應的收集記錄
        const collect = collectResponse.data._data.find(
          item => item.stamp_id === stampId
        );
        
        if (collect) {
          // 如果找到了收集記錄，查詢對應的印章信息
          const stampsResponse = await axios.post(
            `${apiBaseUrl}/fe/stamp/search`,
            {
              pageSize: 100,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (stampsResponse.data && stampsResponse.data._data) {
            const stamp = stampsResponse.data._data.find(
              s => s.id === collect.stamp_id
            );
            
            if (stamp) {
              // 獲取圖示URL
              let iconUrl = "";
              if (stamp.icon_id) {
                try {
                  const imgResponse = await axios.get(`${apiBaseUrl}/fe/file/download/${stamp.icon_id}`, {
                    headers: {
                      "Content-Type": "application/octet-stream",
                    },
                    responseType: "blob",
                  });
                  iconUrl = URL.createObjectURL(imgResponse.data);
                } catch (imgError) {
                  console.error("獲取印章圖片失敗:", imgError);
                }
              }
              
              // 設置印章信息
              const stampInfo = {
                id: stamp.id,
                stampid: stamp.stampid,
                name: stamp.name,
                icon: iconUrl,
                genre: stamp.genre
              };
              
              console.log("通過備選方法成功獲取印章信息:", stampInfo);
              setStampInfo(stampInfo);
              return stampInfo;
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("備選方法獲取印章資訊失敗:", error);
      return null;
    }
  };

  // 解析 JWT token 的函數
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token 解析錯誤:', error);
      return {};
    }
  };

  /**
   * 提交印章ID到API進行收集
   * @param {string} id - 印章ID
   */
  const submitStampId = async (id) => {
    if (!id || isSubmitting) return;

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

      console.log("提交印章 ID:", id);
      
      // 先獲取印章信息
      let stampData = await fetchStampInfo(id);
      
      // 如果第一種方法失敗，嘗試備選方法
      if (!stampData) {
        stampData = await fetchStampInfoAlternative(id);
      }
      
      // 提交集章請求
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(
        `${apiBaseUrl}/stamp/collect/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log("集章 API 回應:", response.data);
      setApiResponse(response.data);
      
      // 處理成功回應
      if (response.data && onSuccess) {
        onSuccess(response.data, stampData);
      }
    } catch (error) {
      console.error("Submit stamp error:", error);
      
      // 特別處理400錯誤（已收集過的印章）
      if (error.response && error.response.status === 400) {
        try {
          // 特殊錯誤訊息
          console.log("此印章已收集過");
          setError("ALREADY_COLLECTED:此印章已收集過");
          
          // 嘗試獲取印章信息後再傳遞錯誤
          const stampData = await fetchStampInfo(id);
          onError(error, stampData);
        } catch (infoError) {
          // 如果獲取印章信息也失敗，則只傳遞原始錯誤
          onError(error);
        }
      } else {
        // 其他錯誤
        setError(error.response?.data?.message || "提交失敗，請稍後再試");
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 提交印章到API
   * @param {string} stampId - 印章ID
   * @returns {Promise<object>} - API響應
   */
  const submitStamp = async (stampId) => {
    // 從 localStorage 獲取 accessToken
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("未登入");
    }
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.get(
      `${apiBaseUrl}/stamp/collect/${stampId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    
    setApiResponse(response.data);
    return response;
  };

  // 如果設置為自動提交且有印章 ID，則自動提交
  if (autoSubmit && stampId && !isSubmitting && !apiResponse && !error && !showLoginHint) {
    submitStampId(stampId);
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