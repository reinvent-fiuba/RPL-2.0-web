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

            {/* <DialogContentText id="scroll-dialog-description" tabIndex={-1}> */}
            <Typography variant="h4" color="textSecondary" component="p">
              EXIT MESSAGE:
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
            {results.stderr.split("\n").map((item, key) => (
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

            {results.stdout.split("\n").map((item, key) => (
              <Typography key={key} variant="subtitle1" color={getStdoutColor(item)} component="p">
                {item}
              </Typography>
            ))}

            {/* </DialogContentText> */}
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
