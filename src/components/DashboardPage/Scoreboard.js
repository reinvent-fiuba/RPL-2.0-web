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
  filters: {
    display: "flex",
    alignItems: "center",
  },
  currentUserRow: {
    backgroundColor: theme.palette.success.light,
  },
});

type Props = {
  match: any,
  classes: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
};

class Scoreboard extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    current: 0,
  };

  componentDidMount() {
    this.loadScoreboad();
  }

  loadScoreboad() {
    const { courseId } = this.props;
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
    const { profile } = this.props.context;

    const cells = [
      <TableCell key={5} align="left">
        {student.position}
      </TableCell>,
      <TableCell key={2} component="th" scope="row">
        <Avatar src={student.img_uri} className={classes.avatar}>
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
      <TableRow className={profile.id === student.id && classes.currentUserRow}>{cells}</TableRow>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderScoreBoard(students: Array<Student>, classes: any) {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
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
    const { scoreboard } = this.state;

    return (
      <div>
        <br />
        <Grid container className={classes.filters} xs={12}>
          <Grid item xs={12}>
            {scoreboard && this.renderScoreBoard(scoreboard, classes)}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(Scoreboard));
