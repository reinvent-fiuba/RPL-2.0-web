import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import CourseForm from "../CourseForm/CourseForm";

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
});

class CreateCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, history } = this.props;
    return (
      <div>
        <main className={`${classes.content} ${this.state.open ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <CourseForm history={history} />
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateCoursePage));
