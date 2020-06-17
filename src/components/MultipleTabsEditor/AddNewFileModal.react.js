// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
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
  handleCloseModal: (?string, string) => void,
  open: boolean,
  originalFileName: ?string,
  classes: any,
  existingFilenames: Array<string>,
};

type State = {
  error: { open: boolean, message: ?string },
  fileName: string,
  fileNameError: ?string,
};

class AddNewFileModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },

    // eslint-disable-next-line react/destructuring-assignment
    fileName: this.props.originalFileName ? this.props.originalFileName : "",
    fileNameError: null,
  };

  handleSubmit() {
    const { handleCloseModal, originalFileName, existingFilenames } = this.props;
    const { fileName } = this.state;

    if (!fileName) {
      this.setState({ fileNameError: "No puede estar en blanco" });
      return;
    }

    // No changes
    if (originalFileName === fileName) {
      handleCloseModal(null, "");
      return;
    }

    if (existingFilenames.includes(fileName)) {
      this.setState({ fileNameError: "Ese nombre de archivo ya existe" });
      return;
    }
    handleCloseModal(originalFileName, fileName);
  }

  catchEnter(ev) {
    if (ev.key === "Enter") {
      this.handleSubmit();
      // ev.preventDefault();
    }
  }

  render() {
    const { classes, open, handleCloseModal } = this.props;
    const { fileName, error, fileNameError } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <Dialog
          open={open}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          className={classes.modal}
          maxWidth="md"
        >
          <DialogTitle id="scroll-dialog-title">Nombre del archivo</DialogTitle>

          <DialogContent dividers>
            <div>
              <TextField
                id="outlined-full-width"
                autoFocus
                placeholder="mi_archivo.x"
                value={fileName}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={e => this.setState({ fileName: e.target.value })}
                onKeyPress={e => this.catchEnter(e)}
                error={fileNameError !== null}
                helperText={fileNameError}
              />
            </div>
            <DialogActions>
              <Button onClick={() => handleCloseModal(null, "")} color="primary">
                Cancelar
              </Button>
              <Button onClick={() => this.handleSubmit()} color="primary">
                Crear
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddNewFileModal);
