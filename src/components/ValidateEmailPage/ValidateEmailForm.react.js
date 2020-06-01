// @flow
import React from "react";
import queryString from "query-string";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CustomSnackbar from "../../utils/CustomSnackbar.react";
import { withState } from "../../utils/State";
import ErrorNotification from "../../utils/ErrorNotification";
import authenticationService from "../../services/authenticationService";

const _ = require("lodash");

const styles = theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: `0px ${theme.spacing(4)}px`,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

type Props = {
  classes: any,
  context: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  success: boolean,
  resentEmail: boolean,
};

class ValidateEmailForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    success: false,
    resentEmail: false,
  };

  componentDidMount() {
    const { search } = this.props.history.location;

    if (search === null || search === undefined) {
      this.setState({
        error: { open: true, message: "Hubo un error. Link inválido" },
      });
      return;
    }

    const { token } = queryString.parse(search);
    if (token === null || token === undefined) {
      return; // Loging in without having validated the e-mail
    }

    authenticationService
      .validateEmailToken(token)
      .then(response => {
        console.log(response);
        this.setState({ success: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error, Por favor genera otro link",
          },
        });
      });
  }

  resendEmailValidationToken() {
    const { search } = this.props.history.location;

    if (search === null || search === undefined) {
      this.setState({
        error: { open: true, message: "Hubo un error. Link inválido" },
      });
      return;
    }

    const { user } = queryString.parse(search);
    if (user === null || user === undefined) {
      this.setState({
        error: { open: true, message: "Hubo un error. Por favor intenta de nuevo más tarde" },
      });
      return;
    }

    authenticationService
      .resendEmailToken(user)
      .then(response => {
        console.log(response);
        this.setState({ resentEmail: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message:
              err.status === 404
                ? "El usuario no existe"
                : "Hubo un error. Por favor intenta de nuevo más tarde",
          },
        });
      });
  }

  render() {
    const { history } = this.props;
    const { error, success, resentEmail } = this.state;

    return (
      <div>
        {error.open && (
          <ErrorNotification open={error.open} message={error.message} horizontalPosition="right" />
        )}

        {resentEmail && (
          <CustomSnackbar
            open={resentEmail}
            message="Se ha reenviado el Email"
            horizontalPosition="right"
          />
        )}

        {/* // Loging in without having validated the e-mail */}
        {!success && (
          <div>
            <Typography variant="h3" color="textPrimary" component="h1">
              Parece que tu e-mail todavía no fue validado.
            </Typography>
            <br />
            <br />
            <br />
            <Button
              variant="outlined"
              onClick={() => this.resendEmailValidationToken()}
              color="primary"
            >
              Reenviar email
            </Button>
          </div>
        )}

        {/* // e-mail successfully validated Dialog */}
        <Dialog
          open={success}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Éxito</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Email validado! Felicitaciones!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => history.push("/login")} color="primary">
              Volver al inicio
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ValidateEmailForm));
