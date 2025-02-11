export const Card = ({
  img,
  title,
  content,
  secondTitle,
  TitleFontSize,
  secondTitleFontSize,
  ContentFontSize,
  selectedFilter,
}) => {
  console.log(selectedFilter);
  return (
    <div className="-z-0 max-h-[27.8125rem] max-w-[18.75rem] w-full h-auto bg-white rounded-[12px]">
      <div className="relative h-full flex flex-col justify-center group">
        <div className="w-full aspect-[4/3] overflow-hidden rounded-t-[12px]">
          <img className="w-full h-full object-cover" src={img} alt="img" />
        </div>
        <div
          className={`bg-[#361014] p-[1rem] rounded-b-[12px] flex flex-col flex-grow 
              ${
                selectedFilter == "全部"
                  ? "w-[300px] h-[215px]"
                  : "h-auto w-auto"
              }`}
        >
          <div
            className="text-secondary-color"
            style={{ fontSize: secondTitleFontSize }}
          >
            {secondTitle}
          </div>
          <div
            className="text-[#FFFFFF] leading-none mt-[3px] "
            style={{ fontFamily: "B", fontSize: TitleFontSize }}
          >
            {title}
          </div>
          <div
            className="text-white mt-[5px]  overflow-hidden flex-1 opacity-[72%]"
            style={{ fontSize: ContentFontSize }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
