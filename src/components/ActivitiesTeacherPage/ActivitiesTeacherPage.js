// @flow
import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Activity } from "../../types";
import ActivitiesTeacherTable from "./ActivitiesTeacherTable.react";

const _ = require("lodash");

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  tableContainerDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 30px 30px 30px",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  activities: Array<Activity>,
};

class ActivitiesTeacherPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    activities: [],
  };

  componentDidMount() {
    const { context } = this.props;
    if (context && context.activities) {
      this.setState({ activities: context.activities });
    } else {
      this.getAllActivities();
    }
  }

  getAllActivities() {
    const { match } = this.props;
    activitiesService
      .getAllActivities(match.params.courseId)
      .then(response => {
        this.props.context.set("activities", response);
        this.setState({ activities: response });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener las actividades, Por favor reintenta",
          },
        });
      });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleClickOnActivityTitle(event: any, activityId: number) {
    const { history, match } = this.props;
    history.push(`/courses/${match.params.courseId}/activities/${activityId}/edit`);
  }

  handleNotImplementedYet(e: Event, activityId: number) {
    e.preventDefault();
    alert(`Not implemented... YET!  ${activityId}`);
  }

  handleDeleteActivity(activityId: number) {
    const { match } = this.props;
    activitiesService
      .deleteActivity(match.params.courseId, activityId)
      .then(() => {
        this.getAllActivities();
      })
      .catch(err => {
        console.error(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al eliminar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleDisableActivity(activityId: number, newStatus: boolean) {
    const { match } = this.props;
    activitiesService
      .disableActivity(match.params.courseId, activityId, newStatus)
      .then(() => {
        this.getAllActivities();
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al ocultar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleClickActivityResults(event: Event, activityId: number) {
    const { history, match } = this.props;
    history.push(`/courses/${match.params.courseId}/activities/${activityId}/definitives`);
  }

  render() {
    const { classes, match, context } = this.props;

    const { activities, isSideBarOpen, error } = this.state;

    const nonDeletedActivities = _.filter(activities, activity => !activity.deleted);
    const activitiesByCategory = _.groupBy(nonDeletedActivities, "category_name");

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Actividades"
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          courseId={match.params.courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />

          {context.permissions && context.permissions.includes("activity_manage") ? (
            <Fab
              color="primary"
              aria-label="add"
              className={classes.rightButton}
              component={Link}
              to={`/courses/${match.params.courseId}/activity/create`}
            >
              <AddIcon />
            </Fab>
          ) : (
            <div />
          )}

          {nonDeletedActivities &&
            Object.keys(activitiesByCategory)
              .sort((a, b) => (a > b ? 1 : -1))
              .map(category => (
                <div key={category} className={classes.tableContainerDiv}>
                  <ActivitiesTeacherTable
                    activities={activitiesByCategory[category]}
                    onClickActivityResults={(e, activityId) =>
                      this.handleClickActivityResults(e, activityId)}
                    onClickDeleteActivity={activityId => this.handleDeleteActivity(activityId)}
                    onClickDisableActivity={(activityId, newStatus) =>
                      this.handleDisableActivity(activityId, newStatus)
                    }
                    handleActivityRowClick={(event, activityId) =>
                      this.handleClickOnActivityTitle(event, activityId)}
                  />
                </div>
              ))}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesTeacherPage));
