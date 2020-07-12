// @flow
import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactResizeDetector from "react-resize-detector";
import ErrorNotification from "../../utils/ErrorNotification";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import CreateActivityCategoryModal from "./CreateActivityCategoryModal";
import activitiesService from "../../services/activitiesService";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";
import AddMainFileModal from "./AddMainFileModal.react";
import type { Activity, Category } from "../../types";

// Styles
import "react-mde/lib/styles/css/react-mde-all.css";

const _ = require("lodash");

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

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
      margin: theme.spacing(1),
    },
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
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
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

const mainFileByLanguage = { c: "main.c", python: "assignment_main.py", java: "main.java" };

class CreateActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
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
    if (activityId !== undefined && activityId !== null) {
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

  loadActivityCategories() {
    const { courseId } = this.props.match.params;
    activitiesService.getActivityCategories(courseId).then(response => {
      this.setState({ categories: response });
    });
  }

  handleSwitchDrawer() {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value });
  }

  static activityHasMainFile(language: string, code: { [string]: string }) {
    return Object.keys(code).includes(mainFileByLanguage[language]);
  }

  saveActivity() {
    const { courseId, activityId } = this.props.match.params;
    const { name, points, language, categoryId, code, mdText, activity } = this.state;
    const serviceToCall = !activity
      ? activitiesService.createActivity
      : activitiesService.updateActivity;

    if (!CreateActivityPage.activityHasMainFile(language, code)) {
      this.setState({ isAddMainFileModalActive: true });
      return;
    }

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
        this.setState({ activity: response });
        return response;
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: `Hubo un error al guardar la actividad, revisa que los datos ingresados sean validos.`,
          },
        });
      });
  }

  handleCreateClick(event) {
    event.preventDefault();

    return this.saveActivity();
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
      <MenuItem className={classes.addNewCategory}>
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

  handleCloseCategoryModal(newCategoryId: number) {
    this.loadActivityCategories();
    this.setState({ isCreateCategoryModalOpen: false, categoryId: newCategoryId });
  }

  setLanguage(language: string, code: { [string]: string }) {
    const newCode = code;

    Object.keys(code).forEach(f => {
      // Change mains
      if (language === "c" && f === "assignment_main.py") {
        newCode["main.c"] = code[f];
        delete newCode[f];
        return;
      }

      if (language === "python" && f === "main.c") {
        newCode["assignment_main.py"] = code[f];
        delete newCode[f];
        return;
      }

      // Change filename extensions
      if (language === "c" && f.includes(".py")) {
        newCode[`${f.substring(0, f.lastIndexOf(".py"))}.c`] = code[f];
        delete newCode[f];
      }
      if (language === "python" && f.includes(".c")) {
        newCode[`${f.substring(0, f.lastIndexOf(".c"))}.py`] = code[f];
        delete newCode[f];
      }
    });

    this.setState({ language, code: newCode });
  }

  render() {
    const { classes, match } = this.props;
    const { courseId } = match.params;

    const {
      name,
      points,
      language,
      categoryId,
      code,
      mdText,
      mdEditorTab,
      isSideBarOpen,
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
          mainFileByLanguage={mainFileByLanguage}
          language={language}
          onClickHide={() => this.setState({ isAddMainFileModalActive: false })}
        />

        <CreateActivityCategoryModal
          open={isCreateCategoryModalOpen}
          handleCloseModal={newCategoryId => this.handleCloseCategoryModal(newCategoryId)}
          courseId={courseId}
        />
        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          title={
            activity === null || activity === undefined ? "Crear Actividad" : "Editar Actividad"
          }
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <form className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre de Actividad"
              name="name"
              autoComplete="name"
              onChange={e => this.handleChange(e)}
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
              onChange={e => this.handleChange(e)}
              value={points}
            />
            <FormControl>
              <InputLabel id="language">Lenguaje</InputLabel>
              <Select
                id="language"
                name="language"
                value={language || ""}
                onChange={event => this.setLanguage(event.target.value, code)}
              >
                <MenuItem key={0} value="c">
                  C
                </MenuItem>
                <MenuItem key={1} value="python">
                  Python
                </MenuItem>
                <MenuItem key={2} value="java">
                  Java
                </MenuItem>
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
                  canEditFiles
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
                onChange={mdTextChanged => this.setState({ mdText: mdTextChanged })}
                selectedTab={mdEditorTab}
                onTabChange={mdEditorTabChanged =>
                  this.setState({ mdEditorTab: mdEditorTabChanged })}
                generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
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
              >
                Guardar y Agregar Pruebas
              </Button>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateActivityPage));
