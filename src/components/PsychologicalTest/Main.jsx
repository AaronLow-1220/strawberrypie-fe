import { Question } from "./Question/Question";
import { useState, useEffect } from "react";
export const PsychologicalTest = () => {
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);
  const [ipadWindowWidthTrue, setIpadWindowWidthTrue] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidthTrue(false);
        setIpadWindowWidthTrue(true);
      } else {
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {windowWidthTrue === true ? (
        <>
          <div
            className="flex justify-between items-center"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <div className="max-w-[33.75rem] w-full mx-auto h-[300px] bg-white text-black text-3xl">
              Test
            </div>
            <Question />
          </div>
        </>
      ) : (
        <>
          <div>
            <div
              className={
                ipadWindowWidthTrue
                  ? "h-[300px] max-w-[33.75rem] mx-auto bg-white text-black text-3xl mt-[5%]"
                  : "h-[300px] w-full bg-gray-200 text-black text-2xl"
              }
            >
              Test
            </div>
            <Question />
          </div>
        </>
      )}
    </>
  );
};
