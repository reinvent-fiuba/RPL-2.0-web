// @flow
import React from "react";
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
import { Link } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Activity } from "../../types";

const _ = require("lodash");

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
  title: {
    marginTop: 20,
    marginBottom: 20
  },
  divider: {
    margin: 20
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2)
  },
  table: {
    minWidth: 650
  },
  tableContainer: {
    width: "80%"
  },
  tableContainerDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 30px 30px 30px"
  },
  tableTitle: {
    alignSelf: "start",
    paddingLeft: "15px"
  }
});

type Props = {
  match: any,
  classes: any,
  handleSwitchDrawer: any
};

type State = {
  error: { open: boolean, message: ?string },
  open: boolean,
  activities: Array<Activity>
};

class ActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    open: false,
    activities: []
  };

  componentDidMount() {
    activitiesService
      .getAllActivities(this.props.match.params.courseId)
      .then(response => {
        this.setState({ activities: response });
      })
      .catch(err => {
        this.setState({
          error: {
            open: true,
            message:
              "Hubo un error al obtener las actividades, Por favor reintenta"
          }
        });
      });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  renderCategoryActivities(activities: Array<Activity>, classes: any) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Typography
          variant="h5"
          color="textSecondary"
          component="p"
          className={classes.tableTitle}
        >
          {activities[0].category_name}
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
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
            {activities.map(row => (
              <TableRow key={row.id}>
                <TableCell key={1} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell key={2} align="right">
                  {(row.last_submission_date &&
                    row.last_submission_date.split("T")[0]) ||
                    "-"}
                </TableCell>
                <TableCell key={3} align="right">
                  {15}
                </TableCell>
                <TableCell key={4} align="right">
                  {row.submission_status || "SIN EMPEZAR"}
                </TableCell>
                <TableCell key={5} align="right">
                  Descargar
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

    const { activities, open, error } = this.state;

    console.log(activities);

    const activitiesByCategory = _.groupBy(activities, "category_name");
    console.log(activitiesByCategory);

    return (
      <div>
        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={open}
          title="Actividades"
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={open}
          courseId={this.props.match.params.courseId}
        />
        <main
          className={`${classes.content} ${open ? classes.contentShift : ""}`}
        >
          <div className={classes.drawerHeader} />

          <Fab
            color="primary"
            aria-label="add"
            className={classes.rightButton}
            component={Link}
            to={`/courses/${this.props.match.params.courseId}/activity/create`}
          >
            <AddIcon />
          </Fab>

          {error && (
            <ErrorNotification
              open={_.get(this.state, "error.open")}
              message={_.get(this.state, "error.message")}
            />
          )}

          {activities &&
            Object.keys(activitiesByCategory).map(category => (
              <div className={classes.tableContainerDiv}>
                {this.renderCategoryActivities(
                  activitiesByCategory[category],
                  classes
                )}
              </div>
            ))}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
