export const LightStrip = ({ animateLight }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full overflow-hidden`}
    >
      <div
        className={`w-[2px] h-[74.5px] bg-white translate-y-[-100px] ${animateLight}`}
        style={{ mixBlendMode: "overlay" }}
      ></div>
    </div>
  );
};
