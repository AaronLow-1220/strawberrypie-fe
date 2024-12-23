export const LightStrip = ({ animateLight }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full overflow-hidden`}
    >
      <div
        className={`w-[2px] h-[74.5px] bg-[#E84CA5] translate-y-[-100px] ${animateLight}`}
      ></div>
    </div>
  );
};
