import { Canvas, useLoader } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";
import { useDeviceType } from "./useDeviceType";

/**
 * 3D 模型展示元件
 * 負責載入和顯示 3D 場景，並控制相關動畫和資訊卡片的顯示
 * @param {Function} logoAnimation - Logo 動畫觸發函數
 * @param {Function} onAnimationEnd - 動畫結束回調函數
 */
export const Model = ({ logoAnimation, onAnimationEnd }) => {
  // 獲取當前設備類型（桌面/平板/手機）
  const { deviceType } = useDeviceType();
  
  // 場景狀態管理
  const [sceneReady, setSceneReady] = useState(false); // 3D 場景是否準備完成
  const [animate, setAnimate] = useState(""); // Logo 動畫類名
  const [LightStripHeight, setLightStripHeight] = useState(""); // 光條動畫狀態
  
  // 載入 3D 模型
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");

  // 資訊卡片狀態管理（合併相關狀態以簡化代碼）
  const [infoCardStates, setInfoCardStates] = useState({
    left: { opacity: 0, transform: "translateY(40px)" },
    right: { opacity: 0, transform: "translateY(40px)" },
  });

  // 優化 3D 模型效能
  useEffect(() => {
    if (!gltf || !gltf.scene) return;
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // 優化幾何體
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
        }

        // 設置材質屬性以確保正確渲染
        if (child.material && child.material.map) {
          child.material.transparent = true;
          child.material.premultipliedAlpha = true;
          child.material.depthWrite = true;
          child.material.depthTest = true;
          child.material.alphaTest = 0.5;
          child.material.needsUpdate = false;
        }

        // 啟用視錐體剔除以提升性能
        child.frustumCulled = true;
      }
    });

    // 標記場景已準備完成
    setSceneReady(true);
    
    // 通知父組件動畫已完成
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  }, [gltf, onAnimationEnd]);

  /**
   * 處理動畫開始
   * 按順序觸發 Logo 動畫、左側資訊卡片、右側資訊卡片和光條動畫
   */
  const handleAnimationStart = () => {
    // 觸發 Logo 動畫
    logoAnimation();
    setAnimate("animate-WindowLogo");
    
    // 延遲顯示左側資訊卡片
    setTimeout(() => {
      setInfoCardStates((prev) => ({
        ...prev,
        left: { opacity: 1, transform: "translateY(0px)" },
      }));
    }, 800);

    // 延遲顯示右側資訊卡片
    setTimeout(() => {
      setInfoCardStates((prev) => ({
        ...prev,
        right: { opacity: 1, transform: "translateY(0px)" },
      }));
    }, 1200);

    // 延遲顯示光條動畫
    setTimeout(() => {
      setLightStripHeight("animate-light");
    }, 2000);
  };

  // 定義資訊卡片配置，根據設備類型調整日期顯示格式
  const infoCards = [
    {
      title: "校內展",
      date: deviceType === "mobile" ? "04.07-12" : "04.07",
      endDate: deviceType !== "mobile" ? "04.12" : "04.12",
      backgroundColor: "#FFFFFF",
      color: "#F748C1",
    },
    {
      title: "校外展",
      date: deviceType === "mobile" ? "04.25-28" : "04.25",
      endDate: deviceType !== "mobile" ? "04.28" : "04.28",
      backgroundColor: "#F748C1",
      color: "#FFFFFF",
    },
  ];

  // 渲染桌面版資訊卡片
  const renderDesktopInfoCards = () => {
    if (deviceType !== "desktop") return null;
    
    return (
      <div
        className="absolute top-[50%] flex items-center justify-between"
        style={{
          width: "100%",
          minWidth: "1540px",
          maxWidth: "2000px",
          padding: "0 5%",
          left: "50%",
          transform: "translate(-50%, -55%)",
        }}
      >
        {/* 左側標題和 Logo */}
        <div
          className={`flex opacity-0 flex-col items-center w-fit ${animate}`}
          style={{ transform: "scale(0.9)" }}
        >
          <img src="/HomePage/草莓派_Desktop.svg" alt="" />
        </div>
        
        {/* 右側資訊卡片 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "380px",
            rowGap: "64px",
            marginRight: "64px",
            transform: "scale(0.9)",
          }}
        >
          {infoCards.map((card, index) => (
            <InfoCard
              key={card.title}
              {...card}
              opacity={infoCardStates[index === 0 ? "left" : "right"].opacity}
              transform={infoCardStates[index === 0 ? "left" : "right"].transform}
            />
          ))}
        </div>
      </div>
    );
  };

  // 渲染行動版資訊卡片
  const renderMobileInfoCards = () => {
    if (deviceType === "desktop") return null;
    
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: "10%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {infoCards.map((card, index) => (
          <InfoCard
            key={card.title}
            {...card}
            opacity={infoCardStates[index === 0 ? "left" : "right"].opacity}
            transform={infoCardStates[index === 0 ? "left" : "right"].transform}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen relative">
      {/* 3D 場景渲染 */}
      <Canvas
        style={{ position: "absolute", zIndex: 0 }}
        gl={{
          antialias: true, // 保持抗鋸齒
          alpha: true, // 保持透明背景
          powerPreference: "high-performance", // 優先使用高性能模式
          depth: true, // 確保深度緩衝區可用
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0); // 設置透明背景
        }}
      >
        
        {/* 場景準備完成後渲染 3D 內容 */}
        {sceneReady && (
          <>
            <SlidingCamera onAnimationStart={handleAnimationStart} />
            <primitive object={gltf.scene} frustumCulled={true} />
          </>
        )}
      </Canvas>

      {/* 根據設備類型渲染不同版本的資訊卡片 */}
      {renderDesktopInfoCards()}
      {renderMobileInfoCards()}

      {/* 光條動畫效果 */}
      <LightStrip animateLight={LightStripHeight} deviceType={deviceType} />
    </div>
  );
};
