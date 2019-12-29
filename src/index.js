import React from 'react';
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from 'react-router-dom'
import App from "./app/App"
import LoginPage from "./components/LoginPage/LoginPage"
import SignupPage from "./components/SignupPage/SignupPage"
import { StateProvider, State } from './utils/State'
import CoursesPage from './components/CoursesPage/CoursesPage';

const routing = (
  <StateProvider>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/courses" component={CoursesPage} />
      </div>
    </Router>
  </StateProvider>
)

ReactDOM.render(routing, document.getElementById('root'))
