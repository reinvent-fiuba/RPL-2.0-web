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
import Dialog from "@material-ui/core/Dialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";
import MonacoEditor from "react-monaco-editor";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactResizeDetector from "react-resize-detector";
import ErrorNotification from "../../utils/ErrorNotification";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import CreateActivityCategoryModal from "./CreateActivityCategoryModal";
import activitiesService from "../../services/activitiesService";
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
  categoryId: ?number,
  name: string,
  points: string,
  code: string,
  mdText: string,
  mdEditorTab: string,
  editor: any,
  addingTests: boolean,
  isCreateCategoryModalOpen: boolean,
};

class CreateActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    activity: null,
    categories: [],
    language: "",
    categoryId: null,
    name: "",
    points: "",
    code: "",
    mdText: "",
    mdEditorTab: "write",
    editor: null,
    addingTests: false,
    isCreateCategoryModalOpen: false,
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
          points: "15",
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

  handleCreateClick(event, testActivityAsStudent = false) {
    event.preventDefault();
    const { courseId, activityId } = this.props.match.params;

    const { name, points, language, categoryId, code, mdText, activity } = this.state;

    // Crear actividad
    if (activity === null || activity === undefined) {
      activitiesService
        .createActivity({
          courseId,
          name,
          points,
          language,
          activityCategoryId: categoryId,
          initialCode: code,
          supportingFile: code,
          description: mdText,
        })
        .then(response => {
          this.setState({ activity: response });
          if (testActivityAsStudent) {
            this.props.history.push(
              `/courses/${courseId}/activities/${activity.id}?teacherTest=true`
            );
          } else {
            this.props.history.push(
              `/courses/${courseId}/activities/${response.id}/edit/correction`
            );
          }
        })
        .catch(() => {
          this.setState({
            error: {
              open: true,
              message:
                "Hubo un error al crear la actividad, revisa que los datos ingresados sean validos.",
            },
          });
        });
    } else {
      // Editar actividad
      activitiesService
        .updateActivity({
          courseId,
          activityId,
          name,
          points,
          language,
          activityCategoryId: categoryId,
          initialCode: code,
          supportingFile: code,
          description: mdText,
        })
        .then(response => {
          this.setState({ activity: response });
          if (testActivityAsStudent) {
            this.props.history.push(
              `/courses/${courseId}/activities/${activity.id}?teacherTest=true`
            );
          } else {
            this.props.history.push(
              `/courses/${courseId}/activities/${response.id}/edit/correction`
            );
          }
        })
        .catch(() => {
          this.setState({
            error: {
              open: true,
              message:
                "Hubo un error al modificar la actividad, revisa que los datos ingresados sean validos.",
            },
          });
        });
    }
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

  render() {
    const { classes } = this.props;
    const { courseId } = this.props.match.params;

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
    } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <CreateActivityCategoryModal
          open={isCreateCategoryModalOpen}
          handleCloseModal={newCategoryId => this.handleCloseCategoryModal(newCategoryId)}
          courseId={courseId}
        />
        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          title="Crear Actividad"
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
            Crear Actividad
          </Typography>
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
                onChange={event => this.setState({ language: event.target.value })}
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
                value={categoryId || ""}
                onChange={event => this.setState({ categoryId: event.target.value })}
              >
                {this.renderCategoriesDropdown()}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.studentPreviewButton}
              onClick={e => this.handleGoToStudentPreview(e)}
            >
              Guardar y Probar
            </Button>
          </form>

          <Grid container spacing={3} className={classes.grid}>
            <Grid item xs={6} className={classes.codeEditor}>
              <ReactResizeDetector
                handleWidth
                handleHeight
                onResize={() => (editor ? editor.layout : () => {})}
              >
                <MonacoEditor
                  options={{
                    renderFinalNewline: true,
                  }}
                  language={language}
                  theme="vs-dark"
                  defaultValue=""
                  value={code}
                  onChange={codeChanged => this.setState({ code: codeChanged })}
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
                  this.setState({ mdEditorTab: mdEditorTabChanged })
                }
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
                className={classes.createButton}
                onClick={e => this.handleCreateClick(e)}
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
