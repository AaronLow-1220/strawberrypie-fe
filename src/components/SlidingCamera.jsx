import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// 相機控制組件
export const SlidingCamera = ({ onAnimationEnd }) => {
  const { camera } = useThree(); // 獲取場景中的相機
  const controlsRef = useRef();
  const progress = useRef(0);
  const [sliding, setSliding] = useState(true);

  useFrame((state, delta) => {
    const controls = controlsRef.current;

    if (sliding) {
      // 平滑增加進度
      progress.current = Math.min(progress.current + delta * 0.5, 1);

      const t = progress.current;
      const x = 0; // X 軸保持不變
      const y = 0 + (4 - 0) * t; // Y 軸高度
      const z = -5 + 21 * t; // Z 軸從 -5 到 16

      camera.position.set(x, y, z);
      camera.lookAt(0, 0.5, -5);

      camera.fov = 50 + 20 * Math.sin(t * Math.PI);
      camera.updateProjectionMatrix();

      // 動畫結束
      if (t >= 1) {
        setSliding(false);
        if (controls) {
          controls.target.set(0, 0.5, -5);
          controls.update();
          if (onAnimationEnd && typeof onAnimationEnd === "function") {
            onAnimationEnd();
          }
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enableRotate={false}
      enablePan={false}
    />
  );
};
