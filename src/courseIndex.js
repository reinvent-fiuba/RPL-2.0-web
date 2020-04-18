import React from "react";
import { Route } from "react-router-dom";
import { withState } from "./utils/State";
import CreateActivityPage from "./components/CreateActivityPage/CreateActivityPage";
import AddActivityCorrectionTests from "./components/AddActivityCorrectionTests/AddActivityCorrectionTests.react";
import SolveActivityPage from "./components/SolveActivityPage/SolveActivityPage";
import ActivitiesPage from "./components/ActivitiesPage/ActivitiesPage";
import StudentsPage from "./components/StudentsPage/StudentsPage";
import coursesService from "./services/coursesService";

class CourseIndex extends React.PureComponent {
  componentDidMount() {
    if (!this.props.context.permissions) {
      coursesService.getPermissions(this.props.match.params.courseId).then(permissions => {
        this.props.context.set("permissions", permissions);
      });
    }
  }

  render() {
    if (!this.props.context.permissions) {
      return null;
    }
    return (
      <>
        <Route exact path="/courses/:courseId/activities" component={ActivitiesPage} />
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
      </>
    );
  }
}

export default withState(CourseIndex);
