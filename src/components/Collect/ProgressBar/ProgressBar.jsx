export const ProgressBar = () => {
  // 設定角度，單位：度
  const angleInDegrees = 201.6;

  const radius = 115; // 大圓半徑 (240px / 2)
  const smallCircleRadius = 10.5; // 小圓半徑 (26.5px / 2)

  // 正確轉換角度為弧度
  const radians = (angleInDegrees - 90) * (Math.PI / 180); // 減去90度以從頂部開始

  // 計算小圓位置
  const x = radius + Math.cos(radians) * (radius - smallCircleRadius);
  const y = radius + Math.sin(radians) * (radius - smallCircleRadius);
  return (
    <div
      className={
        window.innerWidth < 1536
          ? "relative w-[230px] h-[230px] mx-auto "
          : "relative w-[230px] h-[230px] mx-auto transform scale-150"
      }
    >
      {/* 進度條背景（使用 conic-gradient） */}
      <div
        className="absolute w-full h-full rounded-full -z-30"
        style={{
          background: `conic-gradient(#FF4EC8 0deg ${angleInDegrees}deg, rgba(0,0,0,0.3) ${angleInDegrees}deg 360deg)`,
          WebkitMaskImage:
            "radial-gradient(circle at center, transparent 0%, transparent 58%, black 47%)",
        }}
      ></div>

      {/* 固定起點的小圓 */}
      <div
        className="absolute rounded-full -z-20"
        style={{
          width: "20.8px",
          height: "20.8px",
          background: "#FF4EC8",
          top: "calc(0%)",
          left: "calc(45.5%)",
        }}
      ></div>

      {/* 動態位置的小圓（跟隨進度條末端） */}
      <div
        className="absolute rounded-full -z-20"
        style={{
          width: "20.9px",
          height: "20.9px",
          background: "#FF4EC8",
          top: `${y - smallCircleRadius}px`,
          left: `${x - smallCircleRadius}px`,
        }}
      ></div>

      {/* 模糊背景效果 */}
      <div className="bg-primary-color blur-3xl w-[240px] h-[240px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[187px] h-[187px] rounded-full bg-[rgba(0,0,0,0.2)] z-30"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="text-[64px] text-white leading-none text-center w-full"
          style={{ fontFamily: "B" }}
        >
          13
        </div>
        <div
          className="text-[18px] text-secondary-color leading-none text-center w-full mt-[4px]"
          style={{ fontFamily: "M" }}
        >
          56%
        </div>
      </div>
    </div>
  );
};
