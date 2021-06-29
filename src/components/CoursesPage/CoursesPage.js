// @flow
import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import CourseCard from "./CourseCard";
import coursesService from "../../services/coursesService";
import { withState } from "../../utils/State";
import ErrorNotification from "../../utils/ErrorNotification";
import EnrollInformationModal from "./EnrollInformationModal";
import type { Course } from "../../types";

const _ = require("lodash");

const styles = theme => ({
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
    marginBottom: theme.spacing(2),
  },
  dashboardContainer: {
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    margin: `0 auto`,
    marginBottom: theme.spacing(5),
  },
  coursesGrid: {
    margin: "auto",
    marginTop: theme.spacing(3),
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
  myCourses: Array<Course>,
  pendingCourses: Array<Course>,
  otherCourses: Array<Course>,
  finishedCourses: Array<Course>,
  currentTab: number,
  enrollModalOpen: boolean,
};

class CoursesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    myCourses: [],
    otherCourses: [],
    pendingCourses: [],
    finishedCourses: [],
    currentTab: 0,
    enrollModalOpen: false,
  };

  componentDidMount() {
    this.loadCourses();
  }

  loadCourses(goToTab: ?number) {
    const { profile } = this.props.context;
    coursesService
      .getAll()
      .then(response => {
        // Active courses were the user is enrolled
        const myCourses = _.filter(
          response,
          course => course.active && course.enrolled && course.accepted
        );
        // Active courses were the user is waiting for acceptance
        const pendingCourses = _.filter(
          response,
          course => course.active && course.enrolled && !course.accepted
        );
        // Other active courses
        const otherCourses = _.filter(response, course => course.active && !course.enrolled);
        // Inactive courses were the user was enrolled
        const finishedCourses = _.filter(
          response,
          course => !course.active && course.enrolled && course.accepted
        );

        let currentTab;
        if (goToTab !== undefined && goToTab !== null) {
          currentTab = goToTab;
        } else if (myCourses && myCourses.length > 0) {
          // If I have curses, go to my courses page
          currentTab = 0;
        } else if (pendingCourses && pendingCourses.length > 0) {
          // If I have curses pending accepting, go to that tab
          currentTab = 1;
        } else {
          // Go to Other courses tab
          currentTab = 2;
        }
        this.setState({ myCourses, otherCourses, pendingCourses, finishedCourses, currentTab });
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
    const { classes } = this.props;
    if (courses.length === 0) {
      return (
        <Typography variant="h5" color="textSecondary" className={classes.coursesGrid}>
          No se encuentran cursos
        </Typography>
      );
    }

    return (
      <Grid className={classes.coursesGrid} container>
        {_.chunk(courses, 6).map((row, idx) => (
          <Grid container xs={12} spacing={3} item id={idx} key={idx}>
            {_.map(row, course => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={2} id={course.id} key={course.id}>
                <CourseCard
                  courseId={course.id}
                  universityCourseId={course.university_course_id}
                  name={course.name}
                  description={course.description}
                  imgUri={course.img_uri}
                  enrolled={course.enrolled}
                  accepted={course.accepted}
                  onClickGoToCourse={(e, courseId) => this.handleClickGoToCourse(e, courseId)}
                  onClickEnrollToCourse={(e, courseId) =>
                    this.handleClickEnrollToCourse(e, courseId)
                  }
                  onClickUnenrollToCourse={(e, courseId) =>
                    this.handleClickUnenrollToCourse(e, courseId)
                  }
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    );
  }

  handleCreateCourseClick() {
    this.props.history.push("/courses/create");
  }

  handleClickGoToCourse(e: Event, courseId: number) {
    e.preventDefault();
    this.props.history.push(`/courses/${courseId}`);
  }

  handleClickEnrollToCourse(e: Event, courseId: number) {
    e.preventDefault();
    coursesService
      .enroll(courseId)
      .then(() => {
        this.setState({ enrollModalOpen: true })
        this.loadCourses(1); // Go to "Pending courses tab"
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

  handleChange(event, newValue) {
    this.setState({ currentTab: newValue });
  }

  render() {
    const { classes, context } = this.props;
    const {
      otherCourses,
      myCourses,
      pendingCourses,
      finishedCourses,
      enrollModalOpen,
      error,
    } = this.state;

    const tab2courses = [myCourses, pendingCourses, otherCourses, finishedCourses];

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <div className={classes.dashboardContainer}>
          {context.profile && context.profile.is_admin ? (
            <Fab
              color="primary"
              aria-label="add"
              className={classes.rightButton}
              onClick={() => this.handleCreateCourseClick()}
            >
              <AddIcon />
            </Fab>
          ) : (
            <div />
          )}
          <EnrollInformationModal
            open={enrollModalOpen}
            handleCloseModal={() => this.setState({ enrollModalOpen: false })}
          />
          <Paper>
            <Tabs
              value={this.state.currentTab}
              onChange={(event, newValue) => this.handleChange(event, newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
            >
              <Tab label="Mis cursos" />
              <Tab label="Mis cursos pendientes" />
              <Tab label="Otros cursos" />
              <Tab label="Cursos terminados" />
            </Tabs>
          </Paper>
          {this.renderCourseCards(tab2courses[this.state.currentTab])}
        </div>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CoursesPage));
