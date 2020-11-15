// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
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
  username: string,
  password: string,
};

class LoginForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    username: "",
    password: "",
  };

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  handleClick(event) {
    event.preventDefault();
    const { username, password } = this.state;

    authenticationService
      .login({
        username_or_email: username,
        password,
      })
      .then(response => {
        this.props.context.set("token", {
          accessToken: response.access_token,
          tokenType: response.token_type,
        });
      })
      .then(() => authenticationService.getProfile())
      .then(response => {
        this.props.context.set("profile", response);

        this.props.history.push(
          this.props.history.location.state ? this.props.history.location.state.goTo : "/courses"
        );
      })
      .catch(err => {
        console.log(err);
        if (err.status === 401 && err.err.error === "email_not_validated_error") {
          this.props.history.push(`/user/validateEmail?user=${username}`);
          return;
        }
        this.setState({
          error: {
            open: true,
            message: "Hubo un error de login, revisa que los datos ingresados sean validos.",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div>
        {/* {error.open && <ErrorNotification open={error.open} message={error.message} />} */}

        <Typography component="h1" variant="h5">
          Estamos haciendo mantenimiento de la plataforma. Disculpen las molestias!
        </Typography>
        {/* <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => this.handleChange(e)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => this.handleClick(e)}
          >
            Iniciar Sesión
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="/forgotPassword" variant="body2">
              Olvidé mi contraseña
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              No tenés una cuenta? Registrate
            </Link>
          </Grid>
        </Grid> */}
      </div>
    );
  }
}

export default withState(withStyles(styles)(LoginForm));
