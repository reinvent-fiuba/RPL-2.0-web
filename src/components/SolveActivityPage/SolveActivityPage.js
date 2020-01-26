// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";
import activitiesService from "../../services/activitiesService";
import submissionsService from "../../services/submissionsService";
import SimpleMonacoEditor from "./SimpleMonacoEditor.react";
import MarkdownRenderer from "./MarkdownRenderer";
import SplitPane from "react-split-pane";
import Button from "@material-ui/core/Button";
import "./SolveActivityPage.css";
import type { Activity } from "../../types";

// Styles
import "react-mde/lib/styles/css/react-mde-all.css";

const _ = require("lodash");

const drawerWidth = 240;

const styles = theme => ({
  // content: {
  //   flexGrow: 1,
  //   marginLeft: 0
  // },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 56
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
  secondHeader: {
    backgroundColor: "rgb(244, 243, 243)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px"
  },
  secondHeaderTitle: {
    alignSelf: "center",
    margin: "0px",
    color: "rgb(121, 116, 116)",
    fontFamily: "Arial, Verdana, san-serif"
  },
  submitButton: {
    alignSelf: "flex-end"
  }
});

type Props = {
  match: any,
  classes: any,
  history: any
};

type State = {
  error: { open: boolean, message: ?string },
  open: boolean,
  activity: ?Activity,
  code: string,
  editorWidth: string
};

class SolveActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    open: false,
    editorWidth: "100%",
    activity: null,
    code: ""
  };

  componentDidMount() {
    activitiesService
      .getActivity(
        this.props.match.params.courseId,
        this.props.match.params.activityId
      )
      .then(response => {
        this.setState({ activity: response, code: response.initial_code });
      })
      .catch(err => {
        this.setState({
          error: {
            open: true,
            message:
              "Hubo un error al obtener la actividad, Por favor reintenta"
          }
        });
      });
  }

  handleDrag(width) {
    this.setState({ editorWidth: width });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  onCodeChange(code: string) {
    this.setState({ code });
  }

  handleSubmitActivity(event: any) {
    // event.preventDefault();
    console.log("Submit");
    const { courseId, activityId } = this.props.match.params;
    const { code } = this.state;

    submissionsService
      .createSubmission(courseId, activityId, code)
      .then(response => {
        // Do something
      })
      .catch(err => {
        this.setState({
          error: {
            open: true,
            message:
              "Hubo un error al entregar la actividad, Por favor reintenta"
          }
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { activity, open } = this.state;
    return (
      <div>
        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={open}
          title="Resolver Actividad"
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={open}
          courseId={this.props.match.params.courseId}
        />
        {activity && (
          <main className={classes.content}>
            <div className={classes.drawerHeader} />
            <div className={classes.secondHeader}>
              <div className={classes.secondHeaderTitle}>
                Volver a modo editar
              </div>
              <h1 className={classes.secondHeaderTitle}>{activity.name}</h1>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={e => this.handleSubmitActivity(e)}
              >
                Entregar
              </Button>
            </div>
            <SplitPane
              split="vertical"
              defaultSize="50%"
              onChange={width => this.handleDrag(width)}
            >
              <SimpleMonacoEditor
                width={this.state.editorWidth}
                initialCode={activity.initial_code}
                language={activity.language.toLowerCase()}
                onCodeChange={code => this.onCodeChange(code)}
              />
              <div>
                <MarkdownRenderer content={activity.description} />
              </div>
            </SplitPane>
          </main>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(SolveActivityPage));
