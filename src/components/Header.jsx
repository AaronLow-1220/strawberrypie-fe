import { useEffect, useState } from "react";

export const Header = () => {
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <div
        className="w-full navHeight  flex justify-between items-center px-[1rem]"
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
    </div>
  );
};
