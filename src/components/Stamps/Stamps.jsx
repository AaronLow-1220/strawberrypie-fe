import { useState, useCallback, useRef } from "react"; // 移除 useEffect 引入，因為已經不需要
import { CSSTransition } from "react-transition-group"; // 添加 CSSTransition 引入
import { ProgressBar } from "./ProgressBar/ProgressBar"; // 匯入進度條組件
import { GroupBlock } from "./GroupBlock"; // 匯入組別區塊組件
import { GroupBlockItem } from "./GroupBlockItem"; // 匯入組別區塊項目組件
import { QRScanner } from "./QrCode/QRScanner"; // 匯入 QRScanner 組件
import { useEffect } from "react";
import { FocusCard } from "../Group/Card/FocusCard";
import { Link, useLocation } from "react-router-dom";
import { LoginHint } from "./Hint/LoginHint";
import { IntroHint } from "./Hint/IntroHint";
import { NotYetHint } from "./Hint/NotYetHint";
import { LuckyDrawHint } from "./Hint/LuckyDrawHint";
import { Redeem } from "./QrCode/Redeem"; // 匯入 Redeem 組件
import { CountHint } from "./Hint/CountHint"; // 匯入 Hint 組件
import axios from "axios";
import { StampCollector } from "./QrCode/StampCollector";
import { ScanResultModal } from "./QrCode/ScanResultModal"; // 匯入 ScanResultModal 組件
import { jwtDecode } from 'jwt-decode';

// 添加 CSS 樣式到檔案頂部
import "./QrCode/QRScannerTransition.css";

