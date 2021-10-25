// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SubmissionResultStatusIcon from "../../utils/icons";
import type { SubmissionResult } from "../../types";
import getText from "../../utils/messages";
import submissionsService from "../../services/submissionsService";
import ErrorNotification from "../../utils/ErrorNotification";
import ActivityDescriptionAccordion from "./ActivityDescriptionAccordion";
import StdAccordion from "./StdAccordion";
import TestAccordion from "./TestAccordion";
import CodeAccordion from "./CodeAccordion";
import { withState } from "../../utils/State";

const styles = () => ({
  modal: {
    minHeight: "200px",
  },
  waitingDialog: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
  },
  dialogTitleText: {
    alignSelf: "center",
    marginRight: "10px",
  },
  markAsDefinitiveButton: {
    alignSelf: "flex-end",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    "& .MuiAccordionDetails-root": {
      flexWrap: "wrap",
      "& > *": {
        flex: 1,
      },
    },
    "& #scroll-dialog-description .MuiAlert-root": {
      marginBottom: "0.8rem",
      fontSize: "1rem",
    },
  },
});

type Props = {
  handleCloseModal: Event => void,
  open: boolean,
  classes: any,
  context: any,
  showWaitingDialog: boolean,
  showActivityDescription: boolean,
  activitySubmissionId: number,
  courseId: number,
  activityFinalSubmissionId: ?number,
  onMarkSubmissionAsFinal: number => void,
};

type State = {
  error: { open: boolean, message: ?string },
  results: ?SubmissionResult,
  getResultsTimerId: ?IntervalID,
};

class SubmissionResultModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    results: null,
    getResultsTimerId: null,
  };

  componentDidMount() {
    const { activitySubmissionId } = this.props;
    const { getResultsTimerId } = this.state;
    if (activitySubmissionId !== null) {
      submissionsService
        .getSubmissionResult(activitySubmissionId)
        .then(submissionResult => {
          clearInterval(getResultsTimerId);
          this.setState({ getResultsTimerId: null, results: submissionResult });
        })
        .catch(({ err, status }) => {
          console.log(err);
          if (status === 404) {
            this.setState({
              getResultsTimerId: setInterval(() => this.pullForResults(activitySubmissionId), 3000),
            });
            return;
          }
          this.setState({
            error: {
              open: true,
              message: "Hubo un error al obtener el resultado. Por favor reintenta",
            },
          });
        });
    }
  }

  pullForResults(submissionId: number) {
    console.log("Pidiendo resultado");
    const { getResultsTimerId } = this.state;

    submissionsService
      .getSubmissionResult(submissionId)
      .then(submissionResult => {
        clearInterval(getResultsTimerId);
        this.setState({ getResultsTimerId: null, results: submissionResult });
      })
      .catch(({ err, status }) => {
        console.log(err);
        if (status === 404) {
          return;
        }
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener el resultado. Por favor reintenta",
          },
        });
      });
  }

  onClickMarkAsFinalSolution(activityId: number, submissionId: number) {
    const { courseId, onMarkSubmissionAsFinal } = this.props;
    submissionsService
      .putSolutionAsFinal(courseId, activityId, submissionId)
      .then(() => {
        onMarkSubmissionAsFinal(submissionId);
      })
      .catch(err => {
        console.log(err);
        if (status === 404) {
          return;
        }
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al marcar la solución como definitiva. Por favor reintenta",
          },
        });
      });
  }

  onCloseModal(e) {
    const { handleCloseModal } = this.props;
    const { getResultsTimerId } = this.state;

    clearInterval(getResultsTimerId);
    handleCloseModal(e);
  }

  render() {
    const {
      classes,
      open,
      handleCloseModal,
      showWaitingDialog,
      activityFinalSubmissionId,
      context,
      courseId,
      showActivityDescription,
    } = this.props;

    const { results, error } = this.state;

    const title = results
      ? `Resultado de la corrida: ${getText(results.submission_status).toUpperCase()}`
      : "Corriendo pruebas";

    const getStderrColor = (item: string) => {
      if (item.includes("main") || item.includes("end_BUILD")) {
        return "secondary";
      }
      return "textSecondary";
    };

    const expandStd = results
      && (results.submission_status === "BUILD_ERROR" || results.submission_status === "RUNTIME_ERROR")

    const getStdoutColor = (item: string) => {
      if (item.includes("start_BUILD") || item.includes("end_BUILD")) {
        return "secondary";
      }
      if (item.includes("start_RUN") || item.includes("end_RUN")) {
        return "primary";
      }
      return "textSecondary";
    };
    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <Dialog
          open={open}
          onClose={e => this.onCloseModal(e)}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          className={classes.modal}
          fullWidth
          maxWidth={results ? "lg" : "xs"}
        >
          <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle} disableTypography>
            <Typography
              variant="h5"
              color="textSecondary"
              component="p"
              className={classes.dialogTitleText}
            >
              {title}
            </Typography>
            {results && (
              <SubmissionResultStatusIcon
                isFinalSolution={results.is_final_solution}
                submissionStatus={results.submission_status}
              />
            )}
          </DialogTitle>
          {!results && showWaitingDialog && (
            <DialogContent dividers className={classes.waitingDialog}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                Esto puede tardar unos segundos
              </DialogContentText>
              <CircularProgress />
            </DialogContent>
          )}

          {results && (
            <DialogContent dividers className={classes.dialogContent}>
              {/* Mark as definitive (if success) */}
              {!context.permissions.includes("activity_manage") && (
                <Box mb={3} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      results.submission_status !== "SUCCESS" || activityFinalSubmissionId !== null
                    }
                    className={classes.markAsDefinitiveButton}
                    onClick={() => this.onClickMarkAsFinalSolution(results.activity_id, results.id)}
                  >
                    Marcar como solucion definitiva
                  </Button>
                </Box>
              )}
              {/* Enunciado */}
              {showActivityDescription && (
                <Box mb={3}>
                  <ActivityDescriptionAccordion
                    courseId={courseId}
                    activityId={results.activity_id}
                  />
                </Box>
              )}
              {/* IO/Unit tests results and code */}
              <Box mb={3}>
                <TestAccordion results={results} />
              </Box>
              {/* Code */}
              <Box mb={3}>
                <CodeAccordion results={results} />
              </Box>
              {/* Stderr */}
              {results.stderr && (
                <Box mb={3}>
                  <StdAccordion
                    title="Stderr"
                    std={results.stderr}
                    getColor={getStderrColor}
                    startExpanded={expandStd} />
                </Box>
              )}
              {/* Stdout */}
              {results.stdout && (
                <Box mb={3}>
                  <StdAccordion
                    title="Stdout"
                    std={results.stdout}
                    getColor={getStdoutColor}
                    startExpanded={expandStd} />
                </Box>
              )}
              <DialogActions>
                <Button onClick={e => handleCloseModal(e)} color="primary">
                  Cerrar
                </Button>
              </DialogActions>
            </DialogContent>
          )}
        </Dialog>
      </div>
    );
  }
}

export default withState(withStyles(styles)(SubmissionResultModal));
