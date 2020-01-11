import React from 'react';
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router} from 'react-router-dom'
import App from "./app/App"
import LoginPage from "./components/LoginPage/LoginPage"
import SignupPage from "./components/SignupPage/SignupPage"
import { StateProvider, State } from './utils/State'
import CoursesPage from './components/CoursesPage/CoursesPage';
import CreateCoursePage from './components/CreateCoursePage/CreateCoursePage';
import CreateActivityPage from './components/CreateActivityPage/CreateActivityPage';

const routing = (
  <StateProvider>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route exact path='/courses' component={CoursesPage}/>
        <Route path='/courses/create' component={CreateCoursePage}/>
        <Route path='/activity/create' component={CreateActivityPage}/>
      </div>
    </Router>
  </StateProvider>
)

ReactDOM.render(routing, document.getElementById('root'))
