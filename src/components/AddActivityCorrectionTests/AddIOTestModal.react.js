// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import ErrorNotification from "../../utils/ErrorNotification";
import activityTestsService from "../../services/activityTestsService";
import type { IOTest } from "../../types";

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
  ioTest: ?IOTest,
  idx: ?number,
  courseId: number,
  activityId: number,
  classes: any,
};

type State = {
  error: { open: boolean, message: ?string },

  textIn: ?string,
  textOut: ?string,
  textInError: ?string,
  textOutError: ?string,
};

class AddIOTestModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },

    // eslint-disable-next-line react/destructuring-assignment
    textIn: this.props.ioTest ? this.props.ioTest.in : "",
    // eslint-disable-next-line react/destructuring-assignment
    textOut: this.props.ioTest ? this.props.ioTest.out : "",
    textInError: null,
    textOutError: null,
  };

  handleSubmit(e) {
    const { ioTest, courseId, activityId, handleCloseModal } = this.props;
    const { textIn, textOut } = this.state;

    if (!textIn) {
      this.setState({ textInError: "No puede estar en blanco" });
    } else {
      this.setState({ textInError: null });
    }
    if (!textOut) {
      this.setState({ textOutError: "No puede estar en blanco" });
    } else {
      this.setState({ textOutError: null });
    }

    if (!textIn || !textOut) {
      return;
    }
    let promise;
    if (!ioTest) {
      promise = activityTestsService.createIOTest(courseId, activityId, textIn, textOut);
    } else {
      promise = activityTestsService.updateIOTest(courseId, activityId, ioTest.id, textIn, textOut);
    }

    promise
      .then(() => {
        handleCloseModal(e);
      })
      .catch(() => {
        // console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al crear el test, Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes, open, handleCloseModal, idx } = this.props;
    const { textIn, textOut, error, textInError, textOutError } = this.state;

    const title = idx !== null && idx !== undefined ? `Test Case ${idx}` : "Nuevo test case";

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <Dialog
          open={open}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          className={classes.modal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>

          <DialogContent dividers>
            <div>
              <Typography
                variant="h5"
                color="textSecondary"
                component="h1"
                className={classes.title}
              >
                INPUT:
              </Typography>
              <br />
              <TextField
                id="outlined-full-width"
                placeholder="Texto de input"
                value={textIn}
                fullWidth
                multiline
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={e => this.setState({ textIn: e.target.value })}
                error={textInError !== null}
                helperText={textInError}
              />
              <br />
              <br />
              <Typography
                variant="h5"
                color="textSecondary"
                component="h1"
                className={classes.title}
              >
                OUTPUT:
              </Typography>
              <br />
              <TextField
                id="outlined-full-width"
                placeholder="Texto de output"
                value={textOut}
                fullWidth
                multiline
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={e => this.setState({ textOut: e.target.value })}
                error={textOutError !== null}
                helperText={textOutError}
              />
            </div>
            <DialogActions>
              <Button onClick={e => handleCloseModal(e)} color="primary">
                Cancelar
              </Button>
              <Button onClick={e => this.handleSubmit(e)} color="primary">
                Crear
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddIOTestModal);
