import React from "react";
import Dashboard from "./dashboard";
import Checklist from "./checklist";
import Locater from "./locater";

const Home = () => {
  return (
    <div>
      Home
      <Dashboard />
      <Checklist />
      <Locater />
    </div>
  );
};

export default Home;
