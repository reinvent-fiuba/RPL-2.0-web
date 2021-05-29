// @flow
import React from "react";
import palette from "google-palette";
import { Bar } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";

import { Grid } from "@material-ui/core";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";
import statsService from "../../services/statsService";

import { withState } from "../../utils/State";

const _ = require("lodash");

const styles = theme => ({
  table: {
    // minWidth: 650,
  },
  tableContainer: {
    // width: "80%",
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
  filters: {
    display: "flex",
    alignItems: "center",
  },
  search: {
    margin: "0 auto",
    display: "flex",
  },
  status: {
    height: theme.spacing(1.5),
    width: theme.spacing(1.5),
    borderRadius: "50%",
    display: "inline-block",
  },
  activeStatus: {
    backgroundColor: theme.palette.success.main,
  },
  inactiveStatus: {
    backgroundColor: theme.palette.error.main,
  },
});

type Props = {
  courseId: number,
  match: any,
  classes: any,
};

type State = {
  error: { open: boolean, message: ?string },
  categories: any,
  activities: any,
  allActivities: any,
  activityId: any,
  activitiesStats: any,
};

class ActivityStats extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    categories: [],
    allActivities: [],
    activities: [],
    activityId: undefined,
    activitiesStats: undefined,
  };

  componentDidMount() {
    const { courseId } = this.props;
    let categories;
    return activitiesService
      .getActivityCategories(courseId)
      .then(activityCategories => {
        categories = activityCategories.sort((a, b) => (a.name > b.name ? 1 : -1));
      })
      .then(() => activitiesService.getAllActivities(courseId))
      .then(activities => activities.filter(activity => activity.active))
      .then(activities => this.setState({ categories, activities, allActivities: activities }));
  }

  onCategoryChange(categoryId) {
    this.setState({
      activities: this.state.allActivities
        .filter(activity => activity.category_id === categoryId)
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
    });
  }

  searchCategoryStats() {
    const { courseId } = this.props;
    const { activityId } = this.state;
    if (!activityId) {
      return Promise.resolve();
    }
    return statsService.getActivityStatsByStudent(courseId, activityId).then(response => {
      this.setState({ activitiesStats: response });
    });
  }

  renderActivities() {
    const { classes } = this.props;
    const { activitiesStats } = this.state;

    const { metadata, submissions_stats } = activitiesStats;
    const data = _.zipWith(submissions_stats, metadata, (stat, meta) => ({
      ...stat,
      ...meta,
    }));

    const dataOrderedByQuantityDesc = data.sort((a, b) => (a.total < b.total ? 1 : -1));

    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              <TableCell key={1}>#</TableCell>
              <TableCell key={2}>Nombre</TableCell>
              <TableCell key={3}>Apellido</TableCell>
              <TableCell key={4}>Padron</TableCell>
              <TableCell key={5}>Envios exitosos</TableCell>
              <TableCell key={6}>Envios totales</TableCell>
              <TableCell key={7}>Resuelto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrderedByQuantityDesc.map((student, i) => (
              <TableRow key={i}>
                <TableCell key={1}>{i}</TableCell>
                <TableCell key={2}>{student.name}</TableCell>
                <TableCell key={3}>{student.surname}</TableCell>
                <TableCell key={4}>{student.student_id}</TableCell>
                <TableCell key={5}>{student.success}</TableCell>
                <TableCell key={6}>{student.total}</TableCell>
                <TableCell key={7} align="center">
                  <span
                    className={`${classes.status} ${
                      student.success ? classes.activeStatus : classes.inactiveStatus
                    }`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <br />
        <Grid container className={classes.filters} xs={12} spacing={3}>
          <Grid item xs={5}>
            <Autocomplete
              margin="normal"
              options={this.state.categories}
              id="category"
              name="category"
              autoComplete="category"
              onChange={(event, newValue) => this.onCategoryChange(newValue.id)}
              getOptionLabel={category => `${category.name}`}
              renderInput={params => <TextField {...params} label="Categoria" margin="normal" />}
            />
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              margin="normal"
              options={this.state.activities}
              id="activity"
              name="activity"
              autoComplete="activity"
              onChange={(event, newValue) => this.setState({ activityId: newValue.id })}
              getOptionLabel={activity => `${activity.name}`}
              renderInput={params => <TextField {...params} label="Actividad" margin="normal" />}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className={classes.search}
              variant="outlined"
              color="primary"
              onClick={() => this.searchCategoryStats()}
            >
              Buscar
            </Button>
          </Grid>
          <Grid item xs={12}>
            {this.state.activitiesStats && this.renderActivities()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivityStats));
