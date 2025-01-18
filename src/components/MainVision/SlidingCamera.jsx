import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Object3D } from "three";

export const SlidingCamera = ({ onAnimationEnd }) => {
  const { camera } = useThree();
  const progress = useRef(0);
  const [sliding, setSliding] = useState(true);
  const initialY = useRef(null);

  // 創建相機錨點
  const cameraAnchor = useRef(new Object3D());

  camera.fov = 46;
  camera.near = 0.01;
  camera.updateProjectionMatrix();

  const ANIMATION_DURATION = 3;

  const SENSOR_HEIGHT = 24;

  var startFov;
  var endFov;

  // 設定不同尺寸的 FOV
  useEffect(() => {
    // 初始化和監聽視窗大小變化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      startFov = 8;
      endFov = 15;
    } else if (window.innerWidth < 1024) {
      startFov = 13;
      endFov = 19;
    } else {
      startFov = 12;
      endFov = 20;
    }
    startFov = focalLengthToFOV(startFov);
    console.log(startFov);
    endFov = focalLengthToFOV(endFov);
    camera.fov = endFov;
    camera.updateProjectionMatrix();  // 記得更新投影矩陣
  };

  const focalLengthToFOV = (focalLength) => {
    return 2 * Math.atan((SENSOR_HEIGHT / 2) / focalLength) * (180 / Math.PI);
  };

  handleResize();

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

  // 初始化設置
  useEffect(() => {
    // 將相機加入錨點
    cameraAnchor.current.add(camera);
    // 保持相機原始位置
    camera.position.set(0, 0, 0);
  }, []);

  // 每幀執行的動畫邏輯
  useFrame((state, delta) => {
    if (sliding) {
      progress.current = Math.min(progress.current + delta / ANIMATION_DURATION, 1);
      const easedT = ease(progress.current);

      // 更新錨點的位置和旋轉
      const position = curve.getPoint(easedT);
      cameraAnchor.current.position.set(position.x, position.y, position.z);
      cameraAnchor.current.rotation.x = startRotation + (endRotation - startRotation) * easedT;

      if (easedT >= 1) {
        setSliding(false);
        initialY.current = cameraAnchor.current.position.y;
        onAnimationEnd?.();
      }

      const SCROLL_FACTOR = 0.0016;

      document.body.style.overflow = easedT >= 0.94 ? "auto" : "hidden";

      // 監聽頁面滾動，直接控制相機位置
      const updateCameraPosition = () => {
        // 直接更新相機的Y軸位置
        camera.position.y = Math.min(
          0, // 相機相對錨點的初始位置是 0
          -(window.scrollY * SCROLL_FACTOR)
        );
      };

      window.addEventListener('scroll', updateCameraPosition);
      return () => window.removeEventListener('scroll', updateCameraPosition);
    }
  });

  return null;
};