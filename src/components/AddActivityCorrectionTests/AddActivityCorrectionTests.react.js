// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import activitiesService from "../../services/activitiesService";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Activity, Category } from "../../types";

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
  divider: {
    margin: 20,
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

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ open: !prevState.open }));
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
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={open}
          title="Agregar Tests"
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={open}
          courseId={courseId}
        />
        <main className={`${classes.content} ${open ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateActivityPage));
