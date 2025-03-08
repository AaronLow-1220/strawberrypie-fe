import 'react-circular-progressbar/dist/styles.css';
import { easeCubicInOut } from 'd3-ease';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
// Animation
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config';

export const ProgressBar2 = () => {
  // 假設目前集到的張數與總數
  const currentCount = 0;
  const totalStamps = 21;
  // 計算百分比
  const percentValue = (currentCount / totalStamps) * 100;

  // 從 tailwind 配置中獲取 primary-color
  const fullConfig = resolveConfig(tailwindConfig);
  const primaryColor = fullConfig.theme.colors['primary-color'];

  // 定義收集的類別及對應數量
  const array = [
    { name: "遊戲", num: 6 },
    { name: "互動", num: 11 },
    { name: "影視", num: 2 },
    { name: "動畫", num: 1 },
    { name: "行銷", num: 3 },
  ];

  return (
    <div className='overflow-visible -z-10 progress-bar max-w-[240px] lg:w-[clamp(15rem,0rem+23.4375vw,22.5rem)] lg:max-w-[360px]'>
      <div className="w-[240px] lg:w-[clamp(15rem,0rem+23.4375vw,22.5rem)] h-[240px] lg:h-[clamp(15rem,0rem+23.4375vw,22.5rem)] absolute rounded-full blur-[60px] bg-primary-color"></div>
      <AnimatedProgressProvider
        valueStart={0}
        valueEnd={percentValue}
        duration={1.4}
        easingFunction={easeCubicInOut}
      >
        {value => {
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
                pathColor: primaryColor,
                trailColor: "rgba(0,0,0,0)",
                backgroundColor: "rgba(0,0,0,0.2)"
              })}
            >
              <div className='text-[14px] 2xl:text-[24px] opacity-75'>
                已搜集
              </div>
              {/* 顯示集到的張數 */}
              <div className='text-[72px] 2xl:text-[108px]'
               style={{ fontWeight: 'bold', lineHeight: "1.3em", fontFamily: "B" }}>
                {animatedCount}
              </div>
              {/* 第二行：顯示百分比 */}
              <div 
              className='text-[24px] 2xl:text-[36px] text-secondary-color'
              style={{ marginTop: "-0.2em" }}>
                {roundedPercentage}%
              </div>
            </CircularProgressbarWithChildren>
          );
        }}
      </AnimatedProgressProvider>
    </div>
  );
}