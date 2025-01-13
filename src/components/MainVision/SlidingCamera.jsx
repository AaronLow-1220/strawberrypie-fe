import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";

export const SlidingCamera = ({ onAnimationEnd }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const progress = useRef(0);
  const [sliding, setSliding] = useState(true);

  // 定義點數據並生成曲線
  const points = [
    { x: 0.0, y: 2.648118495941162, z: -0.1991262435913086 },
    { x: 0.0, y: 2.38195538520813, z: -0.11715168505907059 },
    { x: 0.0, y: 2.155651330947876, z: 0.003434285521507263 },
    { x: 0.0, y: 1.9660203456878662, z: 0.17288795113563538 },
    { x: 0.0, y: 1.809876561164856, z: 0.40146541595458984 },
    { x: 0.0, y: 1.6840341091156006, z: 0.6994227766990662 },
    { x: 0.0, y: 1.5853071212768555, z: 1.0770161151885986 },
    { x: 0.0, y: 1.510509729385376, z: 1.544501543045044 },
    { x: 0.0, y: 1.456455945968628, z: 2.112135171890259 },
    { x: 0.0, y: 1.4199599027633667, z: 2.790173053741455 },
    { x: 0.0, y: 1.3978357315063477, z: 3.5888712406158447 },
    { x: 0.0, y: 1.3868975639343262, z: 4.518486022949219 },
    { x: 0.0, y: 1.3839595317840576, z: 5.589273452758789 },
  ].map((p) => new Vector3(p.x, p.y, p.z));

  const curve = new CatmullRomCurve3(points); // 創建曲線

  useFrame((state, delta) => {
    const controls = controlsRef.current;

    if (sliding) {
      // 更新進度
      progress.current = Math.min(progress.current + delta / 3, 1);

      const easedT = progress.current;
      const position = curve.getPoint(easedT);

      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(0, -1, -4);
      // 動畫結束
      if (easedT >= 1) {
        setSliding(false);
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(0, -1, -4);
        if (controls) {
          controls.enabled = false;
        }
        if (onAnimationEnd && typeof onAnimationEnd === "function") {
          onAnimationEnd();
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enableRotate={false} // 禁用旋轉
      enablePan={false}
    />
  );
};