export const Stamps = () => {

    // 假設目前集到的張數與總數
    const [currentCount, setCurrentCount] = useState(0);
    const totalStamps = 22;

    const [stamps, setStamps] = useState([]);
    // 用於存儲從 group API 獲取的卡片數據
    const [cards, setCards] = useState([]);
    const [stampCollects, setStampCollects] = useState([]);
    // 用於追蹤當前焦點卡片的資料
    const [focusedCard, setFocusedCard] = useState(null);
    // 從 URL 獲取的印章 ID
    const [urlStampId, setUrlStampId] = useState(null);
    // 添加狀態來追蹤 URL 參數是否已處理
    const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

    // 新增節點引用
    const focusCardRef = useRef(null);
    const overlayRef = useRef(null);
    const location = useLocation(); // 獲取當前 URL 資訊

    // 添加狀態來控制 QRScanner 和 RewardDialog 的顯示
    const [showScanner, setShowScanner] = useState(false);
    const [showRedeemDialog, setShowRedeemDialog] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [showFocusCard, setShowFocusCard] = useState(false);
    const [showLoginHint, setShowLoginHint] = useState(false);
    const [showIntroHint, setShowIntroHint] = useState(false);
    const [showNotYetHint, setShowNotYetHint] = useState(false);
    const [onDate, setOnDate] = useState(true);
    const [scanSuccess, setScanSuccess] = useState(false);  // 添加掃描成功狀態
    const [urlProcessStarted, setUrlProcessStarted] = useState(false); // 追蹤是否已開始處理 URL 印章 ID

    // 新增狀態用於顯示掃描結果
    const [showScanResult, setShowScanResult] = useState(false);
    const [showLuckyDrawHint, setShowLuckyDrawHint] = useState(false);
    const [scanResultInfo, setScanResultInfo] = useState(null);
    const [scanStampInfo, setScanStampInfo] = useState(null);

    // 處理開啟抽獎提示彈出層
    const [luckyDrawResult, setLuckyDrawResult] = useState(null);
    
    const handleOpenLuckyDrawHint = (result) => {
        setLuckyDrawResult(result);
        setShowLuckyDrawHint(true);
    };

    // 處理關閉抽獎提示彈出層
    const handleCloseLuckyDrawHint = () => {
        setShowLuckyDrawHint(false);
        setTimeout(() => {
            setLuckyDrawResult(null);
        }, 300);
    };

    const parseJsonArray = (jsonString) => {
        try {
            const obj = JSON.parse(jsonString);
            return Object.values(obj);
        } catch (error) {
            console.error("解析 JSON 失敗", error);
            return [];
        }
    };

    const mediaArray = (jsonString) => {
        try {
            const obj = JSON.parse(jsonString);
            return Object.entries(obj).filter(([key, value]) => value !== "");
        } catch (error) {
            console.error("解析 media 失敗", error);
            return [];
        }
    };

    const mapGenreToCategory = (genre) => {
        const genreMap = {
            0: "互動",
            1: "遊戲",
            2: "影視",
            3: "動畫",
            4: "行銷",
            5: "其他",
        };
        return genreMap[genre] || "其他";
    };

    // 載入所有印章圖片
    const loadImagesInOrder = async (stampsData, apiBaseUrl) => {
        console.log("loadImagesInOrder");
        // 載入單個卡片的圖片
        const loadStampImage = async (stamp, index) => {
            if (!stamp.icon_id || loadedImages[stamp.id]) return;

            try {
                const imgResponse = await axios.get(`${apiBaseUrl}/fe/file/download/${stamp.icon_id}`, {
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                    responseType: "blob",
                });

                const imageURL = URL.createObjectURL(imgResponse.data);

                // 更新已載入的圖片
                setLoadedImages((prev) => ({
                    ...prev,
                    [stamp.id]: imageURL,
                }));

                // 更新卡片列表中的圖片
                setStamps((stampArray) => {
                    const newStamps = [...stampArray];
                    if (newStamps[index]) {
                        newStamps[index] = {
                            ...newStamps[index],
                            icon: imageURL,
                            imageLoading: false,
                        };
                    }
                    return newStamps;
                });
            } catch (imgError) {
                console.error(`無法下載圖片 (icon_id: ${stamp.icon_id})`, imgError);

                // 標記圖片載入失敗
                setStamps((stampArray) => {
                    const newStamps = [...stampArray];
                    if (newStamps[index]) {
                        newStamps[index] = {
                            ...newStamps[index],
                            imageLoading: false,
                        };
                    }
                    return newStamps;
                });
            }
        };

        // 開始載入所有卡片的圖片
        stampsData.forEach((stamp, index) => {
            loadStampImage(stamp, index);
        });
    };

    // 獲取所有印章資料
    const fetchStamps = async () => {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            let responseData;

            if (window.preloadedData && window.preloadedData.stampData) {
                responseData = window.preloadedData.stampData;
            } else {
                const response = await axios.post(
                    `${apiBaseUrl}/fe/stamp/search`,
                    {
                        pageSize: 25,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                responseData = response.data;
            }

            const stampsData = responseData._data.map((stamp) => ({
                id: stamp.id,
                stampid: stamp.stampid,
                name: stamp.name,
                genre: mapGenreToCategory(stamp.genre),
                icon: "",
                imageLoading: !!stamp.icon_id,
                icon_id: stamp.icon_id,
            }));

            setStamps(stampsData);

            loadImagesInOrder(stampsData, apiBaseUrl);
            console.log("success");
        } catch (error) {
            console.error("獲取印章失敗: ", error);
        }
    };

    // 獲取用戶已收集的印章
    const fetchStampCollects = async () => {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            let responseData;

            if (window.preloadedData && window.preloadedData.stampCollectData) {
                responseData = window.preloadedData.stampCollectData;
            } else {
                const response = await axios.post(
                    `${apiBaseUrl}/stamp-collect/search`,
                    {
                        userId: jwtDecode(localStorage.getItem("accessToken")).id,
                        pageSize: 25,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                responseData = response.data;
            }

            const stampCollectsData = responseData._data.map((stampCollect) => ({
                id: stampCollect.id,
                stamp_id: stampCollect.stamp_id,
                user_id: stampCollect.user_id,
            }));

            setCurrentCount(stampCollectsData.length);
            setStampCollects(stampCollectsData);
        } catch (error) {
            console.error("獲取印章失敗: ", error);
        }
    };

    // 處理開啟掃描器
    const handleOpenScanner = () => {
        if (!onDate) {
            handleOpenNotYetHint();
            return;
        }

        if (localStorage.getItem("accessToken") == null) {
            handleOpenLoginHint();
        } else {
            setShowScanner(true);
        }
    };

    // 處理關閉掃描器 - 使用 useCallback 避免不必要的重新渲染
    const handleCloseScanner = useCallback(() => {
        // 延遲設置 showScanner 為 false，讓淡出動畫有時間完成
        setTimeout(() => {
            setShowScanner(false);
            // 重置掃描成功狀態
            if (scanSuccess) {
                setScanSuccess(false);
            }
        }, 500); // 與 CSSTransition 的 timeout 相同
    }, [scanSuccess]);

    // 關閉掃描結果顯示
    const handleCloseScanResult = useCallback(() => {
        setShowScanResult(false);
        setTimeout(() => {
            setScanResultInfo(null);
            setScanStampInfo(null);
    }, 1000)

    }, []);

    // 處理掃描成功
    const handleStampSuccess = useCallback((response, stampInfo) => {
        console.log("集章成功，回應:", response);
        console.log("印章信息:", stampInfo);
        setScanSuccess(true);

        // 設置掃描結果資訊
        setScanResultInfo(response);
        setScanStampInfo(stampInfo);
        setShowScanResult(true);

        // 如果是從 URL 參數獲取的印章 ID，成功後清除 URL 中的印章 ID
        if (urlStampId) {
            // 使用 history.replaceState 更新 URL，但不觸發頁面重新載入
            window.history.replaceState({}, "", "/stamps");
            setUrlStampId(null);
        }

        // 關閉掃描器 (如果開啟的話)
        if (showScanner) {
            handleCloseScanner();
        }

        // 只更新用戶已收集的印章數據，不重新獲取所有印章
        const refreshData = async () => {
            if (localStorage.getItem("accessToken") != null) {
                await fetchStampCollects();
            }
        };

        refreshData();

    }, [urlStampId, showScanner, handleCloseScanner]);

    // 處理錯誤
    const handleStampError = useCallback((error, stampInfo) => {
        console.error("集章失敗:", error);

        // 特別處理400錯誤（已收集過的印章）
        if (error.response && error.response.status === 400 ||
            (typeof error.response?.data?.message === 'string' && error.response?.data?.message.includes("已收集")) ||
            (typeof error.message === 'string' && error.message.startsWith("ALREADY_COLLECTED:"))) {

            // 設置為"已收集過"錯誤，顯示相應信息
            setScanResultInfo({
                status: 'already_collected',
                message: '此印章已收集過'
            });
            setScanStampInfo(stampInfo);
            setShowScanResult(true);

            // 關閉掃描器 (如果開啟的話)
            if (showScanner) {
                handleCloseScanner();
            }

        } else if (error.message === 'INVALID_QR_CODE') {
            // 處理無效QR碼的情況
            setScanResultInfo({
                status: 'invalid_qr_code',
                message: '無效的QR碼'
            });
            setScanStampInfo(null);
            setShowScanResult(true);
            
            // 關閉掃描器 (如果開啟的話)
            if (showScanner) {
                handleCloseScanner();
            }
        }

        // 如果是從 URL 參數獲取的印章 ID，錯誤後也清除 URL 中的印章 ID
        if (urlStampId) {
            window.history.replaceState({}, "", "/stamps");
            setUrlStampId(null);
        }
    }, [urlStampId, showScanner, handleCloseScanner]);

    // 獲取並顯示組別詳細資料
    const fetchGroupData = async (stampName) => {
        try {
            let cardsData = cards;

            // 只有當 cards 為空時才進行 API 請求
            if (cards.length === 0) {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                let responseData;

                if (window.preloadedData && window.preloadedData.groupData) {
                    responseData = window.preloadedData.groupData;
                } else {
                    console.log("從 API 獲取組別數據");
                    const response = await axios.post(
                        `${apiBaseUrl}/fe/group/search`,
                        {
                            pageSize: 25,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    responseData = response.data;
                }

                // 處理文字內容
                cardsData = responseData._data.map(card => ({
                    id: card.id,
                    logo_id: card.logo_id,
                    category: mapGenreToCategory(card.genre),
                    img: "", // 先設置為空，稍後再載入
                    title: card.work_name,
                    content: card.short_description,
                    secondTitle: card.name,
                    detailedContent: card.description,
                    member: parseJsonArray(card.member),
                    teachers: parseJsonArray(card.tutor),
                    media: mediaArray(card.media),
                    imageLoading: !!card.logo_id,
                }));

                // 保存處理後的數據到 cards 狀態
                setCards(cardsData);
            } else {
                console.log("使用緩存的組別數據");
            }

            // 從 cardsData 中找到匹配的卡片
            const matchedCard = cardsData.find(card => card.title === stampName);
            if (matchedCard) {
                // 檢查卡片是否已經有圖片
                if (!matchedCard.img && matchedCard.logo_id) {
                    // 創建一個新的卡片對象以避免修改 cards 中的原始數據
                    const cardWithImageLoading = { ...matchedCard };
                    setFocusedCard(cardWithImageLoading);
                    setShowFocusCard(true);

                    // 載入圖片
                    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                    loadCardImage(cardWithImageLoading, apiBaseUrl);
                } else {
                    // 卡片已有圖片或沒有圖片需要載入
                    setFocusedCard(matchedCard);
                    setShowFocusCard(true);
                }
            } else {
                console.error(`未找到標題為 "${stampName}" 的卡片`);
            }
        } catch (error) {
            console.error("獲取或處理組別資料失敗: ", error);
        }
    };

    // 載入卡片圖片
    const loadCardImage = async (card, apiBaseUrl) => {
        try {
            const imgResponse = await axios.get(
                `${apiBaseUrl}/fe/file/download/${card.logo_id}`,
                {
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                    responseType: "blob",
                }
            );

            const imageURL = URL.createObjectURL(imgResponse.data);

            // 更新焦點卡片的圖片
            setFocusedCard(prev => ({
                ...prev,
                img: imageURL,
                imageLoading: false
            }));
        } catch (imgError) {
            console.error(`無法下載圖片 (logo_id: ${card.logo_id})`, imgError);

            // 標記圖片載入失敗
            setFocusedCard(prev => ({
                ...prev,
                imageLoading: false
            }));
        }
    };

    // 當用戶未登入時的處理
    const handleLoginRequired = useCallback(() => {
        handleOpenLoginHint();

        // 清除 URL 中的印章 ID
        if (urlStampId) {
            window.history.replaceState({}, "", "/stamps");
            setUrlStampId(null);
        }
    }, [urlStampId]);

    // 處理開啟兌獎對話框
    const handleOpenRedeemDialog = () => {
        if (!onDate) {
            handleOpenNotYetHint();
            return;
        }

        if (localStorage.getItem("accessToken") == null) {
            handleOpenLoginHint();
        } else {
            setShowRedeemDialog(true);
        }
    };

    // 處理關閉兌獎對話框
    const handleCloseRedeemDialog = useCallback(() => {
        setShowRedeemDialog(false);
    }, []);

    // 處理開啟提示對話框
    const handleOpenHint = () => {
        setShowHint(true);
    };

    // 處理關閉提示對話框
    const handleCloseHint = useCallback(() => {
        setShowHint(false);
    }, []);

    // 處理開啟登入提示彈出層
    const handleOpenLoginHint = () => {
        setShowLoginHint(true);
    };

    // 處理關閉登入提示彈出層
    const handleCloseLoginHint = () => {
        setShowLoginHint(false);
    };

    // 處理開啟焦點卡片彈出層
    const handleOpenFocusCard = (stampName) => {
        fetchGroupData(stampName);
    };

    // 處理關閉焦點卡片彈出層
    const handleCloseFocusCard = () => {
        setShowFocusCard(false);
        // 不再立即清除焦點卡片數據，而是等待動畫完成後由 onExited 回調處理
    };

    // 處理開啟介紹提示彈出層
    const handleOpenIntroHint = () => {
        setShowIntroHint(true);
    };

    // 處理關閉介紹提示彈出層
    const handleCloseIntroHint = () => {
        setShowIntroHint(false);
    };

    // 處理開啟未開放提示彈出層
    const handleOpenNotYetHint = () => {
        setShowNotYetHint(true);
    };

    // 處理關閉未開放提示彈出層
    const handleCloseNotYetHint = () => {
        setShowNotYetHint(false);
    };

    // 將印章按類別排序
    const stampsDataSorted = stamps.reduce((acc, stamp) => {
        const { genre } = stamp;
        if (!acc[genre]) {
            acc[genre] = [];
        }
        acc[genre].push(stamp);
        return acc;
    }, {});

    // 在組件掛載時解析 URL 參數並初始化
    useEffect(() => {
        // 綁定鍵盤事件
        window.addEventListener("keydown", (e) => {
            if (e.key === "h") {
                handleOpenHint();
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "g") {
                localStorage.setItem("hideIntroHint", false);
                localStorage.setItem("allCollected", false);
            }
        });

        // 檢查URL參數是否包含印章ID
        const searchParams = new URLSearchParams(location.search);
        const stampParam = searchParams.get('stampid');

        // 檢查路徑是否包含印章ID
        const pathParts = location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'stamps') {
            const stampId = pathParts[3];
            if (stampId && stampId.trim() !== '') {
                console.log(`從路徑獲取到印章 ID: ${stampId}`);
                setUrlStampId(stampId);
            }
        } else if (stampParam) {
            console.log("從 URL 參數獲取印章 ID:", stampParam);
            setUrlStampId(stampParam);
        }

        // 獲取初始數據
        if (localStorage.getItem("accessToken") != null) {
            fetchStampCollects();
        }
        fetchStamps();

        setUrlParamsProcessed(true);

        // 清理事件監聽器
        return () => {
            window.removeEventListener("keydown", (e) => {
                if (e.key === "h") handleOpenHint();
            });
            window.removeEventListener("keydown", (e) => {
                if (e.key === "g") localStorage.setItem("hideIntroHint", false);
            });
        };
    }, [location]);

    /**
     * 處理來自 URL 的印章 ID
     * 為防止重複執行，使用 urlParamsProcessed 和 urlProcessStarted 狀態
     */
    useEffect(() => {
        if (urlParamsProcessed && urlStampId && !urlProcessStarted && stamps.length > 0) {
            setUrlProcessStarted(true);
            console.log("處理 URL 印章 ID:", urlStampId);
        }
    }, [urlParamsProcessed, urlStampId, urlProcessStarted, stamps]);

    // 顯示介紹提示相關邏輯
    useEffect(() => {
        if (localStorage.getItem("hideIntroHint") !== "true") {
            setShowIntroHint(true);
        }

        // 檢測今天是否已到2025/4/7
        const today = new Date();
        const targetDate = new Date('2025-04-07');
        
        // 在開發模式下不啟用，在生產環境下啟用
        if (import.meta.env.PROD && today <= targetDate) {
            setShowNotYetHint(true);
            setOnDate(false);
        } else {
            setShowNotYetHint(false);
            setOnDate(true);
        }
        console.log("Date: ", today);
        console.log("Environment: ", import.meta.env.MODE);
    }, []);

    useEffect(() => {
        if (currentCount > 1 && currentCount % 7 == 0) {
            handleOpenHint();
        }
        if (currentCount == 22 && localStorage.getItem("allCollected") !== "true") {
            localStorage.setItem("allCollected", true);
            handleOpenHint();
            console.log("allCollected: ", localStorage.getItem("allCollected"));
        }
    }, [currentCount]);

    // 獲取URL中的印章ID
    useEffect(() => {
        // 確保只處理一次URL參數
        if (urlProcessStarted) return;
        setUrlProcessStarted(true);

        const pathParts = location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'stamps') {
            const stampId = pathParts[2]; // 修正為索引2
            if (stampId && stampId.trim() !== '') {
                console.log(`從路徑獲取到印章 ID: ${stampId}`);
                setUrlStampId(stampId);
            }
        }
    }, [location, urlProcessStarted, setUrlStampId]);

    return (
        <div className="lg:flex text-white lg:justify-center lg:items-center px-5 lg:px-[clamp(5.375rem,-6.7679rem+18.9732vw,16rem)] 2xl:gap-[96px] w-full">
            <div className="w-full lg:h-screen lg:gap-9 2xl:gap-24 max-w-[1600px] flex flex-col lg:flex-row">
                <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
                    <div className="block-content flex flex-col justify-center items-center mt-20 lg:mt-24">
                        <ProgressBar currentCount={currentCount} totalStamps={totalStamps} />
                        <div className="flex flex-col w-full max-w-[280px] lg:max-w-[360px] 2xl:max-w-[420px] mt-[-4px]">
                            {/* 兩個圓形圖示按鈕區塊 */}
                            <div className="flex justify-between">
                                {/* 兌獎按鈕 - 修改為可點擊按鈕 */}
                                <div className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity" onClick={handleOpenRedeemDialog}>
                                    <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                                        <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                                        <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                                        <img className="z-10 w-9 2xl:w-12" src="/Stamps/gifts.svg" alt="" />
                                    </div>
                                    <p className="text-[14px] lg:text-[20px] opacity-80">兌獎</p>
                                </div>
                                {/* 集章按鈕 - 修改為可點擊按鈕 */}
                                <div className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity" onClick={handleOpenScanner}>
                                    <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                                        <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                                        <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                                        <img className="z-10 w-9 2xl:w-12" src="/Stamps/qr_codes.svg" alt="" />
                                    </div>
                                    <p className="text-[14px] lg:text-[20px] opacity-80">集章</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
                    <div className="block-content flex flex-col items-center lg:items-start gap-3 my-8 mb-24 lg:my-[max(20vh,96px)]">
                        {Object.entries(stampsDataSorted).map(([genre, stamps]) => (
                            genre !== "其他" ? (
                                <GroupBlock
                                    key={genre}
                                    catagory={genre}
                                    num={stamps.filter(stamp => stampCollects.some(collect => collect.stamp_id === stamp.id)).length}
                                    total={stamps.length}
                                    stamps={stamps}
                                >
                                    {stamps.map((stamp, index) => (
                                        stampCollects.find(stampCollect => stampCollect.stamp_id === stamp.id) ? (
                                            <GroupBlockItem key={index} name={stamp.name} icon={stamp.icon} collected={true} onClick={() => handleOpenFocusCard(stamp.name)} />) : (
                                            <GroupBlockItem key={index} name={stamp.name} icon={stamp.icon} collected={false} onClick={() => handleOpenFocusCard(stamp.name)} />)

                                    ))}
                                </GroupBlock>
                            ) : (
                                currentCount == 21 ? (
                                    <div key="final-stamp" className="w-full max-w-[540px] flex flex-col justify-center items-center p-8">
                                        <h2 className="text-[36px] mb-2 text-center font-bold" style={{ fontFamily: "B" }}>最終章點！</h2>
                                        <p className="text-[20px] mb-6 text-center text-secondary-color">填寫意見回饋，搜集第22個章以獲得抽獎資格！</p>
                                        <Link to="/feedback" className="primary-button text-white px-4 py-2 rounded-lg">意見回饋</Link>
                                    </div>
                                ) : null
                            )
                        ))}
                        <div className="max-w-[540px] flex w-full mt-4">
                            <button onClick={handleOpenIntroHint} className=" text-white mx-auto px-4 py-2 rounded-lg opacity-80 underline underline-offset-2 hover:opacity-100">
                                獎品及規則 ?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR 掃描器彈出層 - 使用更長的過渡時間 */}
            <CSSTransition in={showScanner} timeout={500} classNames="qr-scanner" unmountOnExit mountOnEnter>
                <QRScanner
                    onClose={handleCloseScanner}
                    onScanSuccess={handleStampSuccess}
                    onScanError={handleStampError}
                    stamps={stamps}
                />
            </CSSTransition>

            {/* 兌獎對話框彈出層 */}
            <CSSTransition in={showRedeemDialog} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <Redeem currentCount={currentCount} onClose={handleCloseRedeemDialog} handleOpenLuckyDrawHint={handleOpenLuckyDrawHint} />
            </CSSTransition>

            {/* 提示對話框彈出層 */}
            <CSSTransition in={showHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <CountHint currentCount={currentCount} onClose={handleCloseHint} handleOpenRedeemDialog={handleOpenRedeemDialog} />
            </CSSTransition>

            {/* 登入提示彈出層 */}
            <CSSTransition in={showLoginHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <LoginHint onClose={handleCloseLoginHint} />
            </CSSTransition>

            {/* 介紹提示彈出層 */}
            <CSSTransition in={showIntroHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <IntroHint onClose={handleCloseIntroHint} />
            </CSSTransition>

            {/* 未開放提示彈出層 */}
            <CSSTransition in={showNotYetHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <NotYetHint onClose={handleCloseNotYetHint} />
            </CSSTransition>

            {/* 抽獎提示彈出層 */}
            <CSSTransition in={showLuckyDrawHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <LuckyDrawHint onClose={handleCloseLuckyDrawHint} result={luckyDrawResult} />
            </CSSTransition>

            {/* 焦點卡片 */}
            <>
                {/* 背景遮罩 */}
                <CSSTransition
                    in={showFocusCard}
                    nodeRef={overlayRef}
                    timeout={300}
                    classNames="overlay"
                    unmountOnExit
                    mountOnEnter
                >
                    <div
                        ref={overlayRef}
                        className="fixed inset-0 bg-black bg-opacity-40 z-[999]"
                    ></div>
                </CSSTransition>

                {/* 卡片內容 */}
                <CSSTransition
                    in={showFocusCard}
                    nodeRef={focusCardRef}
                    timeout={300}
                    classNames="modal"
                    unmountOnExit
                    mountOnEnter
                    onExited={() => setFocusedCard(null)} // 過渡結束後清除焦點卡片資料
                >
                    <div
                        ref={focusCardRef}
                        className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[1000]"
                    >
                        {focusedCard && (
                            <FocusCard
                                img={focusedCard.img}
                                title={focusedCard.title}
                                secondTitle={focusedCard.secondTitle}
                                detailedContent={focusedCard.detailedContent}
                                member={focusedCard.member}
                                teachers={focusedCard.teachers}
                                media={focusedCard.media}
                                onCancel={handleCloseFocusCard}
                            />
                        )}
                    </div>
                </CSSTransition>
            </>

            {/* 掃描結果彈出層 - 使用新的組件 */}
            <CSSTransition in={showScanResult} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <ScanResultModal
                    resultInfo={scanResultInfo}
                    stampInfo={scanStampInfo}
                    onClose={handleCloseScanResult}
                />
            </CSSTransition>

            {/* 處理 URL 中的印章 ID */}
            {urlParamsProcessed && urlStampId && urlProcessStarted && (
                <StampCollector
                    stampId={urlStampId}
                    onSuccess={handleStampSuccess}
                    onError={handleStampError}
                    onLoginRequired={handleLoginRequired}
                    autoSubmit={true}
                    stamps={stamps}
                />
            )}

        </div>
    );
};
