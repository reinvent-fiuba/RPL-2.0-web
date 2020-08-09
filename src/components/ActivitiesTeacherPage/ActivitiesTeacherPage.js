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
import ConfirmDeleteActivityModal from "./ConfirmDeleteActivityModal.react";
import CreateActivityCategoryModal from "../CreateActivityPage/CreateActivityCategoryModal";

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
  deleteModal: { open: boolean, activityId: ?number },
  updateCategoryModal: {
    open: boolean,
    activityCategory: any,
  },
};

class ActivitiesTeacherPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    activities: [],
    deleteModal: { open: false, activityId: null },
    updateCategoryModal: { open: false, activityCategory: null },
  };

  componentDidMount() {
    this.getAllActivities();
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

  handleClickDeleteActivity(activityId: number) {
    this.setState({ deleteModal: { open: true, activityId } });
  }

  handleDeleteActivity(activityId: ?number) {
    this.setState({ deleteModal: { open: false, activityId: null } });
    if (!activityId) return;
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

  handleCloseCategoryModal() {
    this.setState({
      updateCategoryModal: {
        open: false,
        activityCategory: null,
      },
    });
  }

  handleClickEditCategory(event: Event, activityCategory: any) {
    event.stopPropagation(); // We don't want to open/close the activity list
    this.setState({
      updateCategoryModal: {
        open: true,
        activityCategory,
      },
    });
  }

  handleEditCategory(courseId: number, activityCategory: any) {
    return activitiesService
      .updateActivityCategory(
        courseId,
        activityCategory.id,
        activityCategory.name,
        activityCategory.description
      )
      .then(() => {
        this.getAllActivities();
        this.handleCloseCategoryModal();
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

    const { activities, isSideBarOpen, error, deleteModal, updateCategoryModal } = this.state;

    const nonDeletedActivities = _.filter(
      activities || (context && context.activities),
      activity => !activity.deleted
    );
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

        <CreateActivityCategoryModal
          open={updateCategoryModal.open}
          key={updateCategoryModal.activityCategory && updateCategoryModal.activityCategory.id}
          handleCloseModal={() => this.handleCloseCategoryModal()}
          handleClickSave={activityCategory =>
            this.handleEditCategory(match.params.courseId, activityCategory)
          }
          activityCategory={updateCategoryModal.activityCategory}
          courseId={match.params.courseId}
          titleText={
            updateCategoryModal.activityCategory &&
            `Editar: ${updateCategoryModal.activityCategory.name}`
          }
          saveButtonText="Guardar"
        />

        <ConfirmDeleteActivityModal
          open={deleteModal.open}
          onDeleteClicked={() => this.handleDeleteActivity(deleteModal.activityId)}
          onCancelClicked={() => this.setState({ deleteModal: { open: false, activityId: null } })}
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
                    activityCategory={{
                      id: activitiesByCategory[category][0].category_id,
                      name: activitiesByCategory[category][0].category_name,
                      description: activitiesByCategory[category][0].category_description,
                    }}
                    activities={activitiesByCategory[category]}
                    onClickEditCategory={(e, activityCategory) =>
                      this.handleClickEditCategory(e, activityCategory)
                    }
                    onClickActivityResults={(e, activityId) =>
                      this.handleClickActivityResults(e, activityId)
                    }
                    onClickDeleteActivity={activityId => this.handleClickDeleteActivity(activityId)}
                    onClickDisableActivity={(activityId, newStatus) =>
                      this.handleDisableActivity(activityId, newStatus)}
                    handleActivityRowClick={(event, activityId) =>
                      this.handleClickOnActivityTitle(event, activityId)
                    }
                  />
                </div>
              ))}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesTeacherPage));
