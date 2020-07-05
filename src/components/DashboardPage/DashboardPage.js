// @flow
import React from "react";
import palette from "google-palette";
import { Pie } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import submissionsService from "../../services/submissionsService";
import coursesService from "../../services/coursesService";
import ativitiesService from "../../services/activitiesService";
import StudentStats from "./StudentStats";
import TeacherStats from "./TeacherStats";


import { withState } from "../../utils/State";

import ErrorNotification from "../../utils/ErrorNotification";
import StudentCategoryStats from "./StudentCategoryStats";
import CategoryStats from "./CategoryStats";
import Scoreboard from "./Scoreboard";

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
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "75%",
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
  tableAvatarColumn: {
    width: theme.spacing(5),
  },
  tableIconsColumn: {
    width: theme.spacing(20),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "0.75rem",
  },
  plotContainerDiv: {
    alignItems: "center",
    justifyContent: "center",
  },
  plotPaper: {
    width: "80%",
    height: "400px",
  },
  plot: {
    height: "100%",
  },
  calendarHeatmap: {
    marginTop: theme.spacing(2),
    width: "75%",
    fontFamily: "sans-serif",
  },
  dashboardContainer: {
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    margin: `0 auto`,
    marginBottom: theme.spacing(5),
  },
});

const legendOpts = {
  display: true,
  fullWidth: false,
  position: "left",
  reverse: false,
  labels: {
    fontSize: 10,
  },
};

type Props = {
  match: any,
  classes: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
};

class ActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    current: 0,
  };

  componentDidMount() {
    this.loadScoreboad();
  }

  loadScoreboad() {
    const { courseId } = this.props.match.params;
    return coursesService
      .getScoreboard(courseId)
      .then(scoreboard => this.setState({ scoreboard }))
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar el scoreboard. Por favor reintenta",
          },
        });
      });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleChange(event, newValue) {
    this.setState({ current: newValue });
  }

  render() {
    const { classes, match, context } = this.props;
    const { permissions } = context;
    const { isSideBarOpen, error, scoreboard } = this.state;

    const teacherStats = [
      <Scoreboard courseId={match.params.courseId} />,
      <TeacherStats courseId={match.params.courseId} />,
      <StudentCategoryStats className={classes.stats} courseId={match.params.courseId} />,
      <CategoryStats className={classes.stats} courseId={match.params.courseId} />,
    ];

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Dashboard"
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          courseId={match.params.courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <div className={classes.dashboardContainer}>
            {permissions.includes("user_manage") ? (
              <div>
                <Paper className={classes.root}>
                  <Tabs
                    value={this.state.current}
                    onChange={(event, newValue) => this.handleChange(event, newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Scoreboard" />
                    <Tab label="General" />
                    <Tab label="Entregas por alumno y categoría" />
                    <Tab label="Entregas por categorías" />
                  </Tabs>
                </Paper>
                {teacherStats[this.state.current]}
              </div>
            ) : (
              <div>
                <StudentStats courseId={match.params.courseId} />
                <Scoreboard courseId={match.params.courseId} />
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
