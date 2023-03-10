// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import MonacoEditor from "react-monaco-editor";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";
import { withState } from "../../utils/State";
import type { Activity } from "../../types";
import constants from "../../utils/constants";

const styles = theme => ({
  divider: {
    margin: 20,
  },
  list: {
    margin: 20,
    backgroundColor: "#f5f5f5",
    maxWidth: "500px",
  },
  addTestCaseButton: {
    display: "flex",
    marginLeft: "auto",
  },
  titleButton: {
    display: "inline-flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
});

type Props = {
  classes: any,
  courseId: number,
  activityId: number,
  onSaveUnitTest: string => void,
  onChange: string => void,
};

type State = {
  error: { open: boolean, message: ?string },
  activity: ?Activity,
  unitTestCode: string,
};

class UnitTestsCorrection extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    activity: null,
    unitTestCode: "",
  };

  componentDidMount() {
    const { courseId, activityId } = this.props;
    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        this.setState({
          activity: response,
          unitTestCode:
            response.activity_unit_tests || constants.languages[response.language].testCode,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al guardar el test, Por favor reintenta",
          },
        });
      });
  }

  handleSaveUnitTest() {
    const { onSaveUnitTest } = this.props;
    const { unitTestCode } = this.state;
    onSaveUnitTest(unitTestCode);
  }

  render() {
    const { classes, onChange } = this.props;

    const { error, activity, unitTestCode } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        {activity && (
          <div>
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              className={classes.title}
            >
              {`Utiliza las funciones que desarrollaron los alumnos para comprobar que funcionan
          correctamente. Documentación de la `}
              <a
                href={constants.languages[activity.language].testDocs}
                target="_blank"
                rel="noopener noreferrer"
              >
                librería de test unitarios
              </a>
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              className={classes.title}
            >
              No te olvides de aclararles cómo tiene que ser la firma de la función!
            </Typography>
          </div>
        )}
        <br />

        <Fab
          aria-label="add"
          size="small"
          color="primary"
          className={classes.addTestCaseButton}
          onClick={() => this.handleSaveUnitTest()}
        >
          <SaveIcon />
        </Fab>

        <br />

        {activity && (
          <MonacoEditor
            height="500"
            options={{
              renderFinalNewline: true,
            }}
            language={activity.language}
            theme="vs-dark"
            defaultValue={constants.languages[activity.language].testCode}
            value={unitTestCode}
            onChange={codeChanged => {
              this.setState({ unitTestCode: codeChanged });
              onChange(codeChanged);
            }}
            editorDidMount={mountedEditor => {
              mountedEditor.changeViewZones(changeAccessor => {
                changeAccessor.addZone({
                  afterLineNumber: 0,
                  heightInLines: 1,
                  domNode: document.createElement("span"),
                });
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(UnitTestsCorrection));
