import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TickerDates from "./pages/TickerDates";
import SignalAnalysisPage from "./pages/SignalAnalysisPage";

import "@/styles/globals.css";
import "@/styles/fonts.css"; // 폰트 파일 가져오기

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dates" element={<TickerDates />} />
      <Route path="/dashboard" element={<SignalAnalysisPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
