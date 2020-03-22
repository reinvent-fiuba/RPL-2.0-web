// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import SplitPane from "react-split-pane";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import activitiesService from "../../services/activitiesService";
import submissionsService from "../../services/submissionsService";
import SimpleMonacoEditor from "./SimpleMonacoEditor.react";
import MarkdownRenderer from "./MarkdownRenderer";
import ErrorNotification from "../../utils/ErrorNotification";
import SolvePageHeader from "./SolvePageHeader.react";
import SubmissionResultModal from "../SubmissionResultModal/TestResultsModal.react";
import "./SolveActivityPage.css";
import type { Activity } from "../../types";

// Styles
import "react-mde/lib/styles/css/react-mde-all.css";

const _ = require("lodash");

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 56,
  },
  content: {
    flexGrow: 1,
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
  circularProgress: {
    position: "absolute",
    left: "50%",
    top: "50%",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  activity: ?Activity,
  code: string,
  editorWidth: string,
  submittedActivity: boolean,
  selectedSubmissionId: ?number,
};

class SolveActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    editorWidth: "100%",
    activity: null,
    code: "",
    submittedActivity: false,
    selectedSubmissionId: null,
  };

  componentDidMount() {
    activitiesService
      .getActivity(this.props.match.params.courseId, this.props.match.params.activityId)
      .then(response => {
        this.setState({ activity: response, code: response.initial_code });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleDrag(width) {
    this.setState({ editorWidth: width });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  onCodeChange(code: string) {
    this.setState({ code });
  }

  handleSubmitActivity(event: any) {
    // TODO: si ?teacherTest=true que sea otro endpoint o algo para que en el backend se tome diferente
    event.preventDefault();
    console.log("Submit");
    const { courseId, activityId } = this.props.match.params;
    const { code, activity } = this.state;

    const filename =
      activity && activity.language.toLowerCase() === "c" ? "main.c" : "assignment_main.py";

    submissionsService
      .createSubmission(courseId, activityId, code, filename)
      .then(response => {
        this.setState({
          submittedActivity: true,
          selectedSubmissionId: response.id,
        });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al entregar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleCloseModal(e: Event) {
    e.preventDefault();
    this.setState({ submittedActivity: false, selectedSubmissionId: null });
  }

  render() {
    const { classes, match } = this.props;
    const {
      activity,
      isSideBarOpen,
      submittedActivity,
      selectedSubmissionId,
      editorWidth,
      error,
    } = this.state;

    const { profile } = this.props.context;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Resolver Actividad"
          userId={profile.id}
          courseId={match.params.courseId}
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          courseId={this.props.match.params.courseId}
        />
        {!activity && <CircularProgress className={classes.circularProgress} />}
        {activity && (
          <main className={classes.content}>
            <div className={classes.drawerHeader} />
            <SolvePageHeader
              handleSubmitActivity={e => this.handleSubmitActivity(e)}
              activityName={activity.name}
            />
            <SplitPane
              split="vertical"
              defaultSize="50%"
              onChange={width => this.handleDrag(width)}
            >
              <SimpleMonacoEditor
                width={editorWidth}
                initialCode={activity.initial_code}
                language={activity.language.toLowerCase()}
                onCodeChange={_.throttle(code => this.onCodeChange(code))}
              />

              <div>
                <MarkdownRenderer content={activity.description} />
              </div>
            </SplitPane>
          </main>
        )}
        {submittedActivity && (
          <SubmissionResultModal
            activitySubmissionId={selectedSubmissionId}
            open={submittedActivity}
            handleCloseModal={e => this.handleCloseModal(e)}
            showWaitingDialog
          />
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(SolveActivityPage));
