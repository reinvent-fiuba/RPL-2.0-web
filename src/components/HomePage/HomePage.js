import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Login from '../Login/Login';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    backgroundImage: 'url(src/components/HomePage/fiuba.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
});

class HomePage extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render(){
    const { classes } = this.props;

    return(
      <Grid container className={classes.root} component="main">
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image}/>
        <Grid item xs={12} sm={8} md={5} elevation={6} square component={Paper}>
          <div className={classes.paper}>
            <Login/>
          </div>
        </Grid>
      </Grid>  
    );
  }
}

export default withStyles(styles)(HomePage);
