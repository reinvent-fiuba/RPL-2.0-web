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
import Grid from "@material-ui/core/Grid";
import MonacoEditor from "react-monaco-editor";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactResizeDetector from "react-resize-detector";
import ErrorNotification from "../../utils/ErrorNotification";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
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
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  open: boolean,
  activity: ?Activity,
  categories: ?Array<Category>,
  language: string,
  category: ?Category,
  name: string,
  points: string,
  code: string,
  mdText: string,
  mdEditorTab: string,
  editor: any,
  addingTests: boolean,
};

class CreateActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    open: false,
    activity: null,
    categories: [],
    language: "",
    category: null,
    name: "",
    points: "",
    code: "",
    mdText: "",
    mdEditorTab: "write",
    editor: null,
    addingTests: false,
  };

  componentDidMount() {
    const { courseId } = this.props.match.params;
    activitiesService.getActivityCategories(courseId).then(response => {
      this.setState({ categories: response });
    });
  }

  handleSwitchDrawer() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value });
  }

  handleCreateClick(event) {
    event.preventDefault();
    const { courseId } = this.props.match.params;

    const { name, points, language, category, code, mdText } = this.state;
    activitiesService
      .createActivity({
        courseId,
        name,
        points,
        language,
        activityCategoryId: category,
        initialCode: code,
        supportingFile: code,
        description: mdText,
      })
      .then(response => {
        this.setState({ activity: response });
        this.props.history.push(`/courses/${courseId}/activities/${response.id}/edit/correction`);
        // this.setState({ addingTests: true });
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
  }

  handleCancel() {
    const { courseId } = this.props.match.params;
    this.props.history.push(`/courses/${courseId}/activities`);
  }

  handleGoToStudentPreview() {
    const { courseId } = this.props.match.params;
    const { activity } = this.state;
    if (activity === null || activity === undefined) {
      alert("Primero tenes que guardar la actividad!");
    } else {
      this.props.history.push(`/courses/${courseId}/activities/${activity.id}/teacherTest`);
    }
  }

  renderCategoriesDropdown() {
    const { categories } = this.state;
    return _.map(categories, category => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ));
  }

  render() {
    const { classes } = this.props;
    const { courseId } = this.props.match.params;

    const {
      name,
      points,
      language,
      category,
      code,
      mdText,
      mdEditorTab,
      open,
      addingTests,
      error,
    } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={open}
          title="Crear Actividad"
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={open}
          courseId={courseId}
        />
        <main className={`${classes.content} ${open ? classes.contentShift : ""}`}>
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
                value={category || ""}
                onChange={event => this.setState({ category: event.target.value })}
              >
                {this.renderCategoriesDropdown()}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.studentPreviewButton}
              onClick={() => this.handleGoToStudentPreview()}
            >
              Student preview
            </Button>
          </form>

          <Grid container spacing={3} className={classes.grid}>
            <Grid item xs={6} className={classes.codeEditor}>
              <ReactResizeDetector
                handleWidth
                handleHeight
                onResize={() => (this.state.editor ? this.state.editor.layout : () => {})}
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
                  editorDidMount={editor => {
                    editor.changeViewZones(changeAccessor => {
                      changeAccessor.addZone({
                        afterLineNumber: 0,
                        heightInLines: 1,
                        domNode: document.createElement("span"),
                      });
                    });
                    this.setState({ editor });
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
                className={classes.createButton}
                onClick={e => this.handleCreateClick(e)}
              >
                Crear y Agregar Pruebas
              </Button>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateActivityPage));
