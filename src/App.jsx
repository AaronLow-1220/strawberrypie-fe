import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//header
import { Header } from "./components/Header";
//Test
import { PsychologicalTest } from "./components/PsychologicalTest/Main";
//HomePage
import { HomePage } from "./components/HomePage/Main";
//Group
import { Group } from "./components/Group/Main";
//Result
import { Result } from "./components/Result/Main";

import { Collect } from "./components/Collect/Main";

function App() {
  const [animate, setAnimate] = useState(false);
  const [focus, setFocus] = useState(false);
  // Logo 動畫觸發方法
  const handleLogoAnimation = () => {
    setAnimate(true);
  };

  const handleFocus = (target) => {
    setFocus(target);
  };

  return (
<<<<<<< HEAD
    <Router>
      <div className={focus == true ? "opacity-[60%]" : ""}>
        <Header />
      </div>
      <Routes>
        <Route
          path="/"
          element={<HomePage handleLogoAnimation={handleLogoAnimation} />}
=======
    <div className="">
      <div>
        <div className="bg-pink-radial">
          <div className="w-full h-full relative flex justify-center items-center">
            <img style={{ maxWidth: "initial" }} className="h-full" src="/Background_web.jpg" alt="" />
          </div>
        </div>
        <Logo beginAnimation={animate} />
        <Model
          onAnimationEnd={handleAnimationEnd} // 傳遞動畫結束回調
          logoAnimation={handleLogoAnimation} // 傳遞 Logo 動畫觸發方法
>>>>>>> f560d55 (refactor: enhance responsiveness of Logo component and update animation logic;)
        />
        <Route path="/psychologicalTest" element={<PsychologicalTest />} />
        <Route path="/group" element={<Group focus={handleFocus} />} />
        <Route path="/result" element={<Result />} />
        <Route path="/collect" element={<Collect />} />
        {/* <Route path="/Result/:id" element={<Result />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
