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

const styles = theme => ({
  modal: {
    minHeight: "200px"
  },
  circularProgress: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
});

type Props = {
  handleCloseModal: Event => void,
  open: boolean,
  results: any,
  classes: any
};

function TestResultsModal(props: Props) {
  const { classes, results, open, handleCloseModal } = props;

  const title = results
    ? `Resultado de la corrida: ${results.submission_status}`
    : "Corriendo pruebas";

  return (
    <div>
      <Dialog
        open={open}
        onClose={e => handleCloseModal(e)}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className={classes.modal}
        fullWidth={true}
        maxWidth={results ? "lg" : "xs"}
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        {!results && (
          <DialogContent dividers={true}>
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
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              //   ref={descriptionElementRef}
              tabIndex={-1}
            >
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
              <h2>STDOUT:</h2> <br />
              {results.stdout.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </DialogContentText>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(TestResultsModal);
