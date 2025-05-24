import Header from "./components/header-component/header";
import Home from "./components/home-component/home";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="content-area">
        <Home />
      </main>
    </div>
  );
};

export default App;
