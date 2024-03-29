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
import ProfilePage from "./components/ProfilePage/ProfilePage";
import UsersPage from "./components/UsersPage/UsersPage";
import CreateCoursePage from "./components/CreateCoursePage/CreateCoursePage";
import CloneCoursePage from "./components/CloneCoursePage/CloneCoursePage";
import CourseIndex from "./courseIndex";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageWrapper from "./utils/PageWrapper";

showdown.setFlavor("github");

const routing = (
  <StateProvider>
    <BrowserRouter>
      <PublicRoute exact path="/" component={LoginPage} />
      <PublicRoute path="/login" component={LoginPage} />
      <PublicRoute path="/signup" component={SignupPage} />
      <PublicRoute path="/forgotPassword" component={ForgotPasswordPage} />
      <Route path="/user/changePassword" component={ResetPasswordPage} />
      <Route path="/user/validateEmail" component={ValidateEmailPage} />
      <PrivateRoute
        exact
        path="/users"
        component={UsersPage}
        layout={PageWrapper}
        title="Usuarios"
      />
      <PrivateRoute
        exact
        path="/courses"
        component={CoursesPage}
        layout={PageWrapper}
        title="Cursos"
      />
      <PrivateRoute
        exact
        path="/profile"
        component={ProfilePage}
        layout={PageWrapper}
        title="Perfil"
      />
      <PrivateRoute
        path="/courses/create"
        component={CreateCoursePage}
        layout={PageWrapper}
        title="Crear Curso"
      />
      <Route path="/courses/:courseId/" component={CourseIndex} />
      {/* CourseIndex fetches permissions and render the following routes:
            /courses/:courseId/students
            /courses/:courseId/activity/create
            /courses/:courseId/activities
            /courses/:courseId/activities/:activityId
            /courses/:courseId/activities/:activityId/edit
            /courses/:courseId/activities/:activityId/edit/correction
      */}
      <PrivateRoute
        path="/courses/clone"
        component={CloneCoursePage}
        layout={PageWrapper}
        title="Clonar Curso"
      />
    </BrowserRouter>
  </StateProvider>
);

ReactDOM.render(routing, document.getElementById("root"));
