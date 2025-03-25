import { useState, useEffect } from "react";

const DEVICE_CONFIGS = {
  mobile: {
    breakpoint: 768,
    initialPosition: 11,
    baseScale: 0.8,
    animateClass: "animate-Logo",
  },
  tablet: {
    breakpoint: 1536,
    initialPosition: 9,
    baseScale: 1,
    animateClass: "animate-IpadLogo",
  },
  desktop: {
    initialPosition: 17,
    baseScale: 1,
    animateClass: "",
  },
};

const getDeviceType = (width) => {
  if (width < DEVICE_CONFIGS.mobile.breakpoint) {
    return "mobile";
  } else if (width < DEVICE_CONFIGS.tablet.breakpoint) {
    return "tablet";
  }
  return "desktop";
};

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(() => getDeviceType(window.innerWidth));
  const [config, setConfig] = useState(() => DEVICE_CONFIGS[getDeviceType(window.innerWidth)]);

  useEffect(() => {
    let timeoutId;
    
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const newType = getDeviceType(width);
      
      if (newType !== deviceType) {
        setDeviceType(newType);
        setConfig(DEVICE_CONFIGS[newType]);
      }
    };

    const debouncedUpdate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(updateDeviceType, 100);
    };

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [deviceType]);

  return { deviceType, config };
};
