import { Canvas, useLoader } from "@react-three/fiber";
import { Html, OrbitControls, Grid, Stats } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";

// 3D 模型展示元件
export const Model = ({ onAnimationStart, logoAnimation }) => {
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");
  const [sceneReady, setSceneReady] = useState(false);

  const [LightStripPosition, setLightStripPosition] = useState([0, -5, 0]);

  const [leftInfoOpacity, setLeftInfoOpacity] = useState(0);
  const [leftTransform, setLeftTransform] = useState("translateY(40px)");

  const [rightInfoOpacity, setRightInfoOpacity] = useState(0);
  const [rightTransform, setRightTransform] = useState("translateY(40px)");

  const [LightStripHeight, setLightStripHeight] = useState("");

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const material = child.material;
          if (material && material.map) {
            material.transparent = true;
            material.premultipliedAlpha = true;
            material.depthWrite = true;
            material.depthTest = true;
            material.alphaTest = 0.5;
            material.needsUpdate = true;
          }
        }
      });
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

  // 确定動畫結束觸發子組建動畫
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

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);
    }
  }, [gltf]);

  useEffect(() => {
    if (gltf) {
      setSceneReady(true);
    }
  }, [gltf]);

  return (
    <div className="w-full h-screen relative">
      <Canvas 
        style={{ position: "absolute", zIndex: 0 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);  // 設置背景
        }}
      >
        <Stats />
        {sceneReady && (  // 確保場景準備好才渲染
          <>
            <SlidingCamera onAnimationStart={handleAnimationStart} />
            <primitive object={gltf.scene} />
          </>
        )}
      </Canvas>
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: "15%",
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
