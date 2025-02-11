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
          : "w-full  flex justify-center mt-[3rem] px-[1rem] space-x-[8px] overflow-x-auto whitespace-nowrap"
      }
      style={{ scrollbarWidth: "none" }}
    >
      {["全部", "互動", "行銷", "動畫", "遊戲", "影視"].map((item) => (
        <div
          key={item}
          className={
            filter === item
              ? "min-w-[4.75rem] h-[2.25rem] bg-primary-color rounded-[39px] flex items-center justify-center transition-all duration-500 ease-in-out"
              : "min-w-[4.75rem] h-[2.25rem] bg-[#51181E] rounded-[39px] flex items-center justify-center transition-all duration-500 ease-in-out"
          }
          onClick={() => handleFilterChange(item)}
        >
          {filter === item ? (
            <div className="flex w-full justify-center items-center space-x-1">
              <div
                className="text-[1rem] text-white "
                style={{ fontFamily: "B" }}
              >
                {item}
              </div>
              {item !== "全部" && (
                <div>
                  <img src="/close.svg" alt="" />
                </div>
              )}
            </div>
          ) : (
            <div
              className="text-[1rem] text-white "
              style={{ fontFamily: "B" }}
            >
              {item}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
