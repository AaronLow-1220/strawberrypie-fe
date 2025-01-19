import { Canvas, useLoader } from "@react-three/fiber";
import { Html, OrbitControls, Grid, Stats } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";

// 3D 模型展示元件
export const Model = ({ onAnimationStart, logoAnimation }) => {
  const [sceneReady, setSceneReady] = useState(false);
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");

  const [leftInfoOpacity, setLeftInfoOpacity] = useState(0);
  const [leftTransform, setLeftTransform] = useState("translateY(40px)");

  const [rightInfoOpacity, setRightInfoOpacity] = useState(0);
  const [rightTransform, setRightTransform] = useState("translateY(40px)");

  const [LightStripHeight, setLightStripHeight] = useState("");

  // 優化模型
  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
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

      // 設置模型的初始位置和比例
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);
      
      setSceneReady(true);
    }
  }, [gltf]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
      } else if (window.innerWidth < 1024) {
      } else {
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 確保動畫結束觸發子組建動畫
  const handleAnimationStart = () => {
    logoAnimation();
    setTimeout(() => {
      setLeftInfoOpacity(1);
      setLeftTransform("translateY(0px)");
    }, 1000);
    setTimeout(() => {
      setRightInfoOpacity(1);
      setRightTransform("translateY(0px)");
    }, 1500);
    setTimeout(() => {
      setLightStripHeight("animate-light");
    }, 2000);
  };

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
        {process.env.NODE_ENV === 'development' && <Stats />}
        {sceneReady && (
          <>
            <SlidingCamera onAnimationStart={handleAnimationStart} />
            <primitive 
              object={gltf.scene}
              frustumCulled={true}
            />
          </>
        )}
      </Canvas>
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: "10%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <InfoCard
          title="校內展"
          date="04.07-11"
          opacity={leftInfoOpacity}
          transform={leftTransform}
          backgroundColor="#FFFFFF"
          color="#F748C1"
        />
        <InfoCard
          title="校外展"
          date="04.25-28"
          opacity={rightInfoOpacity}
          transform={rightTransform}
          backgroundColor="#F748C1"
          color="#FFFFFF"
        />
      </div>
      <LightStrip animateLight={LightStripHeight} />
    </div>
  );
};
