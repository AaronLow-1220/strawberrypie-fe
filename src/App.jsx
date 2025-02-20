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
  // Logo 動畫觸發方法
  const handleLogoAnimation = () => {
    setAnimate(true);
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<HomePage handleLogoAnimation={handleLogoAnimation} />}
        />
        <Route path="/psychologicalTest" element={<PsychologicalTest />} />
        <Route path="/group" element={<Group />} />
        <Route path="/result" element={<Result />} />
        <Route path="/collect" element={<Collect />} />
        {/* <Route path="/Result/:id" element={<Result />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
