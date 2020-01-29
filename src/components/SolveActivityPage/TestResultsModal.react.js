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
  //   const [open, setOpen] = React.useState(true);

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  //   const descriptionElementRef = React.useRef(null);
  //   React.useEffect(() => {
  //     if (open) {
  //       const { current: descriptionElement } = descriptionElementRef;
  //       if (descriptionElement !== null) {
  //         descriptionElement.focus();
  //       }
  //     }
  //   }, [open]);

  const { classes, results, open, handleCloseModal } = props;

  const title = results ? results.submission_status : "Corriendo pruebas";

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

//           <DialogContentText
//             id="scroll-dialog-description"
//             ref={descriptionElementRef}
//             tabIndex={-1}
//           >
//             Esto puede tardar unos segundos
//             {[...new Array(50)]
//               .map(
//                 () => `Cras mattis consectetur purus sit amet fermentum.
// Cras justo odio, dapibus ac facilisis in, egestas eget quam.
// Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
// Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
//               )
//               .join("\n")}
//           </DialogContentText>
