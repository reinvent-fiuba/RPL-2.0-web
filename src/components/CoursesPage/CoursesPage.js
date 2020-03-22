// @flow
import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import CourseCard from "./CourseCard";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import coursesService from "../../services/coursesService";
import { withState } from "../../utils/State";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Course } from "../../types";

const _ = require("lodash");

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
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    margin: 20,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
});

type Props = {
  match: any,
  classes: any,
  context: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  myCourses: Array<Course>,
  otherCourses: Array<Course>,
};

class CoursesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    myCourses: [],
    otherCourses: [],
  };

  componentDidMount() {
    this.loadCourses();
  }

  loadCourses() {
    let allCourses;
    const { profile } = this.props.context;
    coursesService
      .getAll()
      .then(response => {
        allCourses = response;
        return coursesService.getAllByUser(profile.id);
      })
      .then(myCourses => {
        const otherCourses = _.differenceBy(allCourses, myCourses, "id");
        this.setState({ myCourses, otherCourses });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar los cursos, Por favor reintenta",
          },
        });
      });
  }

  renderCourseCards(courses: Array<Course>) {
    return (
      <Grid container spacing={1}>
        {_.chunk(courses, 4).map((row, idx) => (
          <Grid container item xs={12} spacing={3} id={idx}>
            {_.map(row, course => (
              <Grid item xs={3} id={course.id}>
                <CourseCard
                  courseId={course.id}
                  universityCourseId={course.university_course_id}
                  name={course.name}
                  description={course.description}
                  imgUri={course.img_uri}
                  enrolled={course.enrolled}
                  onClickGoToCourse={(e, courseId) => this.handleClickGoToCourse(e, courseId)}
                  onClickEnrollToCourse={(e, courseId) =>
                    this.handleClickEnrollToCourse(e, courseId)}
                  onClickUnenrollToCourse={(e, courseId) =>
                    this.handleClickUnenrollToCourse(e, courseId)}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    );
  }

  handleSwitchDrawer() {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleCreateCourseClick() {
    this.props.history.push("/courses/create");
  }

  handleClickGoToCourse(e: Event, courseId: number) {
    e.preventDefault();
    this.props.history.push(`/courses/${courseId}/activities`);
  }

  handleClickEnrollToCourse(e: Event, courseId: number) {
    e.preventDefault();
    coursesService
      .enroll(courseId)
      .then(() => {
        this.props.history.push(`/courses/${courseId}/activities`);
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al inscribirse. Por favor reintenta",
          },
        });
      });
  }

  handleClickUnenrollToCourse(e: Event, courseId: number) {
    e.preventDefault();
    coursesService
      .unenroll(courseId)
      .then(() => this.loadCourses())
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al desinscribirse. Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { otherCourses, myCourses, isSideBarOpen, error } = this.state;

    const { profile } = this.props.context;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          title="Cursos"
          userId={profile.id}
        />
        <SideBar
          handleDrawerClose={() => this.handleSwitchDrawer()}
          open={isSideBarOpen}
          courseId={this.props.match.params.courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <Fab
            color="primary"
            aria-label="add"
            className={classes.rightButton}
            onClick={() => this.handleCreateCourseClick()}
          >
            <AddIcon />
          </Fab>
          <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
            Mis Cursos
          </Typography>
          {this.renderCourseCards(myCourses)}
          <Divider className={classes.divider} />
          <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
            Todos los Cursos
          </Typography>
          {this.renderCourseCards(otherCourses)}
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CoursesPage));
