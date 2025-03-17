import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModalTemplate } from '../Stamps/ModalTemplate';
import { jwtDecode } from 'jwt-decode';

export const Account = ({ onClose }) => {
	// 使用者資訊狀態
	const [username, setUsername] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('/Auth/avatar.jpg');

	// 當元件掛載時，從 localStorage 獲取使用者資訊
	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			try {
				// 解析 JWT token
				const tokenData = jwtDecode(accessToken);

				// 設置使用者名稱 (根據您的 token 結構調整)
				if (tokenData.username) {
					// 直接使用 username，不進行拼接
					setUsername(tokenData.username);
				} else if (tokenData.email) {
					// 如果沒有名稱，使用郵箱前綴
					setUsername(tokenData.email.split('@')[0]);
				} else if (tokenData.sub) {
					// 有些 JWT 使用 sub 作為用戶標識
					setUsername(tokenData.sub);
				}

				// 設置頭像 (如果 token 中有頭像 URL)
				if (tokenData.avatar) {
					setAvatarUrl(tokenData.avatar);
				}
				
				// 輸出 token 資料以便調試
				console.log('Token 資料:', tokenData);
			} catch (error) {
				console.error('Token 解析錯誤:', error);
			}
		}
	}, []);

	// 處理登出
	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		// 可選：重新載入頁面以重置應用狀態
		window.location.reload();
	};

	return (
		<ModalTemplate onClose={onClose}>
			{/* 關閉按鈕 */}
			<button
				className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgba(0,0,0,0.2)] rounded-full"
				onClick={onClose}
				aria-label="關閉"
			>
				<img
					className="w-5 h-5"
					src="/Group/close.svg"
					alt="關閉"
				/>
			</button>

			<div className='w-full h-full flex flex-col items-center justify-center py-4'>
				<div className='w-[96px] h-[96px] bg-white rounded-full overflow-hidden mb-6'>
					<img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
				</div>

				{/* 已登入狀態 */}
				<h2 className="text-white text-[36px] mb-5 text-center" style={{ fontFamily: 'B' }}>{username}</h2>
				<div className="flex flex-col gap-4 w-full">
					<Link to="/stamps" onClick={onClose} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
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
		</ModalTemplate>
	);
};
