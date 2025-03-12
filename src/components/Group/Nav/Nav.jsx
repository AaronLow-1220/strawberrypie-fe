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
		<div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] sticky md:relative top-[64px] md:top-[0px] z-10">
			<div className={`groups__nav group-padding mt-[72px] md:mt-[88px] lg:mt-[120px] scrollbar-hide lg:mb-[24px] md:justify-center text-white flex space-x-[8px] scroll-px-5 snap-x overflow-x-scroll whitespace-nowrap transition-all duration-300 ease-in-out
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
          ${filter === item ? "w-[20px]" : "w-[0px] opacity-0"}`}
								src="/filter-close.svg" alt="close" />
						)}
					</button>
				))}
			</div>
		</div>
	)
}