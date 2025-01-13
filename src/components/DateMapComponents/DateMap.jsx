import { InfoCard } from "../MainVision/InfoCard";
export const DateMap = ({
  backgroundColor,
  color,
  title,
  date,
  secondDate,
  place,
}) => {
  return (
    <div className="w-full h-[30.375rem] ">
      <div className="mt-[1.25rem]">
        <InfoCard
          title={title}
          backgroundColor={backgroundColor}
          color={color}
          containerWidth="9rem"
          containerHeight="3.5rem"
          fontSize="2rem"
          dateTextSize="2.25rem"
        >
          <div className="flex  items-center justify-center">
            <span>{date}</span>
            <span
              style={{
                width: "9rem",
                height: "5px",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                margin: "0 0.5rem",
              }}
            ></span>
            <span>{secondDate}</span>
          </div>
          <div className="text-[1.25rem]">{place}</div>
          <div className="mt-[3rem] w-[22.5rem] h-[16.25rem] mx-auto bg-white rounded-[10px]"></div>
        </InfoCard>
      </div>
    </div>
  );
};
