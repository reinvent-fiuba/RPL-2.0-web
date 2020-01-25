// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import TopBar from "../TopBar/TopBar";
import activitiesService from "../../services/activitiesService";
import SimpleMonacoEditor from "./SimpleMonacoEditor.react";
import MarkdownRenderer from "./MarkdownRenderer";
import SplitPane from "react-split-pane";
import "./SolveActivityPage.css";
import type { Activity } from "../../types";

// Styles
import "react-mde/lib/styles/css/react-mde-all.css";

const _ = require("lodash");

const styles = theme => ({
  drawerHeader: {
    height: 56
  },
  content: {
    flexGrow: 1,
    marginLeft: 0
  }
});

type Props = {
  match: any,
  classes: any,
  history: any
};

type State = {
  error: { open: boolean, message: ?string },
  activity: ?Activity,
  editorWidth: string
};

class SolveActivityPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    editorWidth: "100%",
    activity: null
  };

  componentDidMount() {
    activitiesService
      .getActivity(
        this.props.match.params.courseId,
        this.props.match.params.activityId
      )
      .then(response => {
        this.setState({ activity: response });
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

  render() {
    const { classes } = this.props;
    const { activity } = this.state;
    return (
      <div>
        <TopBar
          // handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={false}
          title="Resolver Actividad"
        />

        {activity && (
          <main className={classes.content}>
            <div className={classes.drawerHeader} />
            <SplitPane
              split="vertical"
              defaultSize="50%"
              onChange={width => this.handleDrag(width)}
            >
              <SimpleMonacoEditor
                width={this.state.editorWidth}
                initialCode={activity.initial_code}
                language={activity.language.toLowerCase()}
              />
              <div>
                <h1>{activity.name}</h1>
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
