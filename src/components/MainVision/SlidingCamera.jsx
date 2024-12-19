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
    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    if (sliding) {
      progress.current = Math.min(progress.current + delta / 3, 1);

      const easedT = easeInOut(progress.current);

      // 動態計算相機位置
      const x = 0;
      const y = 5 - 1 * easedT;
      const z = -5 + 21 * easedT;

      // 動態計算關注點
      const targetX = 0;
      const targetY = 5 - 4.5 * easedT;
      const targetZ = -5;

      camera.position.set(x, y, z); // 0 4 16
      camera.lookAt(targetX, targetY, targetZ);
      // 設定動態 FOV
      camera.fov = 50 + 20 * Math.sin(easedT * Math.PI);
      camera.updateProjectionMatrix();

      // 動畫結束
      if (easedT >= 1) {
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
