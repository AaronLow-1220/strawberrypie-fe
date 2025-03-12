import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FontFaceObserver from "fontfaceobserver";
//header
import { Header } from "./components/Header";
//Test
import { PsychometricTest } from "./components/PsychometricTest/Main";
//HomePage
import { HomePage } from "./components/HomePage/Main";
//Group
import { Group } from "./components/Group/Main";
//Result
import { Result } from "./components/Result/Main";

import { Collect2 } from "./components/Collect/Main2";

import { HeaderProvider } from "./components/HeaderContext";

import { ComingSoon } from "./components/ComingSoon";

import { Callback } from "./components/Account/Callback";

// Loading
import { Loading } from "./components/Loading";

//Account
import { LogIn } from "./components/Account/LogIn";
import { Register } from "./components/Account/Register";
import { ForgetPassword } from "./components/Account/ForgetPassword";

// 預載檔案列表 - 可以在這裡添加你需要預載的所有檔案
const PRELOAD_ASSETS = {
	// 字體列表
	fonts: [
		{ name: 'Thin', family: 'Thin' },
		{ name: 'B', family: 'B' },
		{ name: 'R', family: 'R' }
	],
	
	// 關鍵圖片列表
	images: [
		'/strawberry.svg',
		'/arrow_forward_ios.svg',
		'/Auth/Google-icon.svg',
		'/Auth/visibility_on.svg',
		'/Auth/visibility_off.svg',
		'/IPs/互動.png',
		'/IPs/遊戲.png',
		'/IPs/影視.png',
		'/IPs/行銷.png',
		'/IPs/動畫.png',
		'/HomePage/Background_web.jpg',
		'/Header/Headline.svg'
		// 在這裡添加更多需要預載的圖片
	],
	
	// 3D 模型和其他特殊檔案
	models: [
		'/GT_Scene.glb',
		// 在這裡添加更多需要預載的 3D 模型或特殊檔案
	],
	
	// API 請求列表 - 預載 API 數據
	apis: [
		{
			name: '組別介紹', 
			url: `${import.meta.env.VITE_API_BASE_URL}/fe/group/search`, 
			method: 'POST',
			body: { pageSize: 25 },
			headers: { 'Content-Type': 'application/json' },
			// 數據緩存鍵（用於存儲和檢索）
			cacheKey: 'groupData'
		}
		// 在這裡添加更多需要預載的 API
	]
};

// 全局數據存儲 - 用於存儲預載的 API 數據
window.preloadedData = window.preloadedData || {};
// 用於存儲預載的模型和特殊檔案
window.preloadedModels = window.preloadedModels || {};

