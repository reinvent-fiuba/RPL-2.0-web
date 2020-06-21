// @flow
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ErrorNotification from "../../utils/ErrorNotification";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import IOTestsCorrection from "./IOTestsCorrection.react";
import UnitTestsCorrection from "./UnitTestsCorrection.react";
import { withState } from "../../utils/State";
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
    margin: "auto",
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
  saveFlagsButton: {
    display: "flex",
    marginLeft: "auto",
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
    selectTestStepExpanded: true,
    configTestStepExpanded: false,
    configFlagsStepExpanded: false,
    flags: "",
  };

  componentDidMount() {
    const { courseId, activityId } = this.props.match.params;

    this.ioTestCorrection = React.createRef();
    this.unitTestCorrection = React.createRef();

    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        this.setState({
          activty: response,
          flags: response.compilation_flags,
          selectedTestMode: !response.is_iotested ? "Unit tests" : "IO tests",
        });
      })
      .catch(() => {
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

  handleClickNext(currentPanel, nextPanel) {
    return this.setState(() => ({
      [currentPanel]: false,
      [nextPanel]: true,
    }));
  }

  handleClickPanel(currentPanel) {
    return this.setState(prevState => ({
      [currentPanel]: !prevState[currentPanel],
    }));
  }

  handlePublish() {
    const { courseId, activityId } = this.props.match.params;
    return activitiesService.softUpdateActivity({
        activityId,
        courseId,
        active: true,
      })
      .then(() => {
        this.props.history.push(`/courses/${courseId}/activities`);
      });
  }

  handleSaveFlags() {
    const { courseId, activityId } = this.props.match.params;
    return activitiesService.softUpdateActivity({
      activityId,
      courseId,
      compilationFlags: this.state.flags
    });
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  handlePreviewClick() {
    const { courseId, activityId } = this.props.match.params;

    this.props.history.push(`/courses/${courseId}/activities/${activityId}`);
  }

  render() {
    const { classes } = this.props;
    const { selectTestStepExpanded, configTestStepExpanded, configFlagsStepExpanded } = this.state;
    const { courseId, activityId } = this.props.match.params;

    const { isSideBarOpen, error, selectedTestMode } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          title="Tests y Flags de compilación"
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <ExpansionPanel expanded={selectTestStepExpanded}>
            <ExpansionPanelSummary
              expandIcon={(
                <ExpandMoreIcon onClick={() => this.handleClickPanel("selectTestStepExpanded")} />
              )}
            >
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
            <Divider />
            <ExpansionPanelActions>
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  this.handleClickNext("selectTestStepExpanded", "configTestStepExpanded")
                }
              >
                Siguiente
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <ExpansionPanel expanded={configTestStepExpanded}>
            <ExpansionPanelSummary
              expandIcon={(
                <ExpandMoreIcon onClick={() => this.handleClickPanel("configTestStepExpanded")} />
              )}
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                {`Paso 2: Definir tests${selectedTestMode ? ` - ${selectedTestMode}` : ""}`}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                {selectedTestMode === "IO tests" && (
                  <IOTestsCorrection
                    ref={this.ioTestCorrection}
                    courseId={courseId}
                    activityId={activityId}
                  />
                )}
                {selectedTestMode === "Unit tests" && (
                  <UnitTestsCorrection
                    ref={this.unitTestCorrection}
                    courseId={courseId}
                    activityId={activityId}
                  />
                )}
              </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button
                size="small"
                onClick={() =>
                  this.handleClickNext("configTestStepExpanded", "selectTestStepExpanded")
                }
              >
                Anterior
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  this.handleClickNext("configTestStepExpanded", "configFlagsStepExpanded")
                }
              >
                Siguiente
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <ExpansionPanel expanded={configFlagsStepExpanded}>
            <ExpansionPanelSummary
              expandIcon={(
                <ExpandMoreIcon onClick={() => this.handleClickPanel("configFlagsStepExpanded")} />
              )}
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 3: Definir flags de compilación
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.flagsField}>
                <Fab
                  aria-label="add"
                  size="small"
                  color="primary"
                  className={classes.saveFlagsButton}
                  onClick={() => this.handleSaveFlags()}
                >
                  <SaveIcon />
                </Fab>
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
                  value={this.state.flags}
                  rows={5}
                  name="flags"
                  label="Flags de Compilación"
                  type="flags"
                  id="flags"
                  autoComplete="flags"
                  inputProps={{
                    style: { fontFamily: `"Lucida Console", Monaco, monospace` },
                  }}
                  onChange={e => this.handleChange(e)}
                  variant="outlined"
                />
              </div>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button
                size="small"
                onClick={() =>
                  this.handleClickNext("configFlagsStepExpanded", "configTestStepExpanded")
                }
              >
                Anterior
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <Grid container className={classes.buttons}>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.saveButton}
                onClick={e => this.handlePreviewClick(e)}
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
                onClick={() => this.handlePublish()}
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
