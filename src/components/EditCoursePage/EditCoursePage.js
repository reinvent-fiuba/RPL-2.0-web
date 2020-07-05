import React from "react";
import { withStyles } from "@material-ui/core/styles";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
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

class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, history, context } = this.props;
    return (
      <div>
        <TopBar
          handleDrawerOpen={this.handleDrawerOpen}
          open={this.state.open}
          title="Editar Curso"
        />
        <SideBar handleDrawerClose={this.handleDrawerClose} open={this.state.open} />
        <main className={`${classes.content} ${this.state.open ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <CourseForm course={context.course} history={history} />
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(EditCoursePage));
