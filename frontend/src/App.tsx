import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header-component/header";
import Home from "./components/home-component/home";
import Settings from "./components/settings-component/settings";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
