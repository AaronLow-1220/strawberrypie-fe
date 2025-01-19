export const LightStrip = ({ animateLight }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full overflow-hidden`}
      style={{
        position: "absolute",
        bottom: "1%",
      }}
    >
      <div
        className={`w-[2px] h-[60px] bg-white translate-y-[-100px] ${animateLight}`}
        style={{ mixBlendMode: "overlay" }}
      ></div>
    </div>
  );
};