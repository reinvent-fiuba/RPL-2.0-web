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
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  username: string,
  password: string,
  email: string,
  name: string,
  surname: string,
  degree: string,
  university: string,
};

class Signup extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    degree: "",
    university: "",
  };

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  handleClick(event) {
    event.preventDefault();
    const { username, email, password, name, surname, degree, university } = this.state;

    authenticationService
      .signup({
        username,
        email,
        password,
        name,
        surname,
        degree,
        university,
      })
      .then(response => {
        this.props.history.push("/login");
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error de sign up, revisa que los datos ingresados sean validos.",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="Name"
            autoComplete="name"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="surname"
            label="Surname"
            name="Surname"
            autoComplete="surname"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="studentId"
            label="Student Id"
            name="Student Id"
            autoComplete="studentId"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="degree"
            label="Degree"
            name="Degree"
            autoComplete="degree"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="university"
            label="University"
            name="University"
            autoComplete="university"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="Username"
            autoComplete="username"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="Email"
            autoComplete="email"
            autoFocus
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
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
            Sign Up
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Olvidé mi contraseña
            </Link>
          </Grid>
          <Grid item>
            <Link href="/login" variant="body2">
              Ya estás registrado. Iniciá sesión
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(Signup));
