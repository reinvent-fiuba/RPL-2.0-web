import React from "react";
import { Route, Redirect } from "react-router-dom";
import { withState } from "./utils/State";
import PrivateRoute from "./PrivateRoute";
import PageWrapper from "./utils/PageWrapper";
import CreateActivityPage from "./components/CreateActivityPage/CreateActivityPage";
import AddActivityCorrectionTests from "./components/AddActivityCorrectionTests/AddActivityCorrectionTests.react";
import SolveActivityPage from "./components/SolveActivityPage/SolveActivityPage";
import FinalActivitiesPage from "./components/FinalActivitiesPage/FinalActivitiesPage";
import ActivitiesPage from "./components/ActivitiesPage/ActivitiesPage";
import ActivitiesTeacherPage from "./components/ActivitiesTeacherPage/ActivitiesTeacherPage";
import StudentsTeachersPage from "./components/StudentsTeachersPage/StudentsTeachersPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import coursesService from "./services/coursesService";
import EditCoursePage from "./components/EditCoursePage/EditCoursePage";

class CourseIndex extends React.PureComponent {
  componentDidMount() {
    const courseId = parseInt(this.props.match.params.courseId);
    if (
      !isNaN(courseId) &&
      (!this.props.context.permissions ||
        !this.props.context.course ||
        this.props.context.course.id !== courseId)
    ) {
      this.props.context.invalidateByKeys("permissions", "course", "activities");
      coursesService
        .getPermissions(courseId)
        .then(permissions => {
          if (permissions.length === 0) return this.props.history.goBack();
          return this.props.context.set("permissions", permissions);
        })
        .then(() => coursesService.get(courseId))
        .then(course => this.props.context.set("course", course))
        .catch(() => this.props.history.goBack());
    }
  }

  render() {
    const { courseId } = this.props.match.params;
    const { permissions } = this.props.context;
    if (!permissions) {
      return null;
    }
    const activityPage = permissions.includes("activity_manage")
      ? ActivitiesTeacherPage
      : ActivitiesPage;

    const mainCourseRoute = permissions.includes("activity_manage")
      ? `/courses/${courseId}/dashboard`
      : `/courses/${courseId}/activities`;

    return (
      <>
        <Route exact path="/courses/:courseId" render={() => <Redirect to={mainCourseRoute} />} />
        <PrivateRoute
          exact
          path="/courses/:courseId/edit"
          component={EditCoursePage}
          layout={PageWrapper}
          title="Editar Curso"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/activities"
          component={activityPage}
          layout={PageWrapper}
          title="Actividades"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/dashboard"
          component={DashboardPage}
          layout={PageWrapper}
          title="Dashboard"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/students"
          component={StudentsTeachersPage}
          layout={PageWrapper}
          title="Incriptos"
        />
        <PrivateRoute
          path="/courses/:courseId/activity/create"
          component={CreateActivityPage}
          layout={PageWrapper}
          title="Crear Actividad"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/activities/:activityId/edit"
          component={CreateActivityPage}
          layout={PageWrapper}
          title="Editar Actividad"
        />
        <PrivateRoute
          path="/courses/:courseId/activities/:activityId/edit/correction"
          component={AddActivityCorrectionTests}
          layout={PageWrapper}
          title="Editar Actividad"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/activities/:activityId"
          component={SolveActivityPage}
          layout={PageWrapper}
          title="Resolver Actividad"
        />
        <PrivateRoute
          exact
          path="/courses/:courseId/activities/:activityId/definitives"
          component={FinalActivitiesPage}
          layout={PageWrapper}
          title="Actividades Definitivas"
        />
      </>
    );
  }
}

export default withState(CourseIndex);
