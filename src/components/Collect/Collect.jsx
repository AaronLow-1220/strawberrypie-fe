import { useState, useCallback } from "react"; // 移除 useEffect 引入，因為已經不需要
import { CSSTransition } from "react-transition-group"; // 添加 CSSTransition 引入
import { ProgressBar } from "./ProgressBar/ProgressBar"; // 匯入進度條組件
import { GroupBlock } from "./GroupBlock"; // 匯入組別區塊組件
import { QRScanner } from "./QrCode/QRScanner"; // 匯入 QRScanner 組件
import { Redeem } from "./QrCode/Redeem"; // 匯入 Redeem 組件
import { Hint } from "./Hint/Hint"; // 匯入 Hint 組件
import { useEffect } from "react";

// 添加 CSS 樣式到檔案頂部
import "./QrCode/QRScannerTransition.css";

export const Collect = () => {
	// 定義收集的類別及對應數量
	const array = [
		{ name: "遊戲", num: 6 },
		{ name: "互動", num: 11 },
		{ name: "影視", num: 2 },
		{ name: "動畫", num: 1 },
		{ name: "行銷", num: 3 },
	];

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

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "h") {
				handleOpenHint();
			}
		});

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
				}));

				setStamps(stampsData);

				loadImagesInOrder(stampsData, apiBaseUrl);
			} catch (error) {
				console.error("獲取印章失敗: ", error);
			}
		};

		fetchStamps();
	}, []);

	const loadImagesInOrder = async (stampsData, apiBaseUrl) => {
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

	// 添加狀態來控制 QRScanner 和 RewardDialog 的顯示
	const [showScanner, setShowScanner] = useState(false);
	const [showRewardDialog, setShowRewardDialog] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [stamps, setStamps] = useState([]);
	const [loadedImages, setLoadedImages] = useState({});

	// 處理開啟掃描器
	const handleOpenScanner = () => {
		setShowScanner(true);
	};

	// 處理關閉掃描器 - 使用 useCallback 避免不必要的重新渲染
	const handleCloseScanner = useCallback(() => {
		// 延遲設置 showScanner 為 false，讓淡出動畫有時間完成
		setTimeout(() => {
			setShowScanner(false);
		}, 500); // 與 CSSTransition 的 timeout 相同
	}, []);

	// 處理開啟兌獎對話框
	const handleOpenRewardDialog = () => {
		setShowRewardDialog(true);
	};

	// 處理關閉兌獎對話框
	const handleCloseRewardDialog = useCallback(() => {
		setShowRewardDialog(false);
	}, []);

	// 處理開啟提示對話框
	const handleOpenHint = () => {
		setShowHint(true);
	};

	// 處理關閉提示對話框
	const handleCloseHint = useCallback(() => {
		setShowHint(false);
	}, []);

	// 假設目前集到的張數與總數
	const currentCount = 5;
	const totalStamps = 22;

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
								<div className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity" onClick={handleOpenRewardDialog}>
									<div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
										<div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
										<div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
										<img className="z-10 w-9 2xl:w-12" src="/Collect/gifts.svg" alt="" />
									</div>
									<p className="text-[14px] lg:text-[20px] opacity-80">兌獎</p>
								</div>
								{/* 集章按鈕 - 修改為可點擊按鈕 */}
								<div className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity" onClick={handleOpenScanner}>
									<div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
										<div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
										<div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
										<img className="z-10 w-9 2xl:w-12" src="/Collect/qr_codes.svg" alt="" />
									</div>
									<p className="text-[14px] lg:text-[20px] opacity-80">集章</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
					<div className="block-content flex flex-col items-center lg:items-start gap-3 my-8 mb-24 lg:my-[max(20vh,96px)]">
						{/* {array.map((item, index) => (
							<GroupBlock key={index} num={item.num} /> // 渲染各組區塊
						))} */}
						{stamps.map((stamp, index) => (
							<GroupBlock
								key={index}
								name={stamp.name}
								num={stamp.num}
								icon={stamp.icon}
								imageLoading={stamp.imageLoading}
							/>
						))}
					</div>
				</div>
			</div>

			{/* QR 掃描器彈出層 - 使用更長的過渡時間 */}
			<CSSTransition in={showScanner} timeout={500} classNames="qr-scanner" unmountOnExit mountOnEnter>
				<QRScanner onClose={handleCloseScanner} />
			</CSSTransition>

			{/* 兌獎對話框彈出層 */}
			<CSSTransition in={showRewardDialog} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
				<Redeem onClose={handleCloseRewardDialog} />
			</CSSTransition>

			<CSSTransition in={showHint} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
				<Hint currentCount={currentCount} onClose={handleCloseHint} handleOpenRewardDialog={handleOpenRewardDialog} />
			</CSSTransition>
		</div>
	);
};
