// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactResizeDetector from "react-resize-detector";
import ErrorNotification from "../../utils/ErrorNotification";
import { withState } from "../../utils/State";
import ActivityCategoryModal from "../ActivityCategoryModal/ActivityCategoryModal";
import activitiesService from "../../services/activitiesService";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";
import AddMainFileModal from "./AddMainFileModal.react";
import type { Activity, Category } from "../../types";
import { validate } from "../../utils/inputValidator";
import constants from "../../utils/constants";

// Styles
import "github-markdown-css";

const _ = require("lodash");

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const styles = theme => ({
  title: {
    flexGrow: 1,
    marginLeft: 0,
  },
  form: {
    display: "inline-flex",
    width: "100%",
    marginBottom: 20,
    "& > *": {
      width: 200,
      marginRight: theme.spacing(2),
      marginTop: 0,
      marginBottom: 0,
    },
  },
  formActivityName: {
    maxWidth: "35%",
    width: "100%",
  },
  divider: {
    margin: 20,
  },
  grid: {
    height: "60vh",
  },
  codeEditor: {
    display: "flex",
    "& .monaco-editor": {
      height: "100vh",
    },
  },
  mdEditor: {
    "& .mde-preview": {
      height: "53vh",
      overflow: "scroll",
    },
    "& .grip": {
      display: "none",
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  cancelButton: {
    flex: "0 1 auto",
    marginRight: theme.spacing(2),
    marginLeft: "auto",
    marginTop: theme.spacing(3),
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
  studentPreviewButton: {
    marginLeft: "auto",
    alignSelf: "flex-end",
  },
  addNewCategory: {
    padding: "0",
  },
  circularProgress: {
    position: "absolute",
    left: "50%",
    top: "50%",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  activity: ?Activity,
  categories: ?Array<Category>,
  language: string,
  categoryId: number,
  name: string,
  points: string,
  code: { [string]: string },
  mdText: string,
  mdEditorTab: string,
  editor: any,
  isCreateCategoryModalOpen: boolean,
  isAddMainFileModalActive: boolean,
};

class CreateActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null, invalidFields: new Set() },
    activity: null,
    categories: [],
    language: "",
    categoryId: -1,
    name: "",
    points: "",
    code: { "main.c": "" },
    mdText: "",
    mdEditorTab: "write",
    editor: null,
    isCreateCategoryModalOpen: false,
    isAddMainFileModalActive: false,
  };

  componentDidMount() {
    const { courseId, activityId } = this.props.match.params;

    // if we are editing pre-load all the activity fields
    if (!this.isCreatingActivity()) {
      activitiesService.getActivity(courseId, activityId).then(activity => {
        this.setState({
          activity,
          language: activity.language,
          categoryId: activity.category_id,
          name: activity.name,
          points: activity.points,
          code: activity.initial_code,
          mdText: activity.description,
        });
      });
    }

    this.loadActivityCategories();
  }

  isCreatingActivity() {
    const { match } = this.props;
    const { activityId } = match.params;

    return activityId === undefined || activityId === null;
  }

  loadActivityCategories() {
    const { courseId } = this.props.match.params;
    activitiesService.getActivityCategories(courseId).then(response => {
      this.setState({ categories: response });
    });
  }

  handleChange(event, valid) {
    event.persist();
    // Close error message
    this.setState(prevState => {
      const { invalidFields } = prevState.error;
      if (valid && invalidFields.has(event.target.id)) {
        invalidFields.delete(event.target.id);
      } else if (!valid) {
        invalidFields.add(event.target.id);
      }
      return {
        [event.target.id]: event.target.value,
        error: { open: false, message: "", invalidFields },
      };
    });
  }

  static activityHasMainFile(language: string, code: { [string]: string }) {
    return Object.keys(code).includes(constants.languages[language].main);
  }

  canSaveActivity() {
    const { name, points, language, categoryId, code, mdText, activity } = this.state;
    if (!name || !points || !language || categoryId === -1 || !mdText) {
      return false;
    }
    return true;
  }

  saveActivity(): Promise<Activity> {
    const { context } = this.props;
    const { courseId } = this.props.match.params;
    const { name, points, language, categoryId, code, mdText, activity } = this.state;
    const serviceToCall = !activity
      ? activitiesService.createActivity
      : activitiesService.updateActivity;

    const data = {
      courseId,
      name,
      points,
      language,
      categoryId,
      code,
      description: mdText,
      ...(!activity ? {} : { activityId: activity.id }),
    };

    return serviceToCall(data)
      .then(response => {
        context.invalidateByKeys("activities");
        this.setState({ activity: response });
        return response;
      })
      .catch(() => {
        this.setState(prevState => {
          return {
            error: {
              open: true,
              message: `Hubo un error al guardar la actividad, revisa que los datos ingresados sean validos.`,
              invalidFields: prevState.error.invalidFields,
            },
          };
        });
      });
  }

  handleCreateClick(event) {
    event.preventDefault();

    this.saveActivity();
  }

  handleGotToTestClick(event) {
    event.preventDefault();
    const { courseId } = this.props.match.params;

    return this.saveActivity().then(response => {
      this.props.history.push(`/courses/${courseId}/activities/${response.id}/edit/correction`);
    });
  }

  handleCancel() {
    const { courseId } = this.props.match.params;
    this.props.history.push(`/courses/${courseId}/activities`);
  }

  handleGoToStudentPreview(event) {
    this.handleCreateClick(event, true);
  }

  renderCategoriesDropdown() {
    const { classes } = this.props;
    const { categories } = this.state;
    return _.map(categories, category => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    )).concat(
      <MenuItem key="new_category" className={classes.addNewCategory}>
        <Button
          fullWidth
          size="small"
          color="primary"
          onClick={() => this.setState({ isCreateCategoryModalOpen: true })}
          endIcon={<AddCircleIcon />}
        >
          Nueva categoría
        </Button>
      </MenuItem>
    );
  }

  handleCreateCategory(courseId: number, activityCategory: any) {
    return activitiesService
      .createActivityCategory(courseId, activityCategory.name, activityCategory.description || "")
      .then(newActivityCategory => {
        this.loadActivityCategories();
        this.handleCloseCategoryModal(newActivityCategory.id);
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al ocultar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleCloseCategoryModal(newCategoryId: number) {
    this.loadActivityCategories();
    this.setState({ isCreateCategoryModalOpen: false, categoryId: newCategoryId });
  }

  render() {
    const { classes, match } = this.props;
    const { courseId } = match.params;

    const { activityId } = match.params;

    const {
      name,
      points,
      language,
      categoryId,
      code,
      mdText,
      mdEditorTab,
      error,
      editor,
      isCreateCategoryModalOpen,
      activity,
      isAddMainFileModalActive,
    } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <AddMainFileModal
          open={isAddMainFileModalActive}
          mainFileByLanguage={constants.languages}
          language={language}
          onClickHide={() => this.setState({ isAddMainFileModalActive: false })}
        />

        <ActivityCategoryModal
          open={isCreateCategoryModalOpen}
          handleCloseModal={newCategoryId => this.handleCloseCategoryModal(newCategoryId)}
          courseId={courseId}
          handleClickSave={activityCategory =>
            this.handleCreateCategory(courseId, activityCategory)
          }
          titleText="Crear Categoría"
          saveButtonText="Crear"
        />

        {!this.isCreatingActivity() && !activity && (
          <CircularProgress className={classes.circularProgress} />
        )}
        {(this.isCreatingActivity() || activity) && (
          <div>
            <form className={classes.form}>
              <TextField
                className={classes.formActivityName}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre de Actividad"
                name="name"
                autoComplete="name"
                error={error.invalidFields && error.invalidFields.has("name")}
                helperText={
                  error.invalidFields &&
                  error.invalidFields.has("name") &&
                  "El nombre de la actividad debe estar formado por letras o numeros"
                }
                onChange={e =>
                  this.handleChange(e, validate(e.target.value, /^[()0-9A-zÀ-ÿ\s.-]+$/, "string"))}
                value={name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="points"
                label="Puntaje"
                name="points"
                autoComplete="points"
                type="number"
                onChange={e => this.handleChange(e, true)}
                value={points}
              />
              <FormControl>
                <InputLabel id="language">Lenguaje</InputLabel>
                <Select
                  id="language"
                  name="language"
                  value={language || ""}
                  onChange={event => this.setState({ language: event.target.value })}
                >
                  400
                  {Object.keys(constants.languages).map((lang, i) => (
                    <MenuItem key={i} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="category">Categoría</InputLabel>
                <Select
                  labelId="category"
                  id="category"
                  value={categoryId !== -1 ? categoryId : ""}
                  onChange={event => this.setState({ categoryId: event.target.value })}
                >
                  {this.renderCategoriesDropdown()}
                </Select>
              </FormControl>
            </form>

            <Grid container spacing={3} className={classes.grid}>
              <Grid item xs={6} className={classes.codeEditor}>
                <ReactResizeDetector
                  handleWidth
                  handleHeight
                  onResize={_.throttle(() => (editor ? editor.layout : () => {}))}
                >
                  <MultipleTabsEditor
                    key={activity ? activity.id : null}
                    initialCode={code}
                    language={language}
                    readOnly={false}
                    forceCanEditFiles // we are in teacher mode
                    onCodeChange={_.throttle(newCode => this.setState({ code: newCode }))}
                    editorDidMount={mountedEditor => {
                      mountedEditor.changeViewZones(changeAccessor => {
                        changeAccessor.addZone({
                          afterLineNumber: 0,
                          heightInLines: 1,
                          domNode: document.createElement("span"),
                        });
                      });
                      this.setState({ editor: mountedEditor });
                    }}
                  />
                </ReactResizeDetector>
              </Grid>
              <Grid item xs={6} className={classes.mdEditor}>
                <ReactMde
                  minEditorHeight="53vh"
                  name="mdText"
                  value={mdText}
                  className="markdown-body"
                  onChange={mdTextChanged => this.setState({ mdText: mdTextChanged })}
                  selectedTab={mdEditorTab}
                  onTabChange={mdEditorTabChanged =>
                    this.setState({ mdEditorTab: mdEditorTabChanged })
                  }
                  generateMarkdownPreview={markdown =>
                    Promise.resolve(converter.makeHtml(markdown))}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs className={classes.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.cancelButton}
                  onClick={() => this.handleCancel()}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.saveButton}
                  onClick={e => this.handleCreateClick(e)}
                  disabled={!this.canSaveActivity()}
                >
                  Guardar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.createButton}
                  onClick={e => this.handleGotToTestClick(e)}
                  disabled={!this.canSaveActivity()}
                >
                  Guardar y Agregar Pruebas
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateActivityPage));
