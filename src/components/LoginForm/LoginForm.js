import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import authenticationService from '../../services/authenticationService';

const styles = theme => ({
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
    this.handleClick  = this.handleClick.bind(this);
  }

  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
    authenticationService.login({
      username:   this.state.username,
      password:   this.state.password,
    }).then(response => response.text())
  };

  render(){
    const { classes } = this.props;

    return([
          <Typography component="h1" variant="h5">
            Log In
          </Typography>,
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
              onChange = {this.handleChange}
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
              onChange = {this.handleChange}
            />
            <RouterLink to="/">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleClick}
              >
                Log In
              </Button>
            </RouterLink>
          </form>,
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>      
    ]);
  }
}

export default withState(withStyles(styles)(LoginForm));
