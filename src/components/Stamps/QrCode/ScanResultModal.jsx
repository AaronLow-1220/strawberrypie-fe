import { ModalTemplate } from '../ModalTemplate';

// 掃描結果彈出視窗組件
export const ScanResultModal = ({ resultInfo, stampInfo, onClose }) => {
	return (
		<ModalTemplate onClose={onClose}>
			{resultInfo?.status === 'invalid_qr_code' ? (
				<div className="flex flex-col items-center justify-center">
					<p className="font-bold mb-4 text-[32px] text-center" style={{ fontFamily: "B" }}>(⁠ノ⁠｀⁠Д⁠´⁠)⁠ノ</p>
					<p className="text-secondary-color text-center text-[18px]">哩洗勒</p>
				</div>
			) : stampInfo ? (
				<div className="flex flex-col items-center justify-center">
					{/* 顯示印章圖片和名稱 */}
					<div className="flex flex-col items-center">
						<div className="absolute top-0 translate-y-[-50%] w-32 h-32 mb-2 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[0_6px_12px_0_rgba(0,0,0,0.2)]">
							{stampInfo.icon ? (
								<img
									src={stampInfo.icon}
									alt={stampInfo.name || "印章圖示"}
									className="w-full h-full scale-75 invert"
								/>
							) : (
								<div className="text-gray-400 text-sm flex items-center justify-center h-full w-full">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							)}
						</div>
						<p className="font-bold mt-12 mb-2 text-[32px] text-center" style={{ fontFamily: "B" }}>{stampInfo.name || "未知印章"}</p>
					</div>
					{/* 顯示印章資訊和狀態 */}
					{resultInfo?.status === 'already_collected' ? (
						<p className="text-secondary-color text-center text-[18px]">此印章已收集過，你少來 (`へ´≠)</p>
					) : (
						<p className="text-secondary-color text-center text-[18px]">成功搜集！</p>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
					<p className="font-bold mb-4 text-[32px] text-center" style={{ fontFamily: "B" }}>¯⁠\⁠_⁠ಠ⁠_⁠ಠ⁠_⁠/⁠¯</p>
					<p className="text-secondary-color text-center text-[18px]">你在玩我嗎 ?</p>
				</div>
			)}

		</ModalTemplate>
	);
};

export default ScanResultModal; 