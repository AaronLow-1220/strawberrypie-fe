import React, { useState } from 'react'

const navList = ["全部", "互動", "行銷", "動畫", "遊戲", "影視"]

export const Nav = ({ onFilterChange }) => {
	const [filter, setFilter] = useState("全部")

	const handleFilterChange = (newFilter) => {
		const updatedFilter = newFilter === filter ? "全部" : newFilter;
		setFilter(updatedFilter);
		if (onFilterChange) {
			onFilterChange(updatedFilter);
		}
	}

	return (
		<div className='px-[20px] mt-[72px] mb-[48px] lg:mb-[24px] 2xl:mb-[42px] lg:mt-[120px] lg:justify-center text-white flex space-x-[8px] sticky top-[64px] md:top-[0px] scroll-px-5 snap-x overflow-x-scroll whitespace-nowrap'>
			{navList.map((item) => (
				<button
					key={item}
					onClick={() => handleFilterChange(item)}
					className={`
            flex items-center px-[22px] py-[6px] rounded-[50px] snap-start transition-all duration-300 ease-in-out
            ${filter === item ? `bg-primary-color gap-[4px] ${item !== "全部" && "pr-[12px]"}` : "bg-[#51181E] hover:bg-[#83181E]"}
          `}
				>
					<p className='text-base'>{item}</p>

					{item !== "全部" && (
						<img className={`transition-all duration-300 ease-in-out
          ${filter === item ? "w-[20px]" : "w-[0px]"}`}
							src="/filter-close.svg" alt="close" />
					)}
				</button>
			))}
		</div>
	)
}