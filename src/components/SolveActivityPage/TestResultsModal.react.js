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
import type { SubmissionResult } from "../../types";

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
  results: SubmissionResult,
  classes: any,
  showWaitingDialog: boolean,
};

function TestResultsModal(props: Props) {
  const { classes, results, open, handleCloseModal, showWaitingDialog } = props;

  const title = results
    ? `Resultado de la corrida: ${results.submission_status}`
    : "Corriendo pruebas";

  return (
    <div>
      <Dialog
        open={open}
        onClose={e => handleCloseModal(e)}
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
            <DialogContentText
              id="scroll-dialog-description"
              //   ref={descriptionElementRef}
              tabIndex={-1}
            >
              Esto puede tardar unos segundos
            </DialogContentText>
            <CircularProgress className={classes.circularProgress} />
          </DialogContent>
        )}

        {results && (
          <DialogContent dividers>
            {results.io_test_run_results.map((ioResult, idx) => {
              return (
                <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                  <h2>{`IO Test case: Nº${idx}`}</h2>
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

            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <h2>EXIT MESSAGE:</h2>
              <br />
              {results.exit_message}
              <br />
              <br />
              <h2>STDERR:</h2>
              <br />
              {results.stderr.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
              <br />
              <br />
              <h2>STDOUT:</h2>
              <br />
              {results.stdout.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </DialogContentText>
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

export default withStyles(styles)(TestResultsModal);
