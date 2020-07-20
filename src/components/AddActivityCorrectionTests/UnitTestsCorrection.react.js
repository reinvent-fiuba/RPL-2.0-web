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

const initialUnitTestCode = {
  c: `#include <criterion/criterion.h>  // No borrar esto!
#include "api.h"  // Modificar con el nombre de la api que se le entrega al alumno!

Test(misc, testName1) {
    cr_assert(fooNoRepetido() == 1);
}

Test(misc, testName2) {
    cr_assert(barNoRepetido() == 2);
}
`,
  python: `import unittest  # No borrar esto!
import test_api # Modificar con el nombre de la api que se le entrega al alumno!

# Accede a las funciones del alumno desde el modulo test_api


class TestMethods(unittest.TestCase):

  def test_1(self):
    self.assertTrue(test_api.fooNoRepetido())

  def test_2(self):
    self.assertTrue(test_api.barNoRepetido())
`,
};

const documentationByLangugage = {
  c: "https://criterion.readthedocs.io/en/master/assert.html",
  python: "https://docs.python.org/3/library/unittest.html",
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
  onSaveUnitTest: void => void,
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
    const { onSaveUnitTest } = this.props;
    onSaveUnitTest();
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
                href={documentationByLangugage[activity.language]}
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
            defaultValue={initialUnitTestCode[activity.language]}
            value={unitTestCode}
            onChange={codeChanged => {
              this.setState({ unitTestCode: codeChanged });
              onChange(unitTestCode);
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
