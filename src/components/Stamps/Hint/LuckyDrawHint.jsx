import { ModalTemplate } from "../ModalTemplate";

export const LuckyDrawHint = ({ result, onClose }) => {
	// 根據result的status顯示不同的內容
	const renderContent = () => {
		if (!result) return null;

		switch (result.status) {
			case 'success':
				return (
					<>
						<h2 className="text-[36px] mb-4 text-center font-bold" style={{ fontFamily: "B" }}>成功參與抽獎 !</h2>
						<p className="text-[18px] opacity-80 mb-8 text-center">
							將於 4 月 30 號禮拜三進行 instagram 直播抽大獎，並以電子信箱的方式聯繫得主! 詳細時間會再公布於
							<a className='ps-1 inline-block underline underline-offset-2 hover:opacity-100' target='_blank' href='https://www.instagram.com/yzuic_28?igsh=ZWNvMDd6NzV4bTM1'>
							instagram: @yzuic_28
							</a>
						</p>
						<div className="flex flex-col gap-4 w-full">
							<button onClick={onClose} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
								喔耶！
							</button>
						</div>
					</>
				);

			case 'error_400':
				return (
					<>
						<h2 className="text-[36px] mb-4 text-center font-bold" style={{ fontFamily: "B" }}>ヽ(`Д´)ﾉ </h2>
						<p className="text-[18px] opacity-80 mb-6 text-center">
							你已經抽過了啦，啊捏母湯
						</p>
						<div className="flex flex-col gap-4 w-full">
							<button onClick={onClose} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
								齁...
							</button>
						</div>
					</>
				);

			case 'error_other':
			default:
				return (
					<>
						<h2 className="text-[36px] mb-3 mt-2 text-center font-bold" style={{ fontFamily: "B" }}>抽獎失敗</h2>
						<p className="text-[18px] opacity-80 mb-6 text-center">
							{result.message || "抽獎過程中發生錯誤，請稍後再試。"}
						</p>
						<div className="flex flex-col gap-4 w-full">
							<button onClick={onClose} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
								重試
							</button>
							<button
								onClick={onClose}
								className="mx-auto text-white w-fit text-center opacity-80 underline underline-offset-2 hover:opacity-100"
							>
								取消
							</button>
						</div>
					</>
				);
		}
	};

	return (
		<ModalTemplate onClose={onClose}>
			{renderContent()}
		</ModalTemplate>
	);
};