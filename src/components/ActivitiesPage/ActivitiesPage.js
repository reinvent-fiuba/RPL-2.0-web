// @flow
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Activity, SubmissionResult } from "../../types";
import "./ActivitiesPage.css";
import SubmissionsSidePanel from "./SubmissionsSidePanel.react";

import TestResultsModal from "../SolveActivityPage/TestResultsModal.react";

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
  divider: {
    margin: 20,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "80%",
  },
  tableContainerDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 30px 30px 30px",
  },
  tableTitle: {
    alignSelf: "start",
    paddingLeft: "15px",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  activities: Array<Activity>,
  submissionsPanel: { isOpen: boolean, activityId: ?number },
  isSelectedResult: boolean,
  selectedResult: ?SubmissionResult,
};

class ActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    activities: [],
    submissionsPanel: { isOpen: false, activityId: null },
    isSelectedResult: false,
    selectedResult: null,
  };

  componentDidMount() {
    const { match } = this.props;
    activitiesService
      .getAllActivities(match.params.courseId)
      .then(response => {
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

  setOpenPanel(activityId: number) {
    this.setState({ submissionsPanel: { isOpen: true, activityId } });
  }

  setClosePanel() {
    this.setState({ submissionsPanel: { isOpen: false, activityId: null } });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleCellClick(event: any, activityId: number) {
    const { history, match } = this.props;
    history.push(`/courses/${match.params.courseId}/activities/${activityId}`);
  }

  renderCategoryActivities(activities: Array<Activity>, classes: any) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Typography variant="h5" color="textSecondary" component="p" className={classes.tableTitle}>
          {activities[0].category_name}
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              <TableCell key={1}>Nombre</TableCell>
              <TableCell key={2} align="right">
                Última actividad
              </TableCell>
              <TableCell key={3} align="right">
                Puntos
              </TableCell>
              <TableCell key={4} align="right">
                Estado
              </TableCell>
              <TableCell key={5} align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(activity => (
              <TableRow hover key={activity.id}>
                <TableCell
                  key={1}
                  component="th"
                  scope="row"
                  onClick={event => this.handleCellClick(event, activity.id)}
                >
                  {activity.name}
                </TableCell>
                <TableCell key={2} align="right">
                  {(activity.last_submission_date && activity.last_submission_date.split("T")[0]) ||
                    "-"}
                </TableCell>
                <TableCell key={3} align="right">
                  {15}
                </TableCell>
                <TableCell key={4} align="right">
                  {activity.submission_status || "SIN EMPEZAR"}
                </TableCell>
                <TableCell key={5} align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.setOpenPanel(activity.id)}
                  >
                    Ver entregas
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  handleClickOnSubmission(submission: SubmissionResult, idx: number) {
    this.setState(prevState => ({
      submissionsPanel: { isOpen: false, activityId: prevState.submissionsPanel.activityId },
    }));
    setTimeout(() => {
      this.setState({ isSelectedResult: true, selectedResult: submission });
    }, 200);
  }

  handleCloseModal(e: Event) {
    e.preventDefault();
    this.setState({ isSelectedResult: false });
    setTimeout(() => {
      this.setState(prevState => ({
        submissionsPanel: { isOpen: true, activityId: prevState.submissionsPanel.activityId },
        selectedResult: null,
      }));
    }, 200);

    // this.setState({ isSelectedResult: false, selectedResult: null, openPanel: true });
  }

  render() {
    const { classes, match } = this.props;

    const {
      activities,
      isSideBarOpen,
      error,
      submissionsPanel,
      selectedResult,
      isSelectedResult,
    } = this.state;

    console.log(activities);

    const activitiesByCategory = _.groupBy(activities, "category_name");
    console.log(activitiesByCategory);

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <SubmissionsSidePanel
          isOpen={submissionsPanel.isOpen}
          activityId={submissionsPanel.activityId}
          courseId={match.params.courseId}
          backdropClicked={() => this.setClosePanel()}
          onSelectSubmission={(s, i) => this.handleClickOnSubmission(s, i)}
        />

        <TestResultsModal
          results={selectedResult}
          open={isSelectedResult}
          handleCloseModal={e => this.handleCloseModal(e)}
          showWaitingDialog={false}
        />

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
          <Fab
            color="primary"
            aria-label="add"
            className={classes.rightButton}
            component={Link}
            to={`/courses/${match.params.courseId}/activity/create`}
          >
            <AddIcon />
          </Fab>

          {activities &&
            Object.keys(activitiesByCategory).map(category => (
              <div key={category} className={classes.tableContainerDiv}>
                {this.renderCategoryActivities(activitiesByCategory[category], classes)}
              </div>
            ))}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
