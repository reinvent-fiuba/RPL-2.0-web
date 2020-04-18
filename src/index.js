import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter } from "react-router-dom";
import showdown from "showdown";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import { StateProvider } from "./utils/State";
import CoursesPage from "./components/CoursesPage/CoursesPage";
import CreateCoursePage from "./components/CreateCoursePage/CreateCoursePage";
import CourseIndex from "./courseIndex";

showdown.setFlavor("github");

const routing = (
  <StateProvider>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route exact path="/courses" component={CoursesPage} />
        <Route path="/courses/create" component={CreateCoursePage} />
        <Route path="/courses/:courseId/" component={CourseIndex} />
        {/* CourseIndex fetch permissions and render the following routes:
              /courses/:courseId/students
              /courses/:courseId/activity/create
              /courses/:courseId/activities
              /courses/:courseId/activities/:activityId
              /courses/:courseId/activities/:activityId/edit
              /courses/:courseId/activities/:activityId/edit/correction
        */}
      </div>
    </BrowserRouter>
  </StateProvider>
);

ReactDOM.render(routing, document.getElementById("root"));
