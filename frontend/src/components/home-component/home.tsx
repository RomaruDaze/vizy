import React from "react";
import "./home.styles.css";
import Reminder from "./reminder-component/reminder";
import Checklist from "./checklist-component/checklist";
import Locater from "./locator-component/locater";

const Home = () => {
  return (
    <div>
      <div className="container-top">
        <Reminder />
        <Locater />
      </div>
      <Checklist />
    </div>
  );
};

export default Home;
