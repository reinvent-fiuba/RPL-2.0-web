// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import SplitPane from "react-split-pane";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReactResizeDetector from "react-resize-detector";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import activitiesService from "../../services/activitiesService";
import submissionsService from "../../services/submissionsService";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";
import ErrorNotification from "../../utils/ErrorNotification";
import SolvePageHeader from "../SolveActivityPage/SolvePageHeader.react";

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
    height: "100%",
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
  editor: {
    display: "flex",
    height: "100%",
    // maxHeight: "80vh",
  },
  submissionsSideList: {
    maxHeight: "80vh",
    overflow: "auto",
  },
  topDiv: {
    height: "100vh",
    overflow: "auto",
  },
  splitPaneStyle: {
    height: "80vh",
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
  code: ?{ [string]: string },
  editorWidth: string,
  editor: any,
  finalSubmissions: Array<{ [string]: string }>,
  selectedSubmissionIdx: ?number,
};

class FinalActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    editorWidth: "100%",
    activity: null,
    code: null,
    editor: null,
    finalSubmissions: [],
    selectedSubmissionIdx: null,
  };

  componentDidMount() {
    // Obtener todas las soluciones
    activitiesService
      .getActivity(this.props.match.params.courseId, this.props.match.params.activityId)
      .then(activityResponse => {
        this.setState({
          activity: activityResponse,
        });
        submissionsService
          .getFinalSolutionWithFileForStudent(
            this.props.match.params.courseId,
            this.props.match.params.activityId
          )
          .then(finalSolution => {
            this.setState({
              code: finalSolution.submited_code,
            });
            submissionsService
              .getAllFinalSolutionsFilesForStudent(
                this.props.match.params.courseId,
                this.props.match.params.activityId
              )
              .then(files => this.setState({ finalSubmissions: files }));
          })
          .catch(err => {
            if (err.status === 404) {
              return Promise.resolve(this.setState({ finalSubmissions: [] }));
            }
            return Promise.reject(err);
          });
      })
      .catch(err => {
        console.log(err);
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

  render() {
    const { classes } = this.props;
    const {
      activity,
      isSideBarOpen,
      editorWidth,
      error,
      code,
      editor,
      finalSubmissions,
      selectedSubmissionIdx,
    } = this.state;
    return (
      <div className={classes.topDiv}>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Otras soluciones de estudiantes"
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
              // handleSubmitActivity={e => this.handleSubmitActivity(e)}
              // handleOpenPastSubmissionsSidePanel={() => this.setOpenSubmissionsPanel()}
              activityName={activity.name}
              onlyTitle
              // history={history}
            />
            <SplitPane
              split="vertical"
              defaultSize="15%"
              onChange={width => this.handleDrag(width)}
              className={classes.splitPaneStyle}
            >
              <div className={classes.submissionsSideList}>
                <List>
                  {finalSubmissions.map((submissionCode, idx) => (
                    <ListItem
                      button
                      key={idx}
                      selected={selectedSubmissionIdx === idx}
                      onClick={() =>
                        this.setState({ code: finalSubmissions[idx], selectedSubmissionIdx: idx })
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <DescriptionOutlinedIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={`Solución ${idx}`} />
                    </ListItem>
                  ))}
                </List>
              </div>
              <div className={classes.editor}>
                <ReactResizeDetector
                  handleWidth
                  handleHeight={false}
                  onResize={() => (editor ? editor.layout : () => {})}
                >
                  {code && (
                    <MultipleTabsEditor
                      key={selectedSubmissionIdx}
                      width={editorWidth}
                      initialCode={code}
                      language={activity.language.toLowerCase()}
                      readOnly
                    />
                  )}
                </ReactResizeDetector>
              </div>
            </SplitPane>
          </main>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(FinalActivitiesPage));