function App() {
	const [animate, setAnimate] = useState(false);
	const [focus, setFocus] = useState(false);
	// 控制 Header 顯示的狀態
	const [showHeader, setShowHeader] = useState(true);
	// 控制載入頁面的顯示
	const [isLoading, setIsLoading] = useState(true);
	// 載入進度
	const [loadingProgress, setLoadingProgress] = useState(0);
	// 載入文字
	const [loadingText, setLoadingText] = useState("正在準備您的專屬體驗...");

	// 載入字體和其他必要資源
	useEffect(() => {
		const loadResources = async () => {
			try {
				// 計算預載資源總數
				const totalResources = 
					PRELOAD_ASSETS.fonts.length + 
					PRELOAD_ASSETS.images.length + 
					(PRELOAD_ASSETS.models?.length || 0) +
					PRELOAD_ASSETS.apis.length;
				
				let loadedResources = 0;
				
				// 更新載入進度的函數
				const updateProgress = (loaded, total, type) => {
					loadedResources++;
					const newProgress = (loadedResources / totalResources) * 100;
					setLoadingProgress(newProgress);
					setLoadingText(`正在載入${type}... (${loaded}/${total})`);
					console.log(`載入進度: ${newProgress.toFixed(2)}%, 正在載入${type}... (${loaded}/${total})`);
				};
				
				// 1. 載入字體
				setLoadingText("正在載入字體...");
				const fonts = PRELOAD_ASSETS.fonts;
				
				for (let i = 0; i < fonts.length; i++) {
					const font = fonts[i];
					try {
						console.log(`開始載入字體: ${font.name}`);
						const observer = new FontFaceObserver(font.family);
						await observer.load(null, 5000); // 確保等待字體載入完成
						console.log(`字體 ${font.name} 已載入完成`);
					} catch (error) {
						console.warn(`字體 ${font.name} 載入失敗:`, error);
					}
					updateProgress(i + 1, fonts.length, "字體");
				}
				
				// 2. 載入圖片
				setLoadingText("正在載入圖片...");
				const images = PRELOAD_ASSETS.images;
				
				const imagePromises = images.map((src, index) => {
					return new Promise((resolve) => {
						const img = new Image();
						img.onload = () => {
							updateProgress(index + 1, images.length, "圖片");
							resolve(src);
						};
						img.onerror = () => {
							console.warn(`無法載入圖片: ${src}`);
							updateProgress(index + 1, images.length, "圖片");
							resolve(null); // 即使失敗也繼續
						};
						img.src = src;
					});
				});
				
				// 等待圖片載入
				await Promise.all(imagePromises);
				console.log('圖片已載入完成');
				
				// 2.5 載入 3D 模型和特殊檔案
				if (PRELOAD_ASSETS.models && PRELOAD_ASSETS.models.length > 0) {
					setLoadingText("正在載入模型...");
					const models = PRELOAD_ASSETS.models;
					
					for (let i = 0; i < models.length; i++) {
						const modelPath = models[i];
						try {
							// 使用 fetch 預載模型檔案
							const response = await fetch(modelPath);
							if (!response.ok) {
								throw new Error(`模型載入失敗: ${response.status}`);
							}
							
							// 獲取檔案的二進制數據
							const blob = await response.blob();
							
							// 創建一個 URL 以便後續使用
							const objectUrl = URL.createObjectURL(blob);
							
							// 從路徑中提取檔案名作為鍵
							const fileName = modelPath.split('/').pop();
							
							// 存儲在全局對象中
							window.preloadedModels[fileName] = {
								blob: blob,
								url: objectUrl
							};
							
							console.log(`模型已預載: ${modelPath}`);
						} catch (error) {
							console.warn(`無法預載模型: ${modelPath}`, error);
						}
						
						updateProgress(i + 1, models.length, "模型");
					}
					
					console.log('所有模型已預載完成');
				}
				
				// 3. 預載 API 數據
				setLoadingText("正在載入內容...");
				const apis = PRELOAD_ASSETS.apis;
				
				for (let i = 0; i < apis.length; i++) {
					const api = apis[i];
					try {
						const response = await fetch(api.url, {
							method: api.method || 'GET',
							headers: api.headers || {},
							body: api.method === 'POST' ? JSON.stringify(api.body) : undefined
						});
						
						if (!response.ok) {
							throw new Error(`API 請求失敗: ${response.status}`);
						}
						
						const data = await response.json();
						
						// 將 API 數據存儲在全局數據存儲中
						if (api.cacheKey) {
							window.preloadedData[api.cacheKey] = data;
							console.log(`API ${api.name} 數據已預載並緩存在 window.preloadedData.${api.cacheKey}`);
						}
					} catch (error) {
						console.warn(`API ${api.name} 預載失敗:`, error);
					}
					
					updateProgress(i + 1, apis.length, "內容");
				}
				
				// 確保載入畫面顯示足夠長時間
				setLoadingProgress(100);
				setLoadingText("準備完成，即將進入...");
				await new Promise(resolve => setTimeout(resolve, 500));
				
				// 隱藏載入頁面
				setIsLoading(false);
			} catch (error) {
				console.error('資源載入失敗:', error);
				setLoadingProgress(100);
				setLoadingText("部分資源載入失敗，正在進入應用...");
				// 即使載入失敗，也在超時後繼續顯示網站
				setTimeout(() => {
					setIsLoading(false);
				}, 1000);
			}
		};
		
		loadResources();
	}, []);

	// Logo 動畫觸發方法
	const handleLogoAnimation = () => {
		setAnimate(true);
	};

	const handleFocus = (target) => {
		setFocus(target);
	};

	return (
		<>
			{isLoading ? (
				<Loading progress={loadingProgress} loadingText={loadingText} />
			) : (
				<HeaderProvider>
					<Router>
						{/* 只有當 showHeader 為 true 時才顯示 Header */}
						{showHeader && (
							<div className={`${focus == true ? "opacity-[60%]" : ""} relative z-20`}>
								<Header />
							</div>
						)}
						<Routes>
							<Route path="/" element={<HomePage handleLogoAnimation={handleLogoAnimation} setShowHeader={setShowHeader} />} />
							<Route path="/psychometric-test" element={<PsychometricTest />} />
							<Route path="/groups" element={<Group focus={handleFocus} />} />
							<Route path="/result/:id" element={<Result />} />
							{/* <Route path="/collect" element={<Collect2 />} /> */}
							<Route path="/collect" element={<ComingSoon />} />
							<Route path="/feedback" element={<ComingSoon />} />
							<Route path="/login" element={<LogIn />} />
							<Route path="/register" element={<Register />} />
							<Route path="/auth/callback" element={<Callback />}></Route>
							<Route path="/forget-password" element={<ForgetPassword />}></Route>
						</Routes>
					</Router>
				</HeaderProvider>
			)}
		</>
	);
}

export default App;
