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
import SolveActivityFirstModal from "./SolveActivityFirstModal.react";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import submissionsService from "../../services/submissionsService";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";
import ErrorNotification from "../../utils/ErrorNotification";
import SolvePageHeader from "../SolveActivityPage/SolvePageHeader.react";

import type { Activity } from "../../types";

// Styles
import "react-mde/lib/styles/css/react-mde-all.css";

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
  submissionsList: {
    padding: "0",
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
  editorWidth: string,
  editor: any,
  finalSubmissions: Array<{ [string]: string }>,
  selectedSubmissionIdx: ?number,
  openModal: boolean,
  teacherMode: boolean,
};

class FinalActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    editorWidth: "100%",
    activity: null,
    editor: null,
    finalSubmissions: [],
    selectedSubmissionIdx: null,
    openModal: false,
    teacherMode: false,
  };

  componentDidMount() {
    const { permissions } = this.props.context;
    if (permissions.includes("activity_manage")) {
      this.loadSubmissionsForTeacher();
    } else {
      this.loadSubmissionsForStudents();
    }
  }

  loadSubmissionsForTeacher() {
    const { courseId, activityId } = this.props.match.params;
    activitiesService
      .getActivity(courseId, activityId)
      .then(activityResponse => {
        this.setState({
          activity: activityResponse,
          teacherMode: true,
        });
        submissionsService
          .getAllFinalSolutionsFilesForStudent(courseId, activityId)
          .then(files => {
            if (files.length === 0) {
              this.setState({ finalSubmissions: [], openModal: true });
            } else {
              this.setState({
                finalSubmissions: files,
                selectedSubmissionIdx: 0,
              });
            }
          })
          .catch(err => {
            if (err.status === 404) {
              return Promise.resolve(this.setState({ finalSubmissions: [], openModal: true }));
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

  loadSubmissionsForStudents() {
    const { courseId, activityId } = this.props.match.params;
    // Obtener todas las soluciones
    activitiesService
      .getActivity(courseId, activityId)
      .then(activityResponse => {
        this.setState({
          activity: activityResponse,
          teacherMode: false,
        });
        submissionsService
          .getFinalSolutionWithFileForStudent(courseId, activityId)
          .then(finalSolution => {
            this.setState({
              activity: activityResponse,
            });
            submissionsService
              .getAllFinalSolutionsFilesForStudent(
                courseId,
                activityId,
                finalSolution.submission_file_id
              )
              .then(files =>
                this.setState({
                  finalSubmissions: [finalSolution.submited_code, ...files],
                  selectedSubmissionIdx: 0,
                })
              );
          })
          .catch(err => {
            if (err.status === 404) {
              return Promise.resolve(this.setState({ finalSubmissions: [], openModal: true }));
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

  render() {
    const { classes, history } = this.props;
    const {
      activity,
      isSideBarOpen,
      editorWidth,
      error,
      editor,
      finalSubmissions,
      selectedSubmissionIdx,
      openModal,
      teacherMode,
    } = this.state;
    return (
      <div className={classes.topDiv}>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        {!activity && <CircularProgress className={classes.circularProgress} />}
        {activity && (
          <main className={classes.content}>
            <div className={classes.drawerHeader} />
            <SolvePageHeader activity={activity} history={history} onlyTitle />
            <SolveActivityFirstModal
              open={openModal}
              teacherMode={teacherMode}
              onBackdropClicked={() => this.setState({ openModal: false })}
              onGoBackClicked={() => history.goBack()}
            />
            {selectedSubmissionIdx !== null && (
              <SplitPane
                split="vertical"
                defaultSize="15%"
                onChange={width => this.handleDrag(width)}
                className={classes.splitPaneStyle}
              >
                <div className={classes.submissionsSideList}>
                  <List className={classes.submissionsList}>
                    {finalSubmissions.map((submissionCode, idx) => (
                      <ListItem
                        button
                        key={idx}
                        selected={selectedSubmissionIdx === idx}
                        onClick={() => this.setState({ selectedSubmissionIdx: idx })}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <DescriptionOutlinedIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={idx === 0 && !teacherMode ? `Mi Solución` : `Solución ${idx}`}
                        />
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
                    {selectedSubmissionIdx !== null &&
                      selectedSubmissionIdx !== undefined &&
                      finalSubmissions.length > 0 && (
                        <MultipleTabsEditor
                          key={selectedSubmissionIdx}
                          width={editorWidth}
                          initialCode={finalSubmissions[selectedSubmissionIdx]}
                          language={activity.language.toLowerCase()}
                          readOnly
                        />
                      )}
                  </ReactResizeDetector>
                </div>
              </SplitPane>
            )}
          </main>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(FinalActivitiesPage));
