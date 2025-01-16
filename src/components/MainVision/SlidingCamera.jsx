import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";

export const SlidingCamera = ({ onAnimationEnd }) => {
  const { camera } = useThree();
  const progress = useRef(0);
  const [sliding, setSliding] = useState(true);
  const initialY = useRef(null);  // 儲存初始Y位置

  camera.fov = 60;
  camera.near = 0.01;
  camera.updateProjectionMatrix();

  const ANIMATION_DURATION = 3;

  // 實現 cubic-bezier 函數
  const cubicBezier = (x1, y1, x2, y2) => {
    return (t) => {
      if (t === 0 || t === 1) return t;

      let start = 0;
      let end = 1;
      
      for (let i = 0; i < 10; i++) {
        const currentT = (start + end) / 2;
        
        // 計算 bezier 曲線上的 x 點
        const x = 3 * currentT * (1 - currentT) ** 2 * x1 +
                 3 * currentT ** 2 * (1 - currentT) * x2 +
                 currentT ** 3;
                 
        if (Math.abs(x - t) < 0.001) {
          // 計算對應的 y 值
          return 3 * currentT * (1 - currentT) ** 2 * y1 +
                 3 * currentT ** 2 * (1 - currentT) * y2 +
                 currentT ** 3;
        }
        
        if (x > t) {
          end = currentT;
        } else {
          start = currentT;
        }
      }
      
      // 計算最終的 y 值
      const currentT = (start + end) / 2;
      return 3 * currentT * (1 - currentT) ** 2 * y1 +
             3 * currentT ** 2 * (1 - currentT) * y2 +
             currentT ** 3;
    };
  };

  // 創建 cubic-bezier(.33,0,0,1) 的 easing 函數
  const ease = cubicBezier(0.33, 0, 0, 1);

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

  const curve = new CatmullRomCurve3(points);

  // 設定起始和結束角度（轉換為弧度）
  const startRotation = 10 * (Math.PI / 180);  // 100度
  const endRotation = 0 * (Math.PI / 180);     // 90度

  useEffect(() => {
    const handleScroll = (event) => {
      if (!sliding) {
        // 確保初始Y位置被設定
        if (initialY.current === null) {
          initialY.current = camera.position.y;
        }

        // 直接更新相機位置
        const newY = camera.position.y - event.deltaY * 0.001;
        // 確保不會超過初始位置
        camera.position.y = Math.min(initialY.current, Math.max(newY, -Infinity));
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [sliding]);

  useFrame((state, delta) => {
    if (sliding) {
      progress.current = Math.min(progress.current + delta / ANIMATION_DURATION, 1);
      const easedT = ease(progress.current);
      
      const position = curve.getPoint(easedT);
      camera.position.set(position.x, position.y, position.z);

      const currentRotation = startRotation + (endRotation - startRotation) * easedT;
      camera.rotation.x = currentRotation;

      if (easedT >= 1) {
        setSliding(false);
        initialY.current = camera.position.y;  // 儲存初始Y位置
        if (onAnimationEnd) onAnimationEnd();
      }
    }
  });

  return null;
};