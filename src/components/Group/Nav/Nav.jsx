import { useState } from "react";

export const Nav = ({ onFilterChange }) => {
  const [filter, setFilter] = useState("全部");

  const handleFilterChange = (newFilter) => {
    const updatedFilter = newFilter === filter ? "全部" : newFilter;
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  return (
    <div
      className={
        window.innerWidth < 1024
          ? "w-full min-w-[25rem] flex mt-[2rem] px-[1rem] space-x-[8px] overflow-x-auto whitespace-nowrap"
          : "w-full flex justify-center mt-[3rem] px-[1rem] space-x-[8px] overflow-x-auto whitespace-nowrap"
      }
      style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
    >
      {["全部", "互動", "行銷", "動畫", "遊戲", "影視"].map((item) => (
        <div
          key={item}
          className={`relative flex h-[2.25rem] rounded-[39px] items-center justify-center transition-all duration-1000 ease-in-out
          ${
            filter === item
              ? "bg-primary-color min-w-[5rem] max-w-[12rem]"
              : "bg-[#51181E] min-w-[3.5rem] max-w-[8rem]"
          }`}
          onClick={() => handleFilterChange(item)}
        >
          {filter === item ? (
            <>
              {item !== "全部" ? (
                <div className="flex w-fit justify-center items-center space-x-1 px-[22px] ">
                  <div className="text-[1rem] text-white font-medium leading-none">
                    {item}
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="/close.svg" alt="close" />
                  </div>
                </div>
              ) : (
                <div className="flex min-w-[5rem] justify-center items-center space-x-1 px-[22px] ">
                  <div className="text-[1rem] text-white font-medium leading-none">
                    {item}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-fit justify-center items-center space-x-1 px-[22px] ">
              <div className="text-[1rem] text-white font-medium leading-none ">
                {item}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
