// @flow
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ErrorNotification from "../../utils/ErrorNotification";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import IOTestsCorrection from "./IOTestsCorrection.react";
import UnitTestsCorrection from "./UnitTestsCorrection.react";
import { withState } from "../../utils/State";
import type { Activity } from "../../types";
import activitiesService from "../../services/activitiesService";

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
  divider: {
    margin: 20,
  },
  list: {
    margin: 20,
    backgroundColor: "#f5f5f5",
    maxWidth: "500px",
  },
  addTestCaseButton: {
    margin: "20px 0 0 20px",
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
  selectedTestMode: string,
};

class AddActivityCorrectionTests extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    selectedTestMode: "IO tests",
  };

  componentDidMount() {
    const { courseId, activityId } = this.props.match.params;
    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        this.setState({
          selectedTestMode: !response.is_iotested ? "Unit tests" : "IO tests",
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleSwitchDrawer() {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  render() {
    const { classes } = this.props;
    const { courseId, activityId } = this.props.match.params;

    const { isSideBarOpen, error, selectedTestMode } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          title="Agregar Tests"
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <Typography variant="h3" color="textPrimary" component="h1" className={classes.title}>
            Elegí un modo de testeo de la actividad
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="h1"
            className={classes.title}
          >
            Solo se puede elegir 1 modo!
          </Typography>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={selectedTestMode}
            onChange={event => this.setState({ selectedTestMode: event.target.value })}
          >
            <FormControlLabel value="IO tests" control={<Radio />} label="IO tests" />
            <FormControlLabel value="Unit tests" control={<Radio />} label="Unit tests" />
            {/* <FormControlLabel value="no tests" control={<Radio />} label="No tests" /> */}
          </RadioGroup>

          <br />
          <br />
          <br />
          {selectedTestMode === "IO tests" && (
            <IOTestsCorrection courseId={courseId} activityId={activityId} />
          )}
          {selectedTestMode === "Unit tests" && (
            <UnitTestsCorrection courseId={courseId} activityId={activityId} />
          )}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(AddActivityCorrectionTests));
