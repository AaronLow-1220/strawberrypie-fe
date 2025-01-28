import { useEffect, useState } from "react";

export const Unit = ({ title, img, img2, img3, img4, imgWidth }) => {
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidthTrue(true);
      } else {
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowWidthTrue === true ? (
    <div className="mt-[4rem]">
      <div
        className="w-[7rem] h-[2.25rem] bg-[#381025] rounded-[39px] text-center flex items-center justify-center mx-auto text-white"
        style={{ fontFamily: "M" }}
      >
        {title}
      </div>
      {img3 != null ? (
        <div className="w-full ">
          <div className="flex flex-wrap justify-center ">
            <img
              src={img}
              alt="Image 1"
              style={{
                width: imgWidth,
                margin: "1.5rem",
              }}
            />
            <img
              src={img2}
              alt="Image 2"
              style={{
                width: imgWidth,
                margin: "1.5rem",
              }}
            />
            <img
              src={img3}
              alt="Image 3"
              style={{
                width: imgWidth,
                margin: "1.5rem",
              }}
            />
            <img
              src={img4}
              alt="Image 4"
              style={{
                width: imgWidth,
                margin: "1.5rem",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-[7.5rem] mx-auto mt-[1.5rem] flex flex-row-reverse justify-center">
          <img
            src={img}
            alt="Image 1"
            className="object-contain"
            style={{ width: imgWidth }}
          />
          {img2 != null && (
            <img
              src={img2}
              className="object-contain me-[4rem]"
              alt="Image 2"
              style={{ width: imgWidth }}
            />
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="mt-[4rem]">
      <div
        className="w-[7rem] h-[2.25rem] bg-[#381025] rounded-[39px] text-center flex items-center justify-center mx-auto text-white text-[1rem]"
        style={{ fontFamily: "M" }}
      >
        {title}
      </div>
      {img3 != null ? (
        <div className="custom-scroll-container">
          <div className="scroll-content first">
            <img src={img} alt="Image 1" />
            <img src={img2} alt="Image 2" />
            <img src={img3} alt="Image 3" />
            <img src={img4} alt="Image 4" />
          </div>
          <div className="scroll-content second">
            <img src={img} alt="Image 1" />
            <img src={img2} alt="Image 2" />
            <img src={img3} alt="Image 3" />
            <img src={img4} alt="Image 4" />
          </div>
        </div>
      ) : (
        <div className="w-[17rem] h-[7.5rem] mx-auto mt-[1.5rem] flex justify-between">
          <img src={img} alt="Image 1" />
          {img2 != null && <img src={img2} alt="Image 2" />}
        </div>
      )}
    </div>
  );
};
