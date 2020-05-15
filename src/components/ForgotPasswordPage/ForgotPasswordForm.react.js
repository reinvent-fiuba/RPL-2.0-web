// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
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
  email: string,
  success: boolean,
};

class ForgotPasswordForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    email: "",
    success: false,
  };

  handleClick(event) {
    event.preventDefault();
    const { email } = this.state;

    authenticationService
      .forgotPassword(email)
      .then(response => {
        console.log(response);
        this.setState({ success: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error, revisa que los datos ingresados sean validos.",
          },
        });
      });
  }

  render() {
    const { classes, history } = this.props;
    const { error, success } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <Dialog
          open={success}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Próximo paso</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Revisá tu bandeja de entrada y seguí las instrucciones en el email. Puede tardar unos
              minutos en llegar.
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              No te olvides de chequear en la carpeta de SPAM!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => history.push("/login")} color="primary">
              Volver al inicio
            </Button>
          </DialogActions>
        </Dialog>

        <Typography component="h1" variant="h5">
          Olvidé mi contraseña
        </Typography>
        <br />
        <Typography component="p" variant="body1">
          Te enviaremos un link a tu email con el que vas a poder cambiar tu contraseña
        </Typography>
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="Email"
            autoFocus
            onChange={e => this.setState({ email: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => this.handleClick(e)}
          >
            Enviar token
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="/login" variant="body2">
              Ya me la acordé!
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              No tenés una cuenta? Registrate
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ForgotPasswordForm));
