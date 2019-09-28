import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';

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

class Signup extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);

    this.state = {
      name: '',
      surname: '',
      studentId: '',
      degree: '',
      university: '',
      username: '',
      email: '',
      password: ''
    };
  }

  render(){
    const { classes } = this.props;

    return([
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>,
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>         
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

export default withStyles(styles)(Signup);
