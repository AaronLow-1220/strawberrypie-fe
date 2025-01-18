import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//header
import { Header } from "./components/Header";
//Test
import { PsychologicalTest } from "./components/PsychologicalTest/Main";
//HomePage
import { HomePage } from "./components/HomePage/Main";

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
        <Route path="/PsychologicalTest" element={<PsychologicalTest />} />
      </Routes>
    </Router>
  );
}

export default App;
