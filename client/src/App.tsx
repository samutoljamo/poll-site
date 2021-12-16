import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import './App.css';
import {CreatePollForm, Voting, Result, Polls} from "./components";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link"> Create a new poll </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/polls" className="nav-link"> Newest polls </NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <CreatePollForm/>
          </Route>
          <Route path="/vote/:id" component={Voting}/>
          <Route path="/results/:id" component={Result}/>
          <Route path="/polls" component={Polls}/>
        </Switch>
        
      </div>
    </Router>
  );
}

export default App;
