import { useEffect, useState } from "react";

export const Header = () => {
  const [isHome, setIsHome] = useState(false);
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        //手機
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        //平板直立
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1584) {
        //平板
        setWindowWidthTrue(true);
      } else {
        //電腦
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {windowWidthTrue == true ? (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="w-full h-[4rem] flex justify-center items-center px-[1rem]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(27, 8, 10, 0.5) 0%, rgba(27, 8, 10, 0) 100%)",
            }}
          >
            <div
              className="text-[#838383] hover:text-[#FFFFFF] text-[1.5rem] mx-[1.6875rem] mt-[1rem]"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              組別介紹
            </div>
            <div
              className="text-[#838383] hover:text-[#FFFFFF] text-[1.5rem] mx-[1.6875rem] mt-[1rem]"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              集章兌換
            </div>
            {!isHome && ( // 如果不是首頁才顯示
              <img
                src="/Headline.svg"
                alt="Example"
                style={{
                  width: "7.5rem",
                  height: "auto",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            )}
            <div
              className="text-[#838383] hover:text-[#FFFFFF] text-[1.5rem] mx-[1.6875rem] mt-[1rem]"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              心理測驗
            </div>
            <div
              className="text-[#838383] hover:text-[#FFFFFF] text-[1.5rem] mx-[1.6875rem] mt-[1rem]"
              style={{
                textShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              意見回饋
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="w-full h-[4rem] flex justify-between items-center px-[1rem]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(27, 8, 10, 0.5) 0%, rgba(27, 8, 10, 0) 100%)",
            }}
          >
            <img
              src="/menu.svg"
              alt="Example"
              style={{
                width: "28px",
                height: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {!isHome && ( // 如果不是首頁才顯示
              <img
                src="/Headline.svg"
                alt="Example"
                style={{
                  width: "7.5rem",
                  height: "auto",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            )}
            <img
              src="/collect.svg"
              alt="Example"
              style={{
                width: "28px",
                height: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          </div>

          <div
            className={`absolute top-0 right-0 w-full h-[33.75rem] z-[-10] transition-transform duration-500 ease-in-out origin-top-right ${
              menuOpen
                ? "scale-y-100 opacity-100 translate-y-0"
                : "scale-y-0 opacity-100 -translate-y-10"
            }`}
            style={{
              backgroundImage: "url(/wave-nav_0.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center -330px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <ul className="flex flex-col pt-[103px]">
              <a
                className=" pb-[2.25rem] text-[#FFFFFF] text-center text-[2rem] "
                style={{ fontFamily: "B" }}
                href="/"
              >
                <div className="flex justify-center items-center">
                  <div>組別介紹</div>
                  <div className="ms-[1rem]">
                    <img src="/category.svg" alt="Example" />
                  </div>
                </div>
              </a>
              <a
                className=" pb-[2.25rem] text-[#FFFFFF] text-center text-[2rem]"
                style={{ fontFamily: "B" }}
                href="/about"
              >
                <div className="flex justify-center items-center">
                  <div>集章兌換</div>
                  <div className="ms-[1rem]">
                    <img src="/feedback.svg" alt="Example" />
                  </div>
                </div>
              </a>
              <a
                className=" pb-[2.25rem] text-[#FFFFFF] text-center text-[2rem]"
                style={{ fontFamily: "B" }}
                href="/services"
              >
                <div className="flex justify-center items-center">
                  <div>心裏測驗</div>
                  <div className="ms-[1rem]">
                    <img src="/psychology.svg" alt="Example" />
                  </div>
                </div>
              </a>
              <a
                className="text-[#FFFFFF] text-center text-[2rem]"
                style={{ fontFamily: "B" }}
                href="/contact"
              >
                <div className="flex justify-center items-center">
                  <div>意見回饋</div>
                  <div className="ms-[1rem]">
                    <img src="/stamp.svg" alt="Example" />
                  </div>
                </div>
              </a>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
