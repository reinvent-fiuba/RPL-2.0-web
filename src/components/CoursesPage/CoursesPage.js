import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SchoolIcon from '@material-ui/icons/School';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import Avatar from '@material-ui/core/Avatar'
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CourseCard from './CourseCard';
import Grid from '@material-ui/core/Grid';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import coursesService from '../../services/coursesService';
import { withState } from '../../utils/State';
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab"

const _ = require('lodash');

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
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    marginTop: 20,
    marginBottom: 20
  },
  divider: {
    margin: 20
  },
  rightButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
  }
});

class CoursesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.renderCourseCards = this.renderCourseCards.bind(this);    
    const { profile } = this.props.context;
    let allCourses;
    coursesService.getAll()
      .then(response => {
        allCourses = response;
        return coursesService.getAllByUser(profile.id);
      })
      .then(myCourses => {
        this.setState({ myCourses, allCourses });
      });
  }

  renderCourseCards(courses) {
    return <Grid container spacing={1}>      
    { _.chunk(courses, 4).map(row => 
      <Grid container item xs={12} spacing={3}>
        {_.map(row, course => 
          <Grid item xs={3}>
            <CourseCard id={course.university_course_id} name={course.name} description={course.description} imgUri={course.img_uri}/>
          </Grid>
        )}
      </Grid>
    )}
    </Grid>;
  }

  handleDrawerOpen() {
    this.setState({open: true});
  }

  handleDrawerClose() {
    this.setState({open: false});
  }

  render(){
    const { classes } = this.props;

    return([
    <TopBar handleDrawerOpen={this.handleDrawerOpen} open={this.state.open} title='Cursos'></TopBar>,
    <SideBar handleDrawerClose={this.handleDrawerClose} open={this.state.open}></SideBar>,
    <main
          className={`${classes.content} ${this.state.open ? classes.contentShift : ''}`}
        >
          <div className={classes.drawerHeader} />
          <Fab
            color="primary"
            aria-label="add"
            className={classes.rightButton}
          >
            <AddIcon/>
          </Fab>
          <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
            Mis Cursos
          </Typography>
          { this.renderCourseCards(this.state.myCourses) }
          <Divider className={classes.divider}/>
          <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
            Todos los Cursos
          </Typography>
          { this.renderCourseCards(this.state.allCourses) }
      </main>
    ]);
  }
}

export default withState(withStyles(styles)(CoursesPage));
