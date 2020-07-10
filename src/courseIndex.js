import React from "react";
import { Route } from "react-router-dom";
import { withState } from "./utils/State";
import CreateActivityPage from "./components/CreateActivityPage/CreateActivityPage";
import AddActivityCorrectionTests from "./components/AddActivityCorrectionTests/AddActivityCorrectionTests.react";
import SolveActivityPage from "./components/SolveActivityPage/SolveActivityPage";
import FinalActivitiesPage from "./components/FinalActivitiesPage/FinalActivitiesPage";
import ActivitiesPage from "./components/ActivitiesPage/ActivitiesPage";
import ActivitiesTeacherPage from "./components/ActivitiesTeacherPage/ActivitiesTeacherPage";
import StudentsPage from "./components/StudentsPage/StudentsPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import coursesService from "./services/coursesService";
import EditCoursePage from "./components/EditCoursePage/EditCoursePage";

class CourseIndex extends React.PureComponent {
  componentDidMount() {
    const courseId = parseInt(this.props.match.params.courseId);
    if (!isNaN(courseId) &&
      (!this.props.context.permissions || !this.props.context.course || this.props.context.course.id !== courseId)) {
      // TODO: Review permissions by course, in order to support different permissions for different courses
      this.props.context.invalidateByKeys("permissions", "course", "activities");
      coursesService
        .getPermissions(courseId)
        .then(permissions => this.props.context.set("permissions", permissions))
        .then(() => coursesService.get(courseId))
        .then(course => this.props.context.set("course", course));
    }
  }

  render() {
    const { permissions } = this.props.context;
    if (!permissions) {
      return null;
    }
    const activityPage = permissions.includes("activity_manage")
      ? ActivitiesTeacherPage
      : ActivitiesPage;

    return (
      <>
        <Route exact path="/courses/:courseId/edit" component={EditCoursePage} />
        <Route exact path="/courses/:courseId/activities" component={activityPage} />
        <Route exact path="/courses/:courseId/dashboard" component={DashboardPage} />
        <Route exact path="/courses/:courseId/students" component={StudentsPage} />
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
        <Route
          exact
          path="/courses/:courseId/activities/:activityId/definitives"
          component={FinalActivitiesPage}
        />
      </>
    );
  }
}

export default withState(CourseIndex);
