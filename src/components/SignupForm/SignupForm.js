import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withState } from '../../utils/State';
import { withErrorHandling } from '../../utils/Error';
import ErrorNotification from '../../utils/ErrorNotification';
import authenticationService from '../../services/authenticationService';

const _ = require('lodash');

const styles = (theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: `0px ${theme.spacing(4)}px`,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Signup extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);

    this.state = {
      username: '',
      email: '',
      password: '',
      name: '',
      surname: '',
      studentId: '',
      degree: '',
      university: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: '' } });
  }

  handleClick(event) {
    event.preventDefault();
    const {
      username, email, password, name, surname, degree, university,
    } = this.state;

    authenticationService.signup({
      username,
      email,
      password,
      name,
      surname,
      degree,
      university,
    }).then((response) => {
      this.setState({ toLoginPage: true });
    }).catch((err) => {
      this.setState({ error: { open: true, message: 'Hubo un error de sign up, revisa que los datos ingresados sean validos.' } });
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.toLoginPage) {
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <ErrorNotification open={_.get(this.state, 'error.open')} message={_.get(this.state, 'error.message')} />
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.handleClick}
          >
            Sign Up
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Log in
            </Link>
          </Grid>
        </Grid>

      </div>
    );
  }
}

export default withErrorHandling(withState(withStyles(styles)(Signup)));
