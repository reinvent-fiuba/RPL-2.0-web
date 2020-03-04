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
import ReactDiffViewer from "react-diff-viewer";
import Typography from "@material-ui/core/Typography";
import type { SubmissionResult } from "../../types";
import getText from "../../utils/messages";
import submissionsService from "../../services/submissionsService";
import ErrorNotification from "../../utils/ErrorNotification";

const styles = () => ({
  modal: {
    minHeight: "200px",
  },
  circularProgress: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

type Props = {
  handleCloseModal: Event => void,
  open: boolean,
  classes: any,
  showWaitingDialog: boolean,
  activitySubmissionId: number,
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
        .then(response => {
          clearInterval(getResultsTimerId);
          this.setState({ getResultsTimerId: null, results: response });
        })
        .catch(({ err, status }) => {
          console.log(err);
          if (status === 404) {
            this.setState({
              getResultsTimerId: setInterval(() => this.pullForResults(activitySubmissionId), 1000),
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
      .then(response => {
        clearInterval(getResultsTimerId);
        this.setState({ getResultsTimerId: null, results: response });
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

  onCloseModal(e) {
    const { handleCloseModal } = this.props;
    const { getResultsTimerId } = this.state;

    clearInterval(getResultsTimerId);
    handleCloseModal(e);
  }

  render() {
    const { classes, open, handleCloseModal, showWaitingDialog } = this.props;
    const { results, error } = this.state;

    const title = results
      ? `Resultado de la corrida: ${getText(results.submission_status).toUpperCase()}`
      : "Corriendo pruebas";

    const getStdoutColor = item => {
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
          <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
          {!results && showWaitingDialog && (
            <DialogContent dividers>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                Esto puede tardar unos segundos
              </DialogContentText>
              <CircularProgress className={classes.circularProgress} />
            </DialogContent>
          )}

          {results && (
            <DialogContent dividers>
              {results.io_test_run_results &&
                results.io_test_run_results.map((ioResult, idx) => {
                  return (
                    <DialogContentText
                      key={idx}
                      id="scroll-dialog-description"
                      tabIndex={-1}
                      component="div"
                    >
                      <Typography variant="h2" color="textSecondary" component="p">
                        {`IO Test case: Nº${idx}`}
                      </Typography>
                      <ReactDiffViewer
                        key={ioResult.id}
                        oldValue={ioResult.expected_output}
                        newValue={ioResult.run_output}
                        showDiffOnly={false}
                        splitView
                      />
                      <br />
                    </DialogContentText>
                  );
                })}

              <Typography variant="h4" color="textSecondary" component="p">
                MENSAJE DE ERROR:
              </Typography>
              <br />
              <Typography variant="subtitle1" color="textSecondary" component="p">
                {results.exit_message}
              </Typography>

              <br />
              <br />
              <Typography variant="h4" color="textSecondary" component="p">
                STDERR:
              </Typography>

              <br />
              {results.stderr &&
                results.stderr.split("\n").map((item, key) => (
                  <Typography key={key} variant="subtitle1" color="textSecondary" component="p">
                    {item}
                  </Typography>
                ))}

              <br />
              <br />
              <Typography variant="h4" color="textSecondary" component="p">
                STDOUT:
              </Typography>
              <br />

              {results.stdout &&
                results.stdout.split("\n").map((item, key) => (
                  <Typography
                    key={key}
                    variant="subtitle1"
                    color={getStdoutColor(item)}
                    component="p"
                  >
                    {item}
                  </Typography>
                ))}

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

export default withStyles(styles)(SubmissionResultModal);
