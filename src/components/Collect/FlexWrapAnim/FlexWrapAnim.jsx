import React, { useEffect, useRef, useState } from "react";
export const FlexWrapAnim = ({ children, duration = "0.3s" }) => {
  const containerRef = useRef(null);
  const [dummyList, setDummyList] = useState([]);

  useEffect(() => {
    const targetClassName = "flex-wrap-anim";
    const cont = containerRef.current;

    if (!cont) return;

    cont.style.position = "relative";
    const items = Array.from(cont.children);
    const newDummyList = [];

    const addDummy = (item, duration) => {
      const top = item.offsetTop;
      const left = item.offsetLeft;

      item.style.position = "absolute";
      item.style.top = `${top}px`;
      item.style.left = `${left}px`;

      const dummyDiv = document.createElement("div");
      dummyDiv.classList.add(`${targetClassName}-dummy`);
      const rect = item.getBoundingClientRect();
      dummyDiv.style.width = `${rect.width}px`;
      dummyDiv.style.height = `${rect.height}px`;
      dummyDiv.style.visibility = "hidden";
      dummyDiv.__pair = item;
      dummyDiv.__duration = duration;

      cont.appendChild(dummyDiv);
      newDummyList.push(dummyDiv);
    };

    // Add dummies
    items.forEach((item) => addDummy(item, duration));
    setDummyList(newDummyList);

    const handleResize = () => {
      newDummyList.forEach((dummyDiv) => {
        const item = dummyDiv.__pair;
        const duration = dummyDiv.__duration;

        if (item.offsetTop !== dummyDiv.offsetTop) {
          item.style.transition = `all ${duration}`;
          item.style.top = `${dummyDiv.offsetTop}px`;
          item.style.left = `${dummyDiv.offsetLeft}px`;
        } else {
          item.style.transition = "";
          item.style.left = `${dummyDiv.offsetLeft}px`;
        }
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      newDummyList.forEach((dummy) => dummy.remove());
    };
  }, [duration]);

  return (
    <div className="flex-wrap-anim" ref={containerRef} data-duration={duration}>
      {React.Children.map(children, (child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
};
