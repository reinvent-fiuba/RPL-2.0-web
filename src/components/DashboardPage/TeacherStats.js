// @flow
import React from "react";
import palette from "google-palette";
import { Pie } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CalendarHeatmap from "react-calendar-heatmap";
import submissionsService from "../../services/submissionsService";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import statsService from "../../services/statsService";

import ativitiesService from "../../services/activitiesService";

import { withState } from "../../utils/State";

import "react-calendar-heatmap/dist/styles.css";

import ErrorNotification from "../../utils/ErrorNotification";

// TOOD Rename file

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
    fontFamily: "sans-serif",
  },
  container: {
    width: "100%",
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
  courseId: number,
  match: any,
  classes: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
};

class StudentStats extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
  };

  componentDidMount() {
    const { courseId } = this.props;
    let submissionsByDate;
    return statsService
      .getSubmissionStatsByDate(courseId)
      .then(response => {
        submissionsByDate = response;
        return statsService.getSubmissionStatsByStudent(courseId);
      })
      .then(submissionsByStudent => {
        this.setState({
          submissionsByDate,
          submissionsByStudent,
          defaultSubmissionsByStudent: submissionsByStudent,
          defaultData: true,
        });
      });
  }

  handleDateClick(value) {
    const { courseId } = this.props;

    if (!value) {
      return this.setState({
        submissionsByStudent: this.state.defaultSubmissionsByStudent,
        defaultData: true,
      });
    }

    const { date } = value;

    return statsService.getSubmissionStatsByStudent(courseId, date).then(submissionsByStudent => {
      return this.setState({ submissionsByStudent, defaultData: false });
    });
  }

  renderStudentsTable() {
    const { classes } = this.props;
    const { submissionsByStudent } = this.state;

    const { metadata, submissions_stats } = submissionsByStudent;
    const data = _.zipWith(submissions_stats, metadata, (stat, meta) => ({
      ...stat,
      ...meta,
    }));

    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              <TableCell key={1}>#</TableCell>
              <TableCell key={2}>Nombre</TableCell>
              <TableCell key={3}>Apellido</TableCell>
              <TableCell key={4}>Usuario</TableCell>
              <TableCell key={5}>Envios exitosos</TableCell>
              <TableCell key={6}>Envios totales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student, i) => (
              <TableRow>
                <TableCell key={1}>{i}</TableCell>
                <TableCell key={2}>{student.name}</TableCell>
                <TableCell key={3}>{student.surname}</TableCell>
                <TableCell key={4}>{student.username}</TableCell>
                <TableCell key={5}>{student.success}</TableCell>
                <TableCell key={6}>{student.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes, context } = this.props;
    const { error, submissionsByDate } = this.state;
    const { course } = context;

    if (!submissionsByDate) {
      return <div></div>;
    }

    const {metadata, submissions_stats} = submissionsByDate;

    const data = _.zipWith(submissions_stats, metadata, (stat, meta) => ({
      count: stat.total,
      date: meta.date,
    }));

    console.log(this.props.context);

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <br />
        <Grid container xs={12}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Typography>Totales</Typography>
            <div className={classes.calendarHeatmap}>
              <CalendarHeatmap
                startDate={new Date(course.semester_start_date)} // TODO: Get semester start and end from backend
                endDate={new Date(course.semester_end_date)}
                onClick={value => this.handleDateClick(value)}
                showWeekdayLabels
                values={data}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={12}>
            {this.renderStudentsTable()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(StudentStats));
