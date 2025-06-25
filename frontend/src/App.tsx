import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home-component/home";
import Settings from "./components/settings-component/settings";
import Locator from "./components/locator-component/locator";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <main className="content-area">
          <Routes>
            <Route path="/vizy/" element={<Home />} />
            <Route path="/vizy/settings" element={<Settings />} />
            <Route path="/vizy/locator" element={<Locator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
