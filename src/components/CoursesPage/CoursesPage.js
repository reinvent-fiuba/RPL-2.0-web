import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import CourseCard from './CourseCard';
import Grid from '@material-ui/core/Grid';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import coursesService from '../../services/coursesService';
import { withState } from '../../utils/State';
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab"
import { Redirect } from 'react-router-dom';

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
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleGoToCourseClick = this.handleGoToCourseClick.bind(this);
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

  handleGoToCourseClick(courseId) {
    this.setState({toCoursePage: true, courseId: courseId});
  }

  renderCourseCards(courses) {
    return <Grid container spacing={1}>      
    { _.chunk(courses, 4).map(row => 
      <Grid container item xs={12} spacing={3}>
        {_.map(row, course => 
          <Grid item xs={3}>
            <CourseCard id={course.id} university_course_id={course.university_course_id} name={course.name} description={course.description} imgUri={course.img_uri} handleGoToCourseClick={this.handleGoToCourseClick}/>
          </Grid>
        )}
      </Grid>
    )}
    </Grid>;
  }

  handleAddClick() {
    this.setState({ toCreateCoursePage: true });
  }

  handleDrawerOpen() {
    this.setState({open: true});
  }

  handleDrawerClose() {
    this.setState({open: false});
  }

  render(){
    const { classes } = this.props;
    
    if (this.state.toCreateCoursePage) {
      return <Redirect to="/courses/create"/>
    }

    if (this.state.toCoursePage) {
      return <Redirect to={`/courses/${this.state.courseId}/activities`}/>
    }


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
            onClick={this.handleAddClick}
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
