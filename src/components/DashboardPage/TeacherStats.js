// @flow
import React from "react";
import palette from "google-palette";
import { Pie } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CalendarHeatmap from "react-calendar-heatmap";
import submissionsService from "../../services/submissionsService";
import ativitiesService from "../../services/activitiesService";

import { withState } from "../../utils/State";

import "react-calendar-heatmap/dist/styles.css";

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

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <br />
        <Grid container xs={12} spacing={3}>
          <Grid item xs={4}>
            <Typography>Totales</Typography>
            <div className={classes.calendarHeatmap}>
              <CalendarHeatmap
                startDate={new Date("2020-04-13")}
                endDate={new Date("2020-08-10")}
                showWeekdayLabels
                values={[{ date: "2020-05-13", count: 1 }, { date: "2020-07-20", count: 1 }, { date: "2020-08-01", count: 1 }]}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography>Exitos</Typography>
            <div className={classes.calendarHeatmap}>
              <CalendarHeatmap
                startDate={new Date("2020-04-13")}
                endDate={new Date("2020-08-10")}
                showWeekdayLabels
                values={[{ date: "2020-05-13", count: 1 }, { date: "2020-07-20", count: 4 }, { date: "2020-08-01", count: 5 }]}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography>Fallidas</Typography>
            <div className={classes.calendarHeatmap}>
              <CalendarHeatmap
                startDate={new Date("2020-04-13")}
                endDate={new Date("2020-08-10")}
                showWeekdayLabels
                values={[{ date: "2020-05-13", count: 1 }, { date: "2020-07-20", count: 2 }, { date: "2020-08-01", count: 3 }]}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(StudentStats));
