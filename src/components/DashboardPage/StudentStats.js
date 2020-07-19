// @flow
import React from "react";
import palette from "google-palette";
import { Pie } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import statsService from "../../services/statsService";
import getText from "../../utils/messages";

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
    this.loadStats();
  }

  loadStats() {
    let submissionsStats;
    const { courseId } = this.props;
    return statsService
      .getMySubmissionsStats(courseId)
      .then(response => {
        submissionsStats = response;
        return statsService.getMyActivitiesStats(courseId);
      })
      .then(activitiesStats => {
        this.setState({ activitiesStats, submissionsStats });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar las stats. Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { error, activitiesStats, submissionsStats } = this.state;

    const dataActivities = {
      labels: ["Empezada", "No empezada", "Resuelta"],
      datasets: [
        {
          data: activitiesStats && [
            activitiesStats.started,
            activitiesStats.not_started,
            activitiesStats.solved,
          ],
          backgroundColor: palette("sequential", 3).map(hex => `#${hex}`),
        },
      ],
    };

    const dataSubmissions = {
      labels: [
        getText("SUCCESS"),
        getText("RUNTIME_ERROR"),
        getText("BUILD_ERROR"),
        getText("FAILURE"),
      ],
      datasets: [
        {
          data: submissionsStats && [
            submissionsStats.success,
            submissionsStats.runtime_error,
            submissionsStats.build_error,
            submissionsStats.failure,
          ],
          backgroundColor: palette("sequential", 4).map(hex => `#${hex}`),
        },
      ],
    };

    const dataScore = {
      labels: ["Obtenidos", "Pendientes"],
      datasets: [
        {
          data: activitiesStats && [
            activitiesStats.obtained_points,
            activitiesStats.total_points - activitiesStats.obtained_points,
          ],
          backgroundColor: palette("sequential", 2).map(hex => `#${hex}`),
        },
      ],
    };

    return (
      <Grid container xs={12} spacing={3} className={classes.plotContainerDiv}>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <Grid item xs={3}>
          <Typography>Mis Actividades</Typography>
          <Pie data={dataActivities} legend={legendOpts} />
        </Grid>
        <Grid item xs={3}>
          <Typography>Mis Entregas</Typography>
          <Pie data={dataSubmissions} />
        </Grid>
        <Grid item xs={3}>
          <Typography>Mis Puntos</Typography>
          <Pie data={dataScore} />
        </Grid>
      </Grid>
    );
  }
}

export default withState(withStyles(styles)(StudentStats));
