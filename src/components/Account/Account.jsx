import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

export const Account = ({ onClose }) => {
	// 控制對話框關閉動畫
	const [isClosing, setIsClosing] = useState(false);

	// 控制內容可見性，用於內容的縮放效果
	const [contentVisible, setContentVisible] = useState(false);

	// 使用者資訊狀態
	const [username, setUsername] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('/Auth/avatar.jpg');

	// 內容的 ref，用於 CSSTransition
	const contentRef = useRef(null);


	// 當元件掛載時，從 localStorage 獲取使用者資訊
	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
				// 解析 JWT token
				const tokenData = parseJwt(accessToken);

				// 設置使用者名稱 (根據您的 token 結構調整)
				if (tokenData.username) {
					setUsername(tokenData.username);
				} else if (tokenData.email) {
					// 如果沒有名稱，使用郵箱前綴
					setUsername(tokenData.email.split('@')[0]);
				}

				// 設置頭像 (如果 token 中有頭像 URL)
				if (tokenData.avatar) {
					setAvatarUrl(tokenData.avatar);
				}
	}, []);

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

	// 處理登出
	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		// 可選：重新載入頁面以重置應用狀態
		window.location.reload();
	};

	// 當對話框打開時，延遲顯示內容以實現分離的動畫效果
	useEffect(() => {
		const timer = setTimeout(() => {
			setContentVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// 處理背景點擊事件，僅當點擊背景而非內容時關閉
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	// 處理關閉按鈕點擊
	const handleClose = () => {
		// 先隱藏內容
		setContentVisible(false);
		// 設置關閉狀態，啟動淡出動畫
		setIsClosing(true);
		// 延遲調用關閉回調，等待內容縮放動畫完成
		setTimeout(() => {
			onClose();
		}, 300);
	};

	// 禁用背景滾動
	useEffect(() => {
		const originalStyle = window.getComputedStyle(document.body).overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []);

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-[1000]"
			onClick={handleBackdropClick}
		>
			<CSSTransition
				in={contentVisible}
				nodeRef={contentRef}
				timeout={300}
				classNames="modal"
				unmountOnExit
			>
				<div
					ref={contentRef}
					className="bg-[#361014] modal rounded-[24px] w-full max-w-md p-6 relative"
					onClick={(e) => e.stopPropagation()}
				>
					{/* 關閉按鈕 */}
					<button
						className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgba(0,0,0,0.2)] rounded-full"
						onClick={handleClose}
						aria-label="關閉"
					>
						<img
							className="w-5 h-5"
							src="/Group/close.svg"
							alt="關閉"
						/>
					</button>

					<div className='w-full h-full flex flex-col items-center justify-center py-8'>
						<div className='w-[96px] h-[96px] bg-white rounded-full overflow-hidden mb-6'>
							<img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
						</div>

						{/* 已登入狀態 */}
						<h2 className="text-white text-[36px] mb-5 text-center" style={{ fontFamily: 'B' }}>{username}</h2>
						<div className="flex flex-col gap-4 w-full">
							<Link to="/collect" onClick={handleClose} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
								我的集章
							</Link>
							<button
								onClick={handleLogout}
								className="mx-auto text-white w-fit text-center opacity-80 hover:underline"
							>
								登出
							</button>
						</div>
					</div>
				</div>
			</CSSTransition>
		</div>
	);
};
