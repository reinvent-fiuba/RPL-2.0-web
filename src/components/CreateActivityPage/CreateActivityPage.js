import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import MonacoEditor from 'react-monaco-editor';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import ReactResizeDetector from 'react-resize-detector';
import { Link } from 'react-router-dom';
import { withState } from '../../utils/State';
import TopBar from '../TopBar/TopBar';
import SideBar from '../SideBar/SideBar';
import activitiesService from '../../services/activitiesService';

// Styles
import 'react-mde/lib/styles/css/react-mde-all.css';

const _ = require('lodash');

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const drawerWidth = 240;

const styles = (theme) => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
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
    display: 'inline-flex',
    marginBottom: 20,
    '& > *': {
      width: 200,
      margin: theme.spacing(1),
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  divider: {
    margin: 20,
  },
  grid: {
    height: '60vh',
  },
  codeEditor: {
    display: 'flex',
    '& .monaco-editor': {
      height: '100vh',
    },
  },
  mdEditor: {
    '& .mde-preview': {
      height: '53vh',
      overflow: 'scroll',
    },
    '& .grip': {
      display: 'none',
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    flex: '0 1 auto',
    marginRight: theme.spacing(2),
    marginLeft: 'auto',
    marginTop: theme.spacing(3),
  },
  createButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(10),
    marginTop: theme.spacing(3),
  },
});

class CreateActivityPage extends React.Component {
  constructor(props) {
    super(props);
    const { courseId } = this.props.match.params;
    this.state = {
      courseId,
      mdText: '',
      mdEditorTab: 'write',
      editor: null,
    };
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.renderCategoriesDropdown = this.renderCategoriesDropdown.bind(this);
  }

  componentDidMount() {
    const { courseId } = this.state;
    activitiesService.getActivityCategories(courseId)
      .then((response) => {
        this.setState({ categories: response });
      });
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value });
  }

  handleCreateClick(event) {
    event.preventDefault();
    const {
      courseId, name, points, language, category, code, mdText,
    } = this.state;
    activitiesService.create({
      courseId,
      name,
      points,
      language,
      activityCategoryId: category,
      supportingFile: code,
      description: mdText,
    }).then((response) => {
      this.setState({ toCoursesPage: true });
    }).catch((err) => {
      this.setState({ error: { open: true, message: 'Hubo un error al crear la actividad, revisa que los datos ingresados sean validos.' } });
    });
  }

  renderCategoriesDropdown() {
    const { categories } = this.state;
    return _.map(categories, (category) => <MenuItem value={category.id}>{category.name}</MenuItem>);
  }

  render() {
    const { classes } = this.props;

    const {
      courseId, name, points, language, category, code, mdText, mdEditorTab, open,
    } = this.state;

    return (
      <div>
        <TopBar handleDrawerOpen={this.handleDrawerOpen} open={open} title="Crear Actividad" />
        <SideBar handleDrawerClose={this.handleDrawerClose} open={open} courseId={courseId} />
        <main
          className={`${classes.content} ${open ? classes.contentShift : ''}`}
        >
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
              onChange={this.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="points"
              label="Puntaje"
              name="points"
              autoComplete="points"
              onChange={this.handleChange}
            />
            <FormControl>
              <InputLabel id="language">Lenguaje</InputLabel>
              <Select
                id="language"
                name="language"
                value={language || ''}
                onChange={(event) => this.setState({ language: event.target.value })}
              >
                <MenuItem value="c">C</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="java">Java</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="category">Categoria</InputLabel>
              <Select
                labelId="category"
                id="category"
                value={category || ''}
                onChange={(event) => this.setState({ category: event.target.value })}
              >
                {this.renderCategoriesDropdown()}
              </Select>
            </FormControl>
          </form>
          <Grid container xs={12} spacing={3} className={classes.grid}>
            <Grid item xs={6} className={classes.codeEditor}>
              <ReactResizeDetector
                handleWidth
                handleHeight
                onResize={() => (this.editor ? this.editor.layout : () => { })}
              >
                <MonacoEditor
                  options={{
                    renderFinalNewline: true,
                  }}
                  language={language}
                  theme="vs-dark"
                  defaultValue=""
                  value={code}
                  onChange={(codeChanged) => this.setState({ code: codeChanged })}
                  editorDidMount={(editor) => {
                    editor.changeViewZones((changeAccessor) => {
                      changeAccessor.addZone({
                        afterLineNumber: 0,
                        heightInLines: 1,
                        domNode: document.createElement('span'),
                      });
                    });
                    this.editor = editor;
                  }}
                />
              </ReactResizeDetector>
            </Grid>
            <Grid item xs={6} className={classes.mdEditor}>
              <ReactMde
                minEditorHeight="53vh"
                name="mdText"
                value={mdText}
                onChange={(mdTextChanged) => this.setState({ mdText: mdTextChanged })}
                selectedTab={mdEditorTab}
                onTabChange={(mdEditorTabChanged) => this.setState({ mdEditorTab: mdEditorTabChanged })}
                generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs className={classes.buttons}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.cancelButton}
                component={Link}
                to={`/courses/${courseId}/activities`}
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
                onClick={this.handleCreateClick}
              >
                Crear
              </Button>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateActivityPage));
