import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter } from "react-router-dom";
import showdown from "showdown";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage.react";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage.react";
import ValidateEmailPage from "./components/ValidateEmailPage/ValidateEmailPage.react";
import { StateProvider } from "./utils/State";
import CoursesPage from "./components/CoursesPage/CoursesPage";
import CreateCoursePage from "./components/CreateCoursePage/CreateCoursePage";
import CourseIndex from "./courseIndex";
import PrivateRoute from "./PrivateRoute";

showdown.setFlavor("github");

const routing = (
  <StateProvider>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/forgotPassword" component={ForgotPasswordPage} />
        <Route path="/user/changePassword" component={ResetPasswordPage} />
        <Route path="/user/validateEmail" component={ValidateEmailPage} />
        <PrivateRoute exact path="/courses" component={CoursesPage} />
        <PrivateRoute path="/courses/create" component={CreateCoursePage} />
        <PrivateRoute path="/courses/:courseId/" component={CourseIndex} />
        {/* CourseIndex fetches permissions and render the following routes:
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
