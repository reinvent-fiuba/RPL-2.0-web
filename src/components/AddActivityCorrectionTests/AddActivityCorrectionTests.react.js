// @flow
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
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
  bulletTitle: {
    marginRight: "5px",
  },
  filePermissionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    marginRight: "15px",
  },
});

const StyledButton = withStyles({
  root: {
    backgroundColor: "#5f9caf",
    color: "#fff",
  },
  outlined: {
    color: "#5f9caf",
    backgroundColor: "#fff",
  },
})(Button);

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
    configCompilerFlagsStepExpanded: false,
    configFilePermissionsForStudents: false,
    flags: "",
    activityFilesMetadata: {
      "file1.c": { display: "hidden" },
      "file_very_long_2.h": { display: "read" },
      "main.c": { display: "read_write" },
    },
  };

  componentDidMount() {
    const { courseId, activityId } = this.props.match.params;

    this.ioTestCorrection = React.createRef();
    this.unitTestCorrection = React.createRef();

    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        const filesMetadata =
          "files_metadata" in response.initial_code
            ? JSON.parse(response.initial_code.files_metadata)
            : AddActivityCorrectionTests.buildFilesMetadata(response.initial_code);

        delete filesMetadata.files_metadata;

        this.setState({
          activity: response,
          activityFilesMetadata: filesMetadata,
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

  static buildFilesMetadata(files: { [string]: string }): Object {
    const filesMetadata = {};
    Object.keys(files).forEach(file => {
      filesMetadata[file] = { display: "read_write" };
    });
    return filesMetadata;
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
    return activitiesService
      .updateActivity({
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
    return activitiesService.updateActivity({
      activityId,
      courseId,
      compilationFlags: this.state.flags,
    });
  }

  handleSaveFilesMetadata() {
    const { courseId, activityId } = this.props.match.params;
    const { activity, activityFilesMetadata } = this.state;
    const newFiles = activity.initial_code;
    newFiles.files_metadata = JSON.stringify(activityFilesMetadata);
    return activitiesService.updateActivity({
      activityId,
      courseId,
      code: newFiles,
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
    const {
      selectTestStepExpanded,
      configTestStepExpanded,
      configCompilerFlagsStepExpanded,
      configFilePermissionsForStudents,
      activityFilesMetadata,
    } = this.state;
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
          <Accordion expanded={selectTestStepExpanded}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon onClick={() => this.handleClickPanel("selectTestStepExpanded")} />
              }
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 1: Seleccionar modo de testeo de la actividad
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Typography variant="subtitle1" color="textSecondary" component="h1">
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
            </AccordionDetails>
            <Divider />
            <AccordionActions>
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  this.handleClickNext("selectTestStepExpanded", "configTestStepExpanded")
                }
              >
                Siguiente
              </Button>
            </AccordionActions>
          </Accordion>
          <Accordion expanded={configTestStepExpanded}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon onClick={() => this.handleClickPanel("configTestStepExpanded")} />
              }
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                {`Paso 2: Definir tests${selectedTestMode ? ` - ${selectedTestMode}` : ""}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
            <Divider />
            <AccordionActions>
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
                  this.handleClickNext("configTestStepExpanded", "configCompilerFlagsStepExpanded")
                }
              >
                Siguiente
              </Button>
            </AccordionActions>
          </Accordion>
          <Accordion expanded={configCompilerFlagsStepExpanded}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  onClick={() => this.handleClickPanel("configCompilerFlagsStepExpanded")}
                />
              }
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 3: Definir flags de compilación
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                <Typography variant="subtitle1" color="textSecondary" component="h1">
                  A continuación se pueden definir los flags de compilación que se usaran para
                  compilar los ejercicios.
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
            </AccordionDetails>
            <AccordionActions>
              <Button
                size="small"
                onClick={() =>
                  this.handleClickNext("configCompilerFlagsStepExpanded", "configTestStepExpanded")
                }
              >
                Anterior
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  this.handleClickNext(
                    "configCompilerFlagsStepExpanded",
                    "configFilePermissionsForStudents"
                  )
                }
              >
                Siguiente
              </Button>
            </AccordionActions>
          </Accordion>
          <Accordion expanded={configFilePermissionsForStudents}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  onClick={() => this.handleClickPanel("configFilePermissionsForStudents")}
                />
              }
            >
              <Typography variant="h6" color="textPrimary" component="h1">
                Paso 4: Definir permisos de archivos para los alumnos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.flagsField}>
                <Fab
                  aria-label="add"
                  size="small"
                  color="primary"
                  className={classes.saveFlagsButton}
                  onClick={() => this.handleSaveFilesMetadata()}
                >
                  <SaveIcon />
                </Fab>
                <Typography variant="subtitle1" color="textSecondary" component="h1">
                  A continuación se pueden definir los permisos que van a tener los alumnos para
                  cada archivo.
                </Typography>
                <ul>
                  <li>
                    <Typography
                      variant="subtitle2"
                      component="h1"
                      display="inline"
                      className={classes.bulletTitle}
                    >
                      Lectura y escritura:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      component="h1"
                      display="inline"
                    >
                      El alumno podrá editarlos y será parte de la entrega si no lo borra.
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      variant="subtitle2"
                      component="h1"
                      display="inline"
                      className={classes.bulletTitle}
                    >
                      Lectura:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      component="h1"
                      display="inline"
                    >
                      El alumno podrá ver el archivo pero no editarlo. Formará parte de la entrega.
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      variant="subtitle2"
                      component="h1"
                      display="inline"
                      className={classes.bulletTitle}
                    >
                      Oculto:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      component="h1"
                      display="inline"
                    >
                      El archivo permanecerá oculto para el alumno pero será agregado a los archivos
                      de la entrega del alumno.
                    </Typography>
                  </li>
                </ul>
                <br />
                <br />
                <div>
                  {Object.keys(activityFilesMetadata).map(filename => (
                    <div className={classes.filePermissionsContainer}>
                      <Typography
                        variant="h6"
                        component="h1"
                        display="inline"
                        className={classes.bulletTitle}
                        style={{ fontFamily: "monospace" }}
                      >
                        {filename}
                      </Typography>
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                        display="inline"
                      >
                        <StyledButton
                          color="inherit"
                          variant={
                            activityFilesMetadata[filename].display === "read_write"
                              ? "contained"
                              : null
                          }
                          onClick={() => {
                            const newMetadata = activityFilesMetadata;
                            newMetadata[filename].display = "read_write";
                            return this.setState({ activityFilesMetadata: newMetadata });
                          }}
                        >
                          Escritura
                        </StyledButton>
                        <StyledButton
                          color="inherit"
                          variant={
                            activityFilesMetadata[filename].display === "read" ? "contained" : null
                          }
                          onClick={() => {
                            const newMetadata = activityFilesMetadata;
                            newMetadata[filename].display = "read";
                            return this.setState({ activityFilesMetadata: newMetadata });
                          }}
                        >
                          Lectura
                        </StyledButton>
                        <StyledButton
                          color="inherit"
                          variant={
                            activityFilesMetadata[filename].display === "hidden"
                              ? "contained"
                              : null
                          }
                          onClick={() => {
                            const newMetadata = activityFilesMetadata;
                            newMetadata[filename].display = "hidden";
                            return this.setState({ activityFilesMetadata: newMetadata });
                          }}
                        >
                          Oculto
                        </StyledButton>
                      </ButtonGroup>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionDetails>
            <AccordionActions>
              <Button
                size="small"
                onClick={() =>
                  this.handleClickNext(
                    "configFilePermissionsForStudents",
                    "configCompilerFlagsStepExpanded"
                  )
                }
              >
                Anterior
              </Button>
            </AccordionActions>
          </Accordion>
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
