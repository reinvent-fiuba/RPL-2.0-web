// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import MonacoEditor from "react-monaco-editor";
import ErrorNotification from "../../utils/ErrorNotification";
import CustomSnackbar from "../../utils/CustomSnackbar.react";
import activitiesService from "../../services/activitiesService";
import activityTestsService from "../../services/activityTestsService";
import { withState } from "../../utils/State";
import type { Activity } from "../../types";

const initialUnitTestCode = {
  c: `#include <criterion/criterion.h>  // No borrar esto!
#include "main.c"  // No borrar esto!

Test(misc, testName1) {
    cr_assert(fooNoRepetido() == 1);
}

Test(misc, testName2) {
    cr_assert(barNoRepetido() == 2);
}
`,
  python: `import unittest  # No borrar esto!
import assignment_main # No borrar esto!

# Accede a las funciones del alumno desde el modulo assignment_main


class TestMethods(unittest.TestCase):

  def test_1(self):
    self.assertTrue(assignment_main.fooNoRepetido())

  def test_2(self):
    self.assertTrue(assignment_main.barNoRepetido())
`,
};

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
};

type State = {
  error: { open: boolean, message: ?string },
  successSave: boolean,
  activity: ?Activity,
  unitTestCode: string,
};

class IOCorrectionTests extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    successSave: false,
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
          unitTestCode: response.activity_unit_tests || initialUnitTestCode[response.language],
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
    const { courseId, activityId } = this.props;
    const { activity, unitTestCode } = this.state;

    let promise;
    if (activity && (!activity.is_iotested || activity.activity_unit_tests)) {
      promise = activityTestsService.updateUnitTest(courseId, activityId, unitTestCode);
    } else {
      promise = activityTestsService.createUnitTest(courseId, activityId, unitTestCode);
    }

    promise
      .then(updatedActivity => {
        this.setState({ activity: updatedActivity, successSave: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar la actividad, Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    // const { courseId, activityId } = this.props;

    const { error, successSave, activity, unitTestCode } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        {successSave && <CustomSnackbar open={successSave} message="El test se guardó con éxito" />}
        <Typography variant="body1" color="textSecondary" component="p" className={classes.title}>
          {`Utiliza las funciones que desarrollaron los alumnos para comprobar que funcionan
          correctamente. Documentación de la `}
          <a
            href="https://criterion.readthedocs.io/en/master/assert.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            librería de test unitarios
          </a>
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p" className={classes.title}>
          No te olvides de aclararles cómo tiene que ser la firma de la función!
        </Typography>
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
            height="800"
            options={{
              renderFinalNewline: true,
            }}
            language={activity.language}
            theme="vs-dark"
            defaultValue={initialUnitTestCode[activity.language]}
            value={unitTestCode}
            onChange={codeChanged =>
              this.setState({ unitTestCode: codeChanged, successSave: false })}
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

export default withState(withStyles(styles)(IOCorrectionTests));
