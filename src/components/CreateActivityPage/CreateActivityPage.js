import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withState } from '../../utils/State';
import Grid from '@material-ui/core/Grid';
import MonacoEditor from 'react-monaco-editor'
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactResizeDetector from 'react-resize-detector';
// Styles
import "react-mde/lib/styles/css/react-mde-all.css";


const _ = require('lodash');

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const drawerWidth = 240;

const styles = theme => ({
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
    }
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  divider: {
    margin: 20
  },
  grid: {
    height: '60vh',
  },
  codeEditor: {
    display: 'flex',
    '& .monaco-editor': {
      height: '100vh'
    }
  },
  mdEditor: {
    '& .mde-preview': {
      height: '53vh',
      overflow: 'scroll'
    },
    '& .grip': {
      display: 'none'
    }
  },
  cancelButton: {
    display: 'flex',
    marginRight: theme.spacing(2),
    marginLeft: 'auto',
    marginTop: theme.spacing(3),
  },
  createButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(10),
    marginTop: theme.spacing(3),
  }
});

class CreateActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdText: '',
      mdEditorTab: 'write',
      editor: null
    };
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen  = this.handleDrawerOpen.bind(this);
    this.handleChange      = this.handleChange.bind(this);
  }

  handleDrawerOpen() {
    this.setState({open: true});
  }

  handleDrawerClose() {
    this.setState({open: false});
  }

  handleChange(event) {
    event.persist();
    console.log(event);
    // Close error message 
    this.setState({ [event.target.id]: event.target.value });
  }

  render(){
    const { classes } = this.props;
  
    return([
    <TopBar handleDrawerOpen={this.handleDrawerOpen} open={this.state.open} title='Crear Actividad'></TopBar>,
    <SideBar handleDrawerClose={this.handleDrawerClose} open={this.state.open}></SideBar>,
    <main
          className={`${classes.content} ${this.state.open ? classes.contentShift : ''}`}
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
              onChange = {this.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="points"
              label="Puntaje"
              name="points"
              autoComplete="points"
              onChange = {this.handleChange}
            />
            <FormControl>
              <InputLabel id="language">Lenguaje</InputLabel>
              <Select
                id="language"
                name="language"
                value={this.state.language}
                onChange={event => this.setState({ language: event.target.value })}
              >
                <MenuItem value={'c'}>{'C'}</MenuItem>
                <MenuItem value={'python'}>{'Python'}</MenuItem>
                <MenuItem value={'java'}>{'Java'}</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="category">Categoria</InputLabel>
              <Select
                labelId="category"
                id="category"
                value={this.state.category}
                onChange={event => this.setState({ category: event.target.value })}
              >
                <MenuItem value={'basic'}>{'Basico'}</MenuItem>
                <MenuItem value={'medium'}>{'Medio'}</MenuItem>
                <MenuItem value={'advanced'}>{'Avanzado'}</MenuItem>
              </Select>
            </FormControl>
          </form>
          <Grid container xs={12} spacing={3} className={classes.grid}>
            <Grid item xs={6} className={classes.codeEditor}>
              <ReactResizeDetector
                handleWidth
                handleHeight
                onResize={() => this.editor ? this.editor.layout : () => {} }
              >
                <MonacoEditor
                  options={{
                    renderFinalNewline: true,
                  }}
                  language={this.state.language}
                  theme="vs-dark"
                  defaultValue=''
                  value={this.state.code}
                  onChange={( code ) => this.setState({ code })}
                  editorDidMount={ editor => {
                    editor.changeViewZones((changeAccessor) => {
                      changeAccessor.addZone({
                        afterLineNumber: 0,
                        heightInLines: 1,
                        domNode: document.createElement("span")
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
                  value={this.state.mdText}
                  onChange={( mdText ) => this.setState({ mdText }) }
                  selectedTab={this.state.mdEditorTab}
                  onTabChange={( mdEditorTab ) => this.setState({ mdEditorTab })}
                  generateMarkdownPreview={markdown =>
                    Promise.resolve(converter.makeHtml(markdown))
                  }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Button
                variant="contained"
                color="secondary"
                className={classes.cancelButton}
                onClick={this.handleCancelClick}
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
    ]);
  }
}

export default withState(withStyles(styles)(CreateActivityPage));