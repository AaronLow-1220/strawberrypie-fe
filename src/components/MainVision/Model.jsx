import { Canvas, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { SlidingCamera } from "./SlidingCamera";
import { InfoCard } from "./InfoCard"; // 引入子元件

// 主程式
export const Model = () => {
  const gltf = useLoader(GLTFLoader, "/GT_Scene.glb");

  const [htmlPosition, setHtmlPosition] = useState([0, 0, 0]);
  const [opacity, setOpacity] = useState(0);
  const [modelScale, setModelScale] = useState([2, 2, 2]);
  const [modelPosition, setModelPosition] = useState([0, -1, 0]);
  const [logoWidth, setLogoWidth] = useState("500px");

  const [leftInfoOpacity, setLeftInfoOpacity] = useState(0);
  const [leftTransform, setLeftTransform] = useState("translateY(40px)");

  const [rightInfoOpacity, setRightInfoOpacity] = useState(0);
  const [rightTransform, setRightTransform] = useState("translateY(40px)");

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
        setModelScale([2, 2, 2]);
        setModelPosition([0, -1, 0]);
        setHtmlPosition([0, 6.1, 0]);
      } else if (window.innerWidth < 1024) {
        setModelScale([2.5, 2.5, 2.5]);
        setModelPosition([0, -1.5, 0]);
        setHtmlPosition([0, 7.5, 0]);
      } else {
        setModelScale([3, 2.4, 3]);
        setModelPosition([0, -1.3, 0]);
        setHtmlPosition([0, 7.5, 0]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAnimationEnd = () => {
    setTimeout(() => {
      setOpacity(1);
      if (window.innerWidth < 768) {
        setLogoWidth("350px");
      } else if (window.innerWidth < 1024) {
        setLogoWidth("400px");
      } else {
        setLogoWidth("450px");
      }
    }, 500);
    setTimeout(() => {
      setLeftInfoOpacity(1);
      setLeftTransform("translateY(0px)");
    }, 1000);
    setTimeout(() => {
      setRightInfoOpacity(1);
      setRightTransform("translateY(0px)");
    }, 1500);
  };

  return (
    <div className="w-full h-screen">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} />
        <SlidingCamera onAnimationEnd={handleAnimationEnd} />

        {/* LOGO */}
        <Html position={htmlPosition} center>
          <div
            style={{
              width: logoWidth,
              height: "100px",
              opacity: opacity,
              transition: "all 1s ease-in-out",
            }}
          >
            <img src="/Headline.svg" alt="Example" />
          </div>
        </Html>

        {/* 資訊卡片 */}
        <Html position={[0, -4, 0]} center>
          <div
            style={{
              width: "21rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <InfoCard
              title="校內展"
              date="04.07-04.11"
              opacity={leftInfoOpacity}
              transform={leftTransform}
              backgroundColor="#FFFFFF"
              color="#E04AA9"
            />
            <InfoCard
              title="校外展"
              date="04.25-04.28"
              opacity={rightInfoOpacity}
              transform={rightTransform}
              backgroundColor="#E04AA9"
              color="#FFFFFF"
            />
          </div>
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
