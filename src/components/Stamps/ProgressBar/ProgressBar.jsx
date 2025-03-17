// import 'react-circular-progressbar/dist/styles.css';
import { easeCubicInOut } from "d3-ease";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
// Animation
import AnimatedProgressProvider from "./AnimatedProgressProvider";

export const ProgressBar = ({ currentCount, totalStamps }) => {

  // 計算百分比
  const percentValue = (currentCount / totalStamps) * 100;

  return (
    <div className="overflow-visible -z-10 progress-bar w-full min-w-[200px] max-w-[240px] w-[clamp(15rem,0rem+23.4375vw,22.5rem)] lg:max-w-[360px]">
      <div className="w-full min-w-[200px] max-w-[240px] w-[clamp(15rem,0rem+23.4375vw,22.5rem)] aspect-square lg:max-w-[360px] absolute rounded-full blur-[60px] bg-primary-color"></div>
      <AnimatedProgressProvider
        valueStart={0}
        valueEnd={percentValue}
        duration={1.4}
        easingFunction={easeCubicInOut}
      >
        {(value) => {
          const animatedCount = Math.round((value / 100) * totalStamps);
          const roundedPercentage = Math.round(value);
          return (
            <CircularProgressbarWithChildren
              value={value}
              background={true}
              strokeWidth={6}
              backgroundPadding={6}
              styles={buildStyles({
                pathTransition: "none",
                pathColor: "#F748C1",
                trailColor: "rgba(255,255,255,0.05)",
                backgroundColor: "rgba(0,0,0,0.2)",
                strokeLinecap: "round",
              })}
            >
              <div className="text-[14px] lg:text-[20px] opacity-80">
                已搜集
              </div>
              {/* 顯示集到的張數 */}
              <div
                className="text-[72px] lg:text-[86px]"
                style={{
                  fontWeight: "bold",
                  lineHeight: "1.3em",
                  fontFamily: "B",
                }}
              >
                {animatedCount}
              </div>
              {/* 第二行：顯示百分比 */}
              <div
                className="text-[24px] lg:text-[28px] text-secondary-color"
                style={{ marginTop: "-0.2em" }}
              >
                {roundedPercentage}%
              </div>
            </CircularProgressbarWithChildren>
          );
        }}
      </AnimatedProgressProvider>
    </div>
  );
};
