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

import { Collect2 } from "./components/Collect/Main2";

import { ComingSoon } from "./components/ComingSoon";

function App() {
  const [animate, setAnimate] = useState(false);
  const [focus, setFocus] = useState(false);
  // 控制 Header 顯示的狀態
  const [showHeader, setShowHeader] = useState(true);
  
  // Logo 動畫觸發方法
  const handleLogoAnimation = () => {
    setAnimate(true);
  };

  const handleFocus = (target) => {
    setFocus(target);
  };

  return (
    <Router>
      {/* 只有當 showHeader 為 true 時才顯示 Header */}
      {showHeader && (
        <div className={`${focus == true ? "opacity-[60%]" : ""} relative z-20`}>
          <Header />
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={<HomePage handleLogoAnimation={handleLogoAnimation} setShowHeader={setShowHeader} />}
        />
        <Route path="/psychological-test" element={<PsychologicalTest />} />
        <Route path="/group" element={<Group focus={handleFocus} />} />
        <Route path="/result" element={<Result />} />
        <Route path="/collect" element={<ComingSoon />} />
        {/* <Route path="/Result/:id" element={<Result />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
