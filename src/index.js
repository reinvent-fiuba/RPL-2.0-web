import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter } from "react-router-dom";
import showdown from "showdown";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import { StateProvider } from "./utils/State";
import CoursesPage from "./components/CoursesPage/CoursesPage";
import CreateCoursePage from "./components/CreateCoursePage/CreateCoursePage";
import CreateActivityPage from "./components/CreateActivityPage/CreateActivityPage";
import AddActivityCorrectionTests from "./components/AddActivityCorrectionTests/AddActivityCorrectionTests.react";
import SolveActivityPage from "./components/SolveActivityPage/SolveActivityPage";
import ActivitiesPage from "./components/ActivitiesPage/ActivitiesPage";

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
        <Route exact path="/courses/:courseId/activities" component={ActivitiesPage} />
        <Route path="/courses/:courseId/activity/create" component={CreateActivityPage} />
        <Route
          exact
          path="/courses/:courseId/activities/:activityId/edit"
          component={CreateActivityPage}
        />
        <Route
          path="/courses/:courseId/activities/:activityId/edit/correction"
          component={AddActivityCorrectionTests}
        />
        <Route
          exact
          path="/courses/:courseId/activities/:activityId"
          component={SolveActivityPage}
        />
      </div>
    </BrowserRouter>
  </StateProvider>
);

ReactDOM.render(routing, document.getElementById("root"));
