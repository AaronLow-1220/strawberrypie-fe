import { GroupBlockItem } from "./GroupBlockItem";
import { useState, useRef, useEffect } from "react";

export const GroupBlock = ({ num, key, stampid, name, genre, icon, imageLoading }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const bodyRef = useRef(null);
	const containerRef = useRef(null);
	const itemsRef = useRef([]);

	// 定義動畫時長常數
	const TRANSITION_DURATION = 0.33; // 秒
	const TRANSITION_TIMING = "ease";
	const TRANSITION = `${TRANSITION_DURATION}s ${TRANSITION_TIMING}`;

	// 當組件初次渲染時，確保 bodyRef 有 scrollable class
	useEffect(() => {
		if (bodyRef.current) {
			bodyRef.current.classList.add("scrollable");
		}
	}, []);

	const animateGridTransition = (expanding) => {
		const items = Array.from(bodyRef.current.children);
		const container = containerRef.current;
		const body = bodyRef.current;

		// 如果是展開，立即移除 scrollable
		if (expanding) {
			body.classList.remove("scrollable");
		}

		// 記錄初始高度和位置
		const startHeight = container.getBoundingClientRect().height;
		const bodyRect = body.getBoundingClientRect();

		// 獲取 body 的 padding
		const bodyStyle = window.getComputedStyle(body);
		const paddingLeft = parseFloat(bodyStyle.paddingLeft);

		const itemPositions = items.map((item) => {
			const rect = item.getBoundingClientRect();
			const iconEl = item.querySelector(".group-block-item__icon");
			const iconRect = iconEl.getBoundingClientRect();
			const itemStyle = window.getComputedStyle(item);

			// 根據展開狀態計算不同的 left 和 top 值
			let leftValue, topValue;

			if (expanding) {
				// 展開時的計算方式
				leftValue = rect.left - bodyRect.left + body.scrollLeft - paddingLeft - 16;
				topValue = rect.top - bodyRect.top - 24;
			} else {
				// 收合時的計算方式
				leftValue = rect.left - bodyRect.left + body.scrollLeft - paddingLeft + 8; // 減少 24px
				topValue = rect.top - bodyRect.top + 16; // 增加 12px
			}

			return {
				left: leftValue,
				top: topValue,
				width: rect.width,
				height: rect.height,
				marginRight: parseFloat(itemStyle.marginRight),
				iconWidth: iconRect.width,
				iconHeight: iconRect.height,
				iconLeft: iconRect.left - rect.left,
				iconTop: iconRect.top - rect.top,
			};
		});

		// 切換狀態
		if (expanding) {
			bodyRef.current.classList.add("expand");
		} else {
			bodyRef.current.classList.remove("expand");
		}

		// 使用 getBoundingClientRect 來獲取實際的最終高度
		const endHeight = container.getBoundingClientRect().height;
		const newBodyRect = body.getBoundingClientRect();

		// 強制重繪以確保正確的起始狀態
		container.style.height = `${startHeight}px`;
		container.offsetHeight;

		// 應用高度動畫
		requestAnimationFrame(() => {
			container.style.transition = `height ${TRANSITION}`;
			container.style.height = `${endHeight}px`;
		});

		// 處理項目位置和大小動畫
		items.forEach((item, i) => {
			const startPos = itemPositions[i];
			const finalRect = item.getBoundingClientRect();
			const iconEl = item.querySelector(".group-block-item__icon");
			const finalIconRect = iconEl.getBoundingClientRect();

			// 計算整體位置差異
			const deltaX = startPos.left - (finalRect.left - newBodyRect.left + body.scrollLeft - paddingLeft);
			const deltaY = startPos.top - (finalRect.top - newBodyRect.top);

			// 計算圖標相對於項目的位置差異
			const iconDeltaX = startPos.iconLeft - (finalIconRect.left - finalRect.left);
			const iconDeltaY = startPos.iconTop - (finalIconRect.top - finalRect.top);

			// 計算 wrapper 的縮放比例
			const wrapperScaleX = startPos.width / finalRect.width;
			const wrapperScaleY = startPos.height / finalRect.height;

			// 計算圖標的縮放比例
			const scaleX = startPos.iconWidth / finalIconRect.width;
			const scaleY = startPos.iconHeight / finalIconRect.height;

			// 設置 wrapper 的位置和縮放
			item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${wrapperScaleX}, ${wrapperScaleY})`;
			// 設置圖標的位置和縮放，但需要抵消 wrapper 的縮放效果
			iconEl.style.transform = `translate(${iconDeltaX}px, ${iconDeltaY}px) scale(${scaleX / wrapperScaleX}, ${scaleY / wrapperScaleY})`;

			item.style.transition = "none";
			iconEl.style.transition = "none";

			requestAnimationFrame(() => {
				item.style.transition = `transform ${TRANSITION}`;
				iconEl.style.transition = `transform ${TRANSITION}`;
				item.style.transform = "translate(0, 0) scale(1)";
				iconEl.style.transform = "translate(0, 0) scale(1)";
			});
		});

		// 動畫結束後清除樣式
		setTimeout(() => {
			container.style.height = "";
			container.style.transition = "";
			items.forEach((item) => {
				const iconEl = item.querySelector(".group-block-item__icon");
				item.style.transform = "";
				item.style.transition = "";
				iconEl.style.transform = "";
				iconEl.style.transition = "";
			});

			// 只在收合時添加 scrollable
			if (!expanding) {
				body.classList.add("scrollable");
			}
		}, TRANSITION_DURATION * 1000);
	};

	const handleToggle = () => {
		animateGridTransition(!isExpanded);
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="w-full rounded-[1rem] transition-all duration-500 group-block" ref={containerRef}>
			<div className="flex justify-between p-[16px_20px_0px_20px] mb-4 items-center cursor-pointer" onClick={handleToggle}>
				<div className="flex items-center">
					<div className="text-white text-[20px]" style={{ fontFamily: "B" }}>
						遊戲
					</div>
					<div className="text-secondary-color text-[20px] ms-[5px]" style={{ fontFamily: "R" }}>
						{num}/{num}
					</div>
				</div>
				<div className={`group-block__header__dropdown  ${isExpanded ? "expand" : ""}`}>
					<img src="/Collect/arrow.svg" alt="" />
				</div>
			</div>
			<div ref={bodyRef} className={`group-block__body p-[0px_20px_20px_20px] ${isExpanded ? "expand" : ""}`}>
				{Array(num)
					.fill(null)
					.map((_, index) => (
						<div key={index} ref={(el) => (itemsRef.current[index] = el)} className="item-wrapper">
							<GroupBlockItem />
						</div>
					))}
			</div>
		</div>
	);
};
