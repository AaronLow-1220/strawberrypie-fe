import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Object3D } from "three";

export const SlidingCamera = ({ onAnimationStart }) => {
  const { camera, gl, scene } = useThree();
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


  // 設定起始和結束角度（轉換為弧度）
  var startRotation = 15 * (Math.PI / 180);  // 100度
  var endRotation = -5 * (Math.PI / 180);     // 90度

  // 設定不同尺寸的 FOV
  useEffect(() => {
    // 初始化和監聽視窗大小變化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      startFov = 10;
      endFov = 18;
    } else if (window.innerWidth < 1024) {
      startFov = 13;
      endFov = 19;
      endRotation = 1 * (Math.PI / 180);
    } else {
      startFov = 12;
      endFov = 20;
      endRotation = 0 * (Math.PI / 180);
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
  const cubicBezier = (p1x, p1y, p2x, p2y) => {
    return (t) => {
      // 控制點：起點(0,0)，兩個控制點(p1,p2)，終點(1,1)
      const cx = 3 * p1x;
      const bx = 3 * (p2x - p1x) - cx;
      const ax = 1 - cx - bx;

      const cy = 3 * p1y;
      const by = 3 * (p2y - p1y) - cy;
      const ay = 1 - cy - by;

      const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
      const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
      const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

      // 使用牛頓法求解 t
      let x = t;
      for (let i = 0; i < 8; i++) {
        const currentX = sampleCurveX(x) - t;
        if (Math.abs(currentX) < 1e-7) {
          break;
        }
        const derivative = sampleCurveDerivativeX(x);
        if (Math.abs(derivative) < 1e-7) {
          break;
        }
        x = x - currentX / derivative;
      }

      return {
        x: sampleCurveX(x),
        y: sampleCurveY(x)
      };
    };
  };

  // 從 Blender 中獲取的控制點值
  const BEZIER_POINTS = {
    p0: { x: 0, y: 0 },    // 起點
    p1: { x: 0.33, y: 0 },  // 第一個控制點
    p2: { x: 0, y: 1 },   // 第二個控制點
    p3: { x: 1, y: 1 }      // 終點
  };

  // 根據 Blender 的控制點計算貝茲曲線參數
  const p1x = (BEZIER_POINTS.p1.x - BEZIER_POINTS.p0.x) / (BEZIER_POINTS.p3.x - BEZIER_POINTS.p0.x);
  const p1y = (BEZIER_POINTS.p1.y - BEZIER_POINTS.p0.y) / (BEZIER_POINTS.p3.y - BEZIER_POINTS.p0.y);
  const p2x = (BEZIER_POINTS.p2.x - BEZIER_POINTS.p0.x) / (BEZIER_POINTS.p3.x - BEZIER_POINTS.p0.x);
  const p2y = (BEZIER_POINTS.p2.y - BEZIER_POINTS.p0.y) / (BEZIER_POINTS.p3.y - BEZIER_POINTS.p0.y);

  const ease = cubicBezier(p1x, p1y, p2x, p2y);

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

  // 確保場景和相機都準備好
  useEffect(() => {
    if (!camera || !gl.domElement) {
      console.warn('Camera or renderer not ready');
      return;
    }

    // 初始化錨點
    cameraAnchor.current = new Object3D();
    scene.add(cameraAnchor.current);  // 將錨點加入場景
    cameraAnchor.current.add(camera);
    camera.position.set(0, 0, 0);

    // 清理函數
    return () => {
      scene.remove(cameraAnchor.current);
      cameraAnchor.current.remove(camera);
    };
  }, [camera, gl, scene]);

  // 每幀執行的動畫邏輯
  useFrame((state, delta) => {
    if (sliding) {
      progress.current = Math.min(progress.current + delta / ANIMATION_DURATION, 1);
      const { x, y: easedT } = ease(progress.current);  // 取得 x 和 y 值
      
      document.body.style.overflow = easedT >= 0.94 ? "auto" : "hidden";
      
      // 使用 y 值控制動畫
      const position = curve.getPoint(easedT);
      cameraAnchor.current.position.set(position.x, position.y, position.z);
      cameraAnchor.current.rotation.x = startRotation + (endRotation - startRotation) * easedT;

      // 更新 FOV
      camera.fov = startFov + (endFov - startFov) * easedT;
      camera.updateProjectionMatrix();  // 必須調用這個來更新 FOV

      if(easedT >= 1) {
        setSliding(false);
        initialY.current = cameraAnchor.current.position.y;
      }

      // 使用 x 值來觸發 onAnimationStart
      var time = x * 180 // 根據全長180frame來計算，方便設定時間
      if (time >= 90) {
        onAnimationStart?.();
      }
    }
  });

  useEffect(() => {
    const SCROLL_FACTOR = 0.0014;

    const updateCameraPosition = () => {
      camera.position.y = Math.min(
        0,
        -(window.scrollY * SCROLL_FACTOR)
      );
    };

    window.addEventListener('scroll', updateCameraPosition, { passive: true });
    return () => window.removeEventListener('scroll', updateCameraPosition);
  }, []);

  return null;
};
