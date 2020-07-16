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
import { validate } from "../../utils/inputValidator";

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
  success: boolean,
};

class Signup extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null, invalidFields: new Set() },
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    degree: "",
    university: "",
    success: false,
  };

  handleChange(event, valid) {
    event.persist();
    // Close error message
    this.setState(prevState => {
      const { invalidFields } = prevState.error;
      if (valid && invalidFields.has(event.target.id)) {
        invalidFields.delete(event.target.id);
      } else if (!valid) {
        invalidFields.add(event.target.id);
      }
      return {
        [event.target.id]: event.target.value,
        error: { open: false, message: "", invalidFields },
      };
    });
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
      .then(() => {
        this.setState({ success: true });
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
          <DialogTitle id="alert-dialog-title">Valida tu email</DialogTitle>
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
          Sign Up
        </Typography>
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre"
            name="Name"
            autoComplete="name"
            error={error.invalidFields.has("name")}
            helperText={
              error.invalidFields.has("name") && "El nombre debe estar formado por letras"
            }
            autoFocus
            onChange={e =>
              this.handleChange(e, validate(e.target.value, /^[a-zA-Z\s]+$/, "string"))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="surname"
            label="Apellido"
            name="Surname"
            autoComplete="surname"
            error={error.invalidFields.has("surname")}
            helperText={
              error.invalidFields.has("surname") && "El apellido debe estar formado por letras"
            }
            autoFocus
            onChange={e =>
              this.handleChange(e, validate(e.target.value, /^[a-zA-Z\s]+$/, "string"))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="studentId"
            label="Padron"
            name="Student Id"
            autoComplete="studentId"
            error={error.invalidFields.has("studentId")}
            helperText={
              error.invalidFields.has("studentId") && "El padron debe estar formado por numeros"
            }
            autoFocus
            onChange={e =>
              this.handleChange(e, validate(e.target.value, /^[0-9a-zA-Z]+$/, "string"))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="degree"
            label="Carrera"
            name="Degree"
            autoComplete="degree"
            error={error.invalidFields.has("degree")}
            helperText={
              error.invalidFields.has("degree") && "La carrera debe estar formada por letras"
            }
            autoFocus
            onChange={e => this.handleChange(e, validate(e.target.value, /^[a-zA-Z]+$/, "string"))}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="university"
            label="Universidad"
            name="University"
            autoComplete="university"
            error={error.invalidFields.has("university")}
            helperText={
              error.invalidFields.has("university") &&
              "La universidad debe estar formada por letras"
            }
            autoFocus
            onChange={e => this.handleChange(e, validate(e.target.value, /^[a-zA-Z]+$/, "string"))}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="Username"
            autoComplete="username"
            error={error.invalidFields.has("username")}
            helperText={
              error.invalidFields.has("username") &&
              "El usuario debe estar formada por letras, guiones (_ ó -) o puntos (.)"
            }
            autoFocus
            onChange={e =>
              this.handleChange(e, validate(e.target.value, /^[a-zA-Z_-]+$/, "string"))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="Email"
            autoComplete="email"
            error={error.invalidFields.has("email")}
            helperText={error.invalidFields.has("email") && "El email debe ser un email valido"}
            autoFocus
            onChange={e =>
              this.handleChange(e, validate(e.target.value, /^\S+@\S+\.\S+$/, "string"))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            error={error.invalidFields.has("password")}
            helperText={
              error.invalidFields.has("password") &&
              "La password debe tener un largo minimo de 6 caracteres"
            }
            autoComplete="current-password"
            onChange={e => this.handleChange(e, validate(e.target.value, /.{6,}/, "string"))}
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
