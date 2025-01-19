import { Canvas, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard";
import { LightStrip } from "./LightStrip";

// 3D 模型展示元件
export const Model = ({ onAnimationEnd, logoAnimation }) => {
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");
  const [primitivePosition, setPrimitivePosition] = useState([0, 0, 0]);
  const [primitiveScale, setPrimitiveScale] = useState([0.9, 0.9, 0.9]);
  const [InfoCardWidth, setInfoCardWidth] = useState("23rem");
  const [InfoCardPosition, setInfoCardPosition] = useState([0, -1.2, 0]);
  const [InfoWidth, setInfoWidth] = useState("5rem");
  const [InfoHeight, setInfoHeight] = useState("2rem");
  const [InfoFontSize, setInfoFontSize] = useState("1rem");
  const [InfoDateTextSize, setInfoDateTextSize] = useState("1.5rem");

  const [LightStripPosition, setLightStripPosition] = useState([0, -1.5, 0]);

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
        setInfoCardPosition([0, -1.2, 0]);
        setPrimitiveScale([0.9, 0.9, 0.9]);
      } else if (window.innerWidth < 1024) {
        setPrimitivePosition([0, 0.1, 0]);
        setInfoCardPosition([0, -1.4, 0]);
        setPrimitiveScale([1.05, 1.05, 1.05]);
        setInfoCardWidth("32rem");
        setInfoWidth("8.75rem");
        setInfoHeight("3.15rem");
        setInfoFontSize("1.75rem");
        setInfoDateTextSize("2.25rem");
        setLightStripPosition([0, -2, 0]);
      } else {
        setInfoCardPosition([0, -3, 0]);
        setInfoCardWidth("60rem");
        setLightStripPosition([0, -2.2, 0]);
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
    onAnimationEnd();
  };

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);
    }
  }, [gltf]);

  return (
    <div className="w-full h-screen relative">
      <Canvas style={{ position: "absolute", zIndex: 0 }}>
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
              containerWidth={InfoWidth}
              containerHeight={InfoHeight}
              opacity={leftInfoOpacity}
              transform={leftTransform}
              fontSize={InfoFontSize}
              dateTextSize={InfoDateTextSize}
              backgroundColor="#FFFFFF"
              color="#F748C1"
            />
            <InfoCard
              title="校外展"
              date="04.25-28"
              containerWidth={InfoWidth}
              containerHeight={InfoHeight}
              opacity={rightInfoOpacity}
              transform={rightTransform}
              fontSize={InfoFontSize}
              dateTextSize={InfoDateTextSize}
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
          position={primitivePosition}
          scale={primitiveScale}
          castShadow
          receiveShadow
        />
      </Canvas>
    </div>
  );
};
