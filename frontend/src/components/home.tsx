import React from "react";
import Reminder from "./reminder-component/reminder";
import Checklist from "./checklist";
import Locater from "./locater";

const Home = () => {
  return (
    <div>
      Home
      <Reminder />
      <Checklist />
      <Locater />
    </div>
  );
};

export default Home;
