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

class LoginForm extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);

    this.state = {
      username: '',
      password: '',
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
    const { username, password } = this.state;

    authenticationService.login({
      usernameOrEmail: username,
      password,
    }).then((response) => {
      this.props.context.set('token', { accessToken: response.access_token, tokenType: response.token_type });
    }).then(() => authenticationService.getProfile()).then((response) => {
      this.props.context.set('profile', response);
      this.setState({ toMainPage: true });
    })
      .catch((err) => {
        this.setState({ error: { open: true, message: 'Hubo un error de login, revisa que los datos ingresados sean validos.' } });
      });
  }

  render() {
    const { classes } = this.props;

    if (this.state.toMainPage) {
      return <Redirect to="/courses" />;
    }

    return (
      <div>
        <ErrorNotification open={_.get(this.state, 'error.open')} message={_.get(this.state, 'error.message')} />
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
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
            Iniciar Sesión
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Olvidé mi contraseña
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

export default withErrorHandling(withState(withStyles(styles)(LoginForm)));
