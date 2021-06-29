// @flow
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CustomSnackbar from "../../utils/CustomSnackbar.react";
import ErrorNotification from "../../utils/ErrorNotification";
import IOTestsCorrection from "./IOTestsCorrection.react";
import UnitTestsCorrection from "./UnitTestsCorrection.react";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import activityTestsService from "../../services/activityTestsService";
import FilesPermissionTypeCorrection from "./FilesPermissionTypeCorrection.react";
import type { Activity, FilesMetadata } from "../../types";
import { getFilesMetadata } from "../../utils/files";
import ActivityTemplateCodeModal from "./ActivityTemplateCodeModal.react";

const _ = require("lodash");

const styles = theme => ({
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
    justifyContent: "space-between",
  },
  submitButtons: {
    display: "flex",
  },
  initialCodeButton: {
    alignSelf: "flex-start",
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
  circularProgress: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  selectedTestMode: string,
  selectTestStepExpanded: boolean,
  configTestStepExpanded: boolean,
  configCompilerFlagsStepExpanded: boolean,
  configFilePermissionsForStudentsExpanded: boolean,
  flags: string,
  activityFilesMetadata: FilesMetadata,
  activity: ?Activity,
  successSave: boolean,
  unitTestCode: ?string,
  activityTemplateCodeModalIsOpen: boolean,
};

class AddActivityCorrectionTests extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    selectedTestMode: "IO tests",
    selectTestStepExpanded: true,
    configTestStepExpanded: false,
    configCompilerFlagsStepExpanded: false,
    configFilePermissionsForStudentsExpanded: false,
    flags: "",
    activity: null,
    activityFilesMetadata: {},
    successSave: false,
    unitTestCode: null,
    activityTemplateCodeModalIsOpen: false,
  };

  componentDidMount() {
    const { courseId, activityId } = this.props.match.params;

    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        const filesMetadata = getFilesMetadata(response.initial_code);
        delete filesMetadata.files_metadata;

        this.setState({
          activity: response,
          activityFilesMetadata: filesMetadata,
          flags: response.compilation_flags,
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

  saveAll() {
    const { unitTestCode, activityFilesMetadata } = this.state;
    this.saveUnitTest(unitTestCode);
    this.handleSaveFlags();
    this.saveFilesMetadata(activityFilesMetadata);
  }

  handlePublish() {
    const { courseId, activityId } = this.props.match.params;

    this.saveAll();

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
    const { flags, activity } = this.state;

    if (activity && flags === activity.compilation_flags) {
      return;
    }

    activitiesService.updateActivity({
      activityId,
      courseId,
      compilationFlags: flags,
    });
  }

  handleSaveFilesMetadata() {
    const { activityFilesMetadata } = this.state;
    this.saveFilesMetadata(activityFilesMetadata);
  }

  saveFilesMetadata(activityFilesMetadata) {
    const { courseId, activityId } = this.props.match.params;
    const { activity } = this.state;

    if (!activity) {
      return;
    }

    const newFiles = _.cloneDeep(activity.initial_code);
    newFiles.files_metadata = JSON.stringify(activityFilesMetadata);

    activitiesService
      .updateActivity({
        activityId,
        courseId,
        code: newFiles,
      })
      .then(updatedActivity => {
        const newActivity = updatedActivity;
        newActivity.initial_code = newFiles;
        this.setState({ activity: newActivity, successSave: true });
        setTimeout(() => this.setState({ successSave: false }), 2000);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al guardar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  handlePreviewClick() {
    const { courseId, activityId } = this.props.match.params;

    this.saveAll();

    this.props.history.push(`/courses/${courseId}/activities/${activityId}`);
  }

  handleSaveUnitTest() {
    const { unitTestCode } = this.state;
    this.saveUnitTest(unitTestCode);
  }

  saveUnitTest(unitTestCode: ?string) {
    const { courseId, activityId } = this.props.match.params;
    const { activity } = this.state;

    if (!unitTestCode) {
      return;
    }

    let promise;
    if (activity && (!activity.is_iotested || activity.activity_unit_tests)) {
      promise = activityTestsService.updateUnitTest(courseId, activityId, unitTestCode);
    } else {
      promise = activityTestsService.createUnitTest(courseId, activityId, unitTestCode);
    }

    promise
      .then(updatedActivity => {
        this.setState(prevState => {
          const newActivity = updatedActivity;
          newActivity.initial_code = prevState.activity.initial_code;
          return { activity: newActivity, successSave: true };
        });
        setTimeout(() => this.setState({ successSave: false }), 2000);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al guardar la actividad, Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const {
      activity,
      selectTestStepExpanded,
      configTestStepExpanded,
      configCompilerFlagsStepExpanded,
      configFilePermissionsForStudentsExpanded,
      activityFilesMetadata,
      successSave,
      activityTemplateCodeModalIsOpen,
    } = this.state;
    const { courseId, activityId } = this.props.match.params;

    const { error, selectedTestMode } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        {successSave && (
          <CustomSnackbar open={successSave} message="La actividad se guardó con éxito" />
        )}

        {!activity && <CircularProgress className={classes.circularProgress} />}

        {activity && (
          <ActivityTemplateCodeModal
            handleCloseModal={() => this.setState({ activityTemplateCodeModalIsOpen: false })}
            open={activityTemplateCodeModalIsOpen}
            activityCode={activity.initial_code}
            activityLanguage={activity.language}
          />
        )}

        {activity && (
          <div>
            <Accordion expanded={selectTestStepExpanded}>
              <AccordionSummary
                onClick={() => this.handleClickPanel("selectTestStepExpanded")}
                expandIcon={<ExpandMoreIcon />}
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
                    this.handleClickNext("selectTestStepExpanded", "configTestStepExpanded")}
                >
                  Siguiente
                </Button>
              </AccordionActions>
            </Accordion>
            <Accordion expanded={configTestStepExpanded}>
              <AccordionSummary
                onClick={() => this.handleClickPanel("configTestStepExpanded")}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="h6" color="textPrimary" component="h1">
                  {`Paso 2: Definir tests${selectedTestMode ? ` - ${selectedTestMode}` : ""}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {selectedTestMode === "IO tests" && (
                    <IOTestsCorrection courseId={courseId} activityId={activityId} />
                  )}
                  {selectedTestMode === "Unit tests" && (
                    <UnitTestsCorrection
                      courseId={courseId}
                      activityId={activityId}
                      onSaveUnitTest={unitTestCode => this.saveUnitTest(unitTestCode)}
                      onChange={unitTestCode => this.setState({ unitTestCode })}
                    />
                  )}
                </div>
              </AccordionDetails>
              <Divider />
              <AccordionActions>
                <Button
                  size="small"
                  onClick={() =>
                    this.handleClickNext("configTestStepExpanded", "selectTestStepExpanded")}
                >
                  Anterior
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() =>
                    this.handleClickNext(
                      "configTestStepExpanded",
                      "configCompilerFlagsStepExpanded"
                    )}
                >
                  Siguiente
                </Button>
              </AccordionActions>
            </Accordion>
            <Accordion expanded={configCompilerFlagsStepExpanded}>
              <AccordionSummary
                onClick={() => this.handleClickPanel("configCompilerFlagsStepExpanded")}
                expandIcon={<ExpandMoreIcon />}
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
                    this.handleClickNext(
                      "configCompilerFlagsStepExpanded",
                      "configTestStepExpanded"
                    )}
                >
                  Anterior
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() =>
                    this.handleClickNext(
                      "configCompilerFlagsStepExpanded",
                      "configFilePermissionsForStudentsExpanded"
                    )}
                >
                  Siguiente
                </Button>
              </AccordionActions>
            </Accordion>
            <Accordion expanded={configFilePermissionsForStudentsExpanded}>
              <AccordionSummary
                onClick={() => this.handleClickPanel("configFilePermissionsForStudentsExpanded")}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="h6" color="textPrimary" component="h1">
                  Paso 4: Definir permisos de archivos para los alumnos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.flagsField}>
                  <FilesPermissionTypeCorrection
                    handleSaveFilesMetadata={() => this.handleSaveFilesMetadata()}
                    activityFilesMetadata={activityFilesMetadata}
                    onFileMetadataChanged={newMetadata =>
                      this.setState({ activityFilesMetadata: newMetadata })}
                  />
                </div>
              </AccordionDetails>
              <AccordionActions>
                <Button
                  size="small"
                  onClick={() =>
                    this.handleClickNext(
                      "configFilePermissionsForStudentsExpanded",
                      "configCompilerFlagsStepExpanded"
                    )}
                >
                  Anterior
                </Button>
              </AccordionActions>
            </Accordion>
            <Grid container className={classes.buttons}>
              <div>
                <Grid itemclassName={classes.initialCodeButton}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.saveButton}
                    onClick={() => this.setState({ activityTemplateCodeModalIsOpen: true })}
                  >
                    Ver código inicial de la actividad
                  </Button>
                </Grid>
              </div>
              <div className={classes.submitButtons}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.saveButton}
                    onClick={e => this.handlePreviewClick(e)}
                  >
                    Guardar y Previsualizar como alumno
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
                    Guardar y Publicar!
                  </Button>
                </Grid>
              </div>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(AddActivityCorrectionTests));
