import { useState, useEffect } from "react";

export const Slogan = ({ title, secondTitle }) => {
  const [fontSize, setFontSize] = useState("1rem");
  const [titleFontSize, setTitleFontSize] = useState("2.25rem");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize("1rem");
        setTitleFontSize("2.25rem");
      } else if (window.innerWidth < 1024) {
        setFontSize("1.5rem");
        setTitleFontSize("3.375rem");
      } else {
        setFontSize("2rem");
        setTitleFontSize("4.5rem");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" mx-auto ">
      <div
        className="text-white  text-center weight-[900] leading-[3rem]"
        style={{ fontSize: fontSize }}
      >
        {secondTitle}
      </div>
      <div
        className="text-primary-color text-center weight-[900] leading-[3rem] text-nowrap mt-[1.375rem]"
        style={{ fontSize: titleFontSize }}
      >
        {title}
      </div>
    </div>
  );
};
