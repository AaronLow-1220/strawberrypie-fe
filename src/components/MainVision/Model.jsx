import { Canvas, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";

// 主程式
export const Model = ({ onAnimationEnd, logoAnimation }) => {
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");

  const [modelScale, setModelScale] = useState([2, 2, 2]);
  const [modelPosition, setModelPosition] = useState([0, -3, -4]);
  const [InfoCardWidth, setInfoCardWidth] = useState("21rem");
  const [InfoCardPosition, setInfoCardPosition] = useState([0, -4, 0]);
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
        setModelScale([1.8, 1.8, 1.8]);
        setModelPosition([0, -3, -4]);
        setInfoCardPosition([0, -4, 0]);
      } else if (window.innerWidth < 1024) {
        setModelScale([2, 2, 2]);
        setModelPosition([0, -3, -4]);
        setInfoCardPosition([0, -4.8, 0]);
        setInfoCardWidth("25rem");
        setLightStripPosition([0, -6.7, 0]);
      } else {
        setModelScale([3, 3, 3]);
        setModelPosition([0, -6, -8]);
        setInfoCardPosition([0, -5, 0]);
        setInfoCardWidth("60rem");
        setLightStripPosition([0, -7.2, 0]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 确定動畫結束觸發子組建動畫
  const handleAnimationEnd = () => {
    logoAnimation();
    setTimeout(() => {
      setLeftInfoOpacity(1);
      setLeftTransform("translateY(0px)");
    }, 900);
    setTimeout(() => {
      setRightInfoOpacity(1);
      setRightTransform("translateY(0px)");
    }, 1800);
    setTimeout(() => {
      setLightStripHeight("animate-light");
    }, 2500);
    setTimeout(() => {
      onAnimationEnd();
    }, 3000);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas style={{ position: "absolute", zIndex: 0 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} />
        <SlidingCamera onAnimationEnd={handleAnimationEnd} />

        {/* 資訊卡片 */}
        <Html position={InfoCardPosition} center>
          <div
            style={{
              width: InfoCardWidth,
              display: "flex",
              justifyContent: "space-between",
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
        </Html>

        {/* 燈條 */}
        <Html position={LightStripPosition} center>
          <LightStrip animateLight={LightStripHeight} />
        </Html>

        {/* 3D 模型 */}
        <primitive
          object={gltf.scene}
          position={modelPosition}
          scale={modelScale}
        />
      </Canvas>
    </div>
  );
};
