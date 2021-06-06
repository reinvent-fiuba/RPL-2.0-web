// @flow
import React from "react";
import queryString from "query-string";
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
  disableButton: boolean,
  newPassword: string,
  repeatPassword: string,
  success: boolean,
};

class ResetPasswordForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    disableButton: false,
    newPassword: "",
    repeatPassword: "",
    success: false,
  };

  componentDidMount() {
    const { search } = this.props.history.location;

    if (search === null || search === undefined) {
      this.setState({
        error: { open: true, message: "Hubo un error. Link inválido" },
        disableButton: true,
      });
      return;
    }

    const { token } = queryString.parse(search);
    if (token === null || token === undefined) {
      this.setState({
        error: { open: true, message: "Hubo un error. Por favor genera otro link" },
        disableButton: true,
      });
    }
  }

  handleClick(event) {
    event.preventDefault();
    const { newPassword, repeatPassword } = this.state;
    const { token } = queryString.parse(this.props.history.location.search);

    if (newPassword !== repeatPassword) {
      this.setState({
        error: { open: true, message: "Las contraseñas no coinciden" },
      });
      return;
    }

    authenticationService
      .resetPassword(token, newPassword)
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
    const { error, disableButton, success, repeatPassword, newPassword } = this.state;

    return (
      <div>
        {error.open && (
          <ErrorNotification open={error.open} message={error.message} horizontalPosition="right" />
        )}

        <Dialog
          open={success}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Éxito</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Podés volver a ingresar usando tu nueva contraseña
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => history.push("/login")} color="primary">
              Volver al inicio
            </Button>
          </DialogActions>
        </Dialog>

        <Typography component="h1" variant="h5">
          Resetear contraseña
        </Typography>
        <br />
        <Typography component="p" variant="body1">
          {`Guardala bien! Podes ayudarte de `}
          <a
            href="https://www.google.com/search?q=password+manager&oq=password+manager&aqs=chrome..69i57j0l6j69i60.2543j0j7&sourceid=chrome&ie=UTF-8"
            target="_blank"
            rel="noopener noreferrer"
          >
            gestores de contraseñas
          </a>
        </Typography>
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Contraseña"
            name="password"
            autoFocus
            type="password"
            onChange={e =>
              this.setState({
                newPassword: e.target.value,
                disableButton: e.target.value !== repeatPassword,
              })
            }
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="repeat_password"
            label="Repite la contraseña"
            name="repeate_password"
            type="password"
            onChange={e =>
              this.setState({
                repeatPassword: e.target.value,
                disableButton: e.target.value !== newPassword,
              })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => this.handleClick(e)}
            disabled={disableButton}
          >
            Confirmar
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

export default withState(withStyles(styles)(ResetPasswordForm));
