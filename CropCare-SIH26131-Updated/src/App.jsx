import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import DetectDisease from "./pages/DetectDisease";
import Result from "./pages/Result";
import Advisory from "./pages/Advisory";
import Reports from "./pages/Reports";
import RiskForecast from "./pages/RiskForecast";
import HotspotMap from "./pages/HotspotMap";
import ExpertValidation from "./pages/ExpertValidation";
import Profile from "./pages/Profile";

function App() {
  return <LanguageProvider><BrowserRouter><PageTransition><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/detect" element={<DetectDisease />} />
    <Route path="/result" element={<Result />} />
    <Route path="/advisory" element={<Advisory />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/risk" element={<RiskForecast />} />
    <Route path="/map" element={<HotspotMap />} />
    <Route path="/expert" element={<ExpertValidation />} />
    <Route path="/profile" element={<Profile />} />
  </Routes></PageTransition></BrowserRouter></LanguageProvider>;
}
export default App;
