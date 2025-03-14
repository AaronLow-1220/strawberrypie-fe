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

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");
  const [config, setConfig] = useState(DEVICE_CONFIGS.desktop);

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      console.log("width: ",width);
      let newType;
      let newConfig;

      if (width < DEVICE_CONFIGS.mobile.breakpoint) {
        newType = "mobile";
        newConfig = DEVICE_CONFIGS.mobile;
      } else if (width < DEVICE_CONFIGS.tablet.breakpoint) {
        newType = "tablet";
        newConfig = DEVICE_CONFIGS.tablet;
      } else {
        newType = "desktop";
        newConfig = DEVICE_CONFIGS.desktop;
      }

      setDeviceType(newType);
      setConfig(newConfig);
      console.log("device type: ",newType);

    };


    window.addEventListener("resize", updateDeviceType);
    updateDeviceType();


    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return { deviceType, config };
};
