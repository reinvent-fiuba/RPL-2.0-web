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

import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import submissionsService from "../../services/submissionsService";
import coursesService from "../../services/coursesService";
import ativitiesService from "../../services/activitiesService";
import StudentStats from "./StudentStats";
import TeacherStats from "./TeacherStats";


import { withState } from "../../utils/State";

import ErrorNotification from "../../utils/ErrorNotification";

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
    padding: "0px 30px 30px 30px",
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

  // eslint-disable-next-line class-methods-use-this
  renderHeadRow(classes: any) {
    const cells = [
      <TableCell key={1}>#</TableCell>,
      <TableCell key={2} className={classes.tableAvatarColumn} />,
      <TableCell key={3}>Alumno</TableCell>,
      <TableCell key={4} align="right">
        Score
      </TableCell>,
      <TableCell key={5} align="right">
        # Actividades Completadas
      </TableCell>,
    ];
    return <TableRow key={0}>{cells}</TableRow>;
  }

  // eslint-disable-next-line class-methods-use-this
  renderStudentRow(student: any, classes: any) {
    const cells = [
      <TableCell key={5} align="left">
        {student.position}
      </TableCell>,
      <TableCell key={2} component="th" scope="row">
        <Avatar className={classes.avatar}>
          {student.name[0]}
          {student.surname[0]}
        </Avatar>
      </TableCell>,
      <TableCell key={3} component="th" scope="row">
        {`${student.name} ${student.surname}`}
      </TableCell>,
      <TableCell key={4} align="right">
        {student.score}
      </TableCell>,
      <TableCell key={5} align="right">
        {student.activities_count}
      </TableCell>,
    ];

    return (
      <TableRow hover key={student.student_id}>
        {cells}
      </TableRow>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderScoreBoard(students: Array<Student>, classes: any) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>{this.renderHeadRow(classes)}</TableHead>
          <TableBody>
            {students.map((student, i) =>
              this.renderStudentRow(Object.assign(student, { position: i + 1 }), classes)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes, match, context } = this.props;
    const { permissions } = context;
    const { isSideBarOpen, error, scoreboard } = this.state;

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
          {permissions.includes("user_manage") ? (
            <TeacherStats courseId={match.params.courseId} />
          ) : (
            <StudentStats courseId={match.params.courseId} />
          )}
          <Grid container xs={12} spacing={3} className={classes.plotContainerDiv}>
            <Grid className={classes.tableContainerDiv} item xs={12}>
              {scoreboard && this.renderScoreBoard(scoreboard, classes)}
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
