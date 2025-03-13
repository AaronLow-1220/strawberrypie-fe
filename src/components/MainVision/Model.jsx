import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect, useRef, useMemo } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";
import { useDeviceType } from "./useDeviceType";

// 自定義 hook 用於載入預載或直接載入 3D 模型
const usePreloadedGLTF = (modelPath) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { invalidate } = useThree();

  useEffect(() => {
    const fileName = modelPath.split('/').pop();
    const loader = new GLTFLoader();
    
    // 檢查是否有預載的模型
    if (window.preloadedModels && window.preloadedModels[fileName]) {
      console.log(`使用預載的模型: ${fileName}`);
      const preloadedModel = window.preloadedModels[fileName];
      
      // 使用預載的 URL
      loader.load(preloadedModel.url, 
        (gltf) => {
          setModel(gltf);
          setLoading(false);
          invalidate(); // 通知 Three.js 需要重新渲染
        },
        undefined, // 進度回調
        (error) => {
          console.error(`預載模型載入失敗: ${fileName}`, error);
          setError(error);
          setLoading(false);
          
          // 如果預載模型失敗，嘗試直接載入
          console.log(`嘗試直接載入模型: ${modelPath}`);
          loader.load(modelPath, 
            (gltf) => {
              setModel(gltf);
              setLoading(false);
              invalidate();
            },
            undefined,
            (directError) => {
              console.error(`直接載入模型也失敗: ${modelPath}`, directError);
              setError(directError);
              setLoading(false);
            }
          );
        }
      );
    } else {
      // 沒有預載模型，直接載入
      console.log(`直接載入模型: ${modelPath}`);
      loader.load(modelPath, 
        (gltf) => {
          setModel(gltf);
          setLoading(false);
          invalidate();
        },
        undefined,
        (error) => {
          console.error(`模型載入失敗: ${modelPath}`, error);
          setError(error);
          setLoading(false);
        }
      );
    }
    
    // 清理函數
    return () => {
      // 如果需要清理資源，可以在這裡進行
    };
  }, [modelPath, invalidate]);

  return { model, loading, error };
};

// 3D 模型展示元件
export const Model = ({ onAnimationStart, logoAnimation }) => {
  const { deviceType } = useDeviceType();
  const [sceneReady, setSceneReady] = useState(false);
  // 使用自定義 hook 載入模型
  const { model, loading, error } = usePreloadedGLTF("/GT_Scene.glb");
  const [animate, setAnimate] = useState("");

  // 合併相關的狀態
  const [infoCardStates, setInfoCardStates] = useState({
    left: { opacity: 0, transform: "translateY(40px)" },
    right: { opacity: 0, transform: "translateY(40px)" }
  });
  const [LightStripHeight, setLightStripHeight] = useState("");

  // 優化模型
  useEffect(() => {
    if (model && model.scene) {
      model.scene.traverse((child) => {
        if (child.isMesh) {
          // 優化幾何體
          if (child.geometry) {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
          }

          // 保持必要的材質設置
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

      setSceneReady(true);
    }
  }, [model]);

  const handleAnimationStart = () => {
    logoAnimation();
    setAnimate("animate-WindowLogo");
    setTimeout(() => {
      setInfoCardStates(prev => ({
        ...prev,
        left: { opacity: 1, transform: "translateY(0px)" }
      }));
    }, 1000);

    setTimeout(() => {
      setInfoCardStates(prev => ({
        ...prev,
        right: { opacity: 1, transform: "translateY(0px)" }
      }));
    }, 1200);

    setTimeout(() => {
      setLightStripHeight("animate-light");
    }, 2000);
  };

  // 抽取 InfoCard 共用的 props
  const infoCards = [
    {
      title: "校內展",
      date: deviceType === "mobile" ? "04.07-11" : "04.07",
      endDate: deviceType !== "mobile" ? "04.11" : undefined,
      backgroundColor: "#FFFFFF",
      color: "#F748C1"
    },
    {
      title: "校外展",
      date: deviceType === "mobile" ? "04.25-28" : "04.25",
      endDate: deviceType !== "mobile" ? "04.28" : undefined,
      backgroundColor: "#F748C1",
      color: "#FFFFFF"
    }
  ];

  // 顯示載入錯誤
  if (error) {
    console.error("模型載入錯誤:", error);
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas
        style={{ position: "absolute", zIndex: 0 }}
        gl={{
          antialias: true,     // 保持抗鋸齒
          alpha: true,         // 保持透明背景
          powerPreference: "high-performance",
          pixelRatio: Math.min(window.devicePixelRatio, 2),  // 限制像素比例以提升性能
          depth: true,         // 確保深度緩衝區可用
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
      >
        {sceneReady && !loading && model && (
          <>
            <SlidingCamera onAnimationStart={handleAnimationStart} />
            <primitive
              object={model.scene}
              frustumCulled={true}
            />
          </>
        )}
      </Canvas>

      {deviceType === "desktop" ? (
        <div
          className="absolute top-[50%] z-30 flex items-center justify-between"
          style={{
            width: "100%",
            minWidth: "1540px",
            maxWidth: "2000px",
            padding: "0 5%",
            transform: "translateY(-55%)",
          }}
        >
          <div className={`flex opacity-0 flex-col items-center w-fit ${animate}`}
          style={{
            transform: "scale(0.9)",
          }} >
            <div className="w-[420px]">
              <img
                src="/Headline.svg"
                alt="Example"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              />
            </div>
            <div className="mt-4 text-center flex flex-col items-center">
              <p className="text-white text-[42px] tracking-[8px]">元智大學資訊傳播學系</p>
              <img className="w-[360px] mt-4" src="/畢業展28.svg" alt="" />
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            width: "380px",
            rowGap: "64px",
            marginRight: "64px",
            transform: "scale(0.9)",
          }}>
            {infoCards.map((card, index) => (
              <InfoCard
                key={card.title}
                {...card}
                opacity={infoCardStates[index === 0 ? 'left' : 'right'].opacity}
                transform={infoCardStates[index === 0 ? 'left' : 'right'].transform}
              />
            ))}
          </div>
        </div>
      ) : null}
      {deviceType !== "desktop" ? (
        <div style={{
          position: "absolute",
          width: "100%",
          bottom: "10%",
          display: "flex",
          justifyContent: "space-evenly",
        }}>
          {infoCards.map((card, index) => (
            <InfoCard
              key={card.title}
              {...card}
              opacity={infoCardStates[index === 0 ? 'left' : 'right'].opacity}
              transform={infoCardStates[index === 0 ? 'left' : 'right'].transform}
            />
          ))}
        </div>
      ) : null}

      <LightStrip 
        animateLight={LightStripHeight} 
        deviceType={deviceType}
      />
    </div>
  );
};
