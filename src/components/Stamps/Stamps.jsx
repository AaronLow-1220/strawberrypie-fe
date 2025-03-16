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
import { Redeem } from "./QrCode/Redeem"; // 匯入 Redeem 組件
import { CountHint } from "./Hint/CountHint"; // 匯入 Hint 組件
import axios from "axios";
import { StampCollector } from "./QrCode/StampCollector";

// 添加 CSS 樣式到檔案頂部
import "./QrCode/QRScannerTransition.css";

export const Stamps = () => {

    // 假設目前集到的張數與總數
    const currentCount = 20;
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

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "h") {
                handleOpenHint();
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "g") {
                localStorage.clear("hideIntroHint");
            }
        });

        // 檢查 URL 路徑是否包含印章 ID
        const pathParts = location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'stamps') {
            const stampId = pathParts[2];
            if (stampId && stampId.trim() !== '') {
                console.log(`從 URL 獲取到印章 ID: ${stampId}`);
                setUrlStampId(stampId);
            }
        }
        setUrlParamsProcessed(true);

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
                            userId: parseJwt(localStorage.getItem("accessToken")).id,
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

                setStampCollects(stampCollectsData);
            } catch (error) {
                console.error("獲取印章失敗: ", error);
            }
        }

        fetchStampCollects();
        fetchStamps();
    }, [location.pathname]); // 添加 location.pathname 作為依賴

    const parseJsonArray = (jsonString) => {
        try {
            const obj = JSON.parse(jsonString);
            return Object.values(obj);
        } catch (error) {
            console.error("解析 JSON 失敗", error);
            return [];
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

    const mediaArray = (jsonString) => {
        try {
            const obj = JSON.parse(jsonString);
            return Object.entries(obj).filter(([key, value]) => value !== "");
        } catch (error) {
            console.error("解析 media 失敗", error);
            return [];
        }
    };

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

    const stampsDataSorted = stamps.reduce((acc, stamp) => {
        const { genre } = stamp;
        if (!acc[genre]) {
            acc[genre] = [];
        }
        acc[genre].push(stamp);
        return acc;
    }, {});


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


    // 添加狀態來控制 QRScanner 和 RewardDialog 的顯示
    const [showScanner, setShowScanner] = useState(false);
    const [showRedeemDialog, setShowRedeemDialog] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [showFocusCard, setShowFocusCard] = useState(false);
    const [showLoginHint, setShowLoginHint] = useState(false);
    const [showIntroHint, setShowIntroHint] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);  // 添加掃描成功狀態
    const [urlProcessStarted, setUrlProcessStarted] = useState(false); // 追蹤是否已開始處理 URL 印章 ID

    // 處理開啟掃描器
    const handleOpenScanner = () => {
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

            // 如果掃描成功，刷新頁面數據
            if (scanSuccess) {
                setScanSuccess(false);
                fetchStamps();  // 刷新印章數據
            }
        }, 500); // 與 CSSTransition 的 timeout 相同
    }, [scanSuccess]);

    // 處理掃描成功
    const handleStampSuccess = useCallback((response) => {
        console.log("集章成功，回應:", response);
        setScanSuccess(true);

        // 如果是從 URL 參數獲取的印章 ID，成功後清除 URL 中的印章 ID
        if (urlStampId) {
            // 使用 history.replaceState 更新 URL，但不觸發頁面重新載入
            window.history.replaceState({}, "", "/stamps");
            setUrlStampId(null);
        }

        // 延遲一段時間後刷新頁面數據
        setTimeout(() => {
            fetchStamps();
        }, 500);
    }, [urlStampId]);

    // 處理錯誤
    const handleStampError = useCallback((error) => {
        console.error("集章失敗:", error);
        // 可以添加顯示錯誤訊息的邏輯

        // 如果是從 URL 參數獲取的印章 ID，錯誤後也清除 URL 中的印章 ID
        if (urlStampId) {
            window.history.replaceState({}, "", "/stamps");
            setUrlStampId(null);
        }
    }, [urlStampId]);

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

    // 處理開啟卡片彈出層
    const handleOpenFocusCard = (stampName) => {
        fetchGroupData(stampName);
    };

    // 處理關閉卡片彈出層
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

    useEffect(() => {
        if (localStorage.getItem("hideIntroHint") !== "true") {
            setShowIntroHint(true);
        }
    }, []);

    return (
        <div className="lg:flex text-white lg:justify-center lg:items-center px-5 lg:px-[clamp(5.375rem,-6.7679rem+18.9732vw,16rem)] 2xl:gap-[96px] w-full">
            {console.log(stampCollects)}
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
                                    num={stamps.length}
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
                <QRScanner onClose={handleCloseScanner} onScanSuccess={handleStampSuccess} />
            </CSSTransition>

            {/* 兌獎對話框彈出層 */}
            <CSSTransition in={showRedeemDialog} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
                <Redeem onClose={handleCloseRedeemDialog} />
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

            {/* 處理 URL 中的印章 ID */}
            {urlParamsProcessed && urlStampId && !urlProcessStarted && (
                <>
                    {setUrlProcessStarted(true)}
                    <StampCollector
                        stampId={urlStampId}
                        onSuccess={handleStampSuccess}
                        onError={handleStampError}
                        onLoginRequired={handleLoginRequired}
                        autoSubmit={true}
                    />
                </>
            )}

        </div>
    );
};
