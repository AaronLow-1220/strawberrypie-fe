import React from 'react'

const navList = ["全部", "互動", "行銷", "動畫", "遊戲", "影視"]

export const Nav = ({ filter, onFilterChange }) => {
	const handleFilterChange = (newFilter) => {
		const updatedFilter = newFilter === filter ? "全部" : newFilter;
		if (onFilterChange) {
			onFilterChange(updatedFilter);
		}
	}

	return (
		<div className={`z-10 group-padding mt-[72px] scrollbar-hide lg:mb-[24px]  lg:mt-[120px] lg:justify-center text-white flex space-x-[8px] sticky lg:relative top-[64px] lg:top-[0px] scroll-px-5 snap-x overflow-x-scroll whitespace-nowrap transition-all duration-300 ease-in-out
		${filter === "全部" ? "mb-[48px] 2xl:mb-[42px]" : "mb-[24px] lg:mb-[36px] 2xl:mb-[42px]"}`}>
			{navList.map((item) => (
				<button
					key={item}
					onClick={() => handleFilterChange(item)}
					className={`
            flex items-center px-[22px] py-[6px] min-w-fit rounded-[50px] snap-start transition-all duration-300 ease-in-out
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