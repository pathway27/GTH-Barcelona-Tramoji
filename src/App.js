import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { UserPage } from "./pages/UserPage";
import "./index.css";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/user" exact component={UserPage} />
          <Route path="*" component={MainPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
