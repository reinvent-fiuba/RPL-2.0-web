// @flow
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
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
    width: "75%",
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  flagsField: {
    width: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  saveButton: {
    flex: "0 1 auto",
    marginRight: theme.spacing(2),
    marginLeft: "auto",
    marginTop: theme.spacing(3),
  },
  createButton: {
    display: "flex",
    marginLeft: "auto",
    marginTop: theme.spacing(3),
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
          title="Tests y Flags de compilacioón"
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 1: Seleccionar modo de testeo de la actividad
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="h1"
                  className={classes.title}
                >
                  Solo se puede elegir 1 modo!
                </Typography>
                <RadioGroup
                  value={selectedTestMode}
                  onChange={event => this.setState({ selectedTestMode: event.target.value })}
                >
                  <FormControlLabel value="IO tests" control={<Radio />} label="IO tests" />
                  <FormControlLabel value="Unit tests" control={<Radio />} label="Unit tests" />
                  {/* <FormControlLabel value="no tests" control={<Radio />} label="No tests" /> */}
                </RadioGroup>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="textPrimary" component="h1">
                {`Paso 2: Definir tests${selectedTestMode ? ` - ${selectedTestMode}` : ""}`}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                {selectedTestMode === "IO tests" && (
                  <IOTestsCorrection courseId={courseId} activityId={activityId} />
                )}
                {selectedTestMode === "Unit tests" && (
                  <UnitTestsCorrection courseId={courseId} activityId={activityId} />
                )}
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 3: Definir flags de compilación
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.flagsField}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="h1"
                  className={classes.title}
                >
                  A continuación se pueden definir los flags de compilación que se usaran para compilar los ejercicios.
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={5}
                  name="flags"
                  label="Flags de Compilación"
                  type="flags"
                  id="flags"
                  autoComplete="flags"
                  onChange={e => this.handleChange(e)}
                  variant="outlined"
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Grid container className={classes.buttons}>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.saveButton}
                onClick={e => this.handleCreateClick(e)}
              >
                Previsualizar como alumno
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.createButton}
                onClick={e => this.handleGotToTestClick(e)}
              >
                Publicar!
              </Button>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(AddActivityCorrectionTests));
