import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Fiuba from "./fiuba.jpg";
import logo from "../../logo_large.png";

const styles = theme => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    backgroundImage: `url(${Fiuba})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  footer: {
    position: "absolute",
    width: "100%",
    bottom: "5%",
    left: "50%",
    transform: "translate(-50%, -5%)",
    background: "rgba(0,0,0,0.4)",
  },
  footerText: {
    fontSize: theme.typography.pxToRem(12),
    color: "lightgrey",
  },
  bottomPush: {
    position: "absolute",
    bottom: 0,
    right: 0,
    textAlign: "center",
    marginRight: theme.spacing(2),
  },
  logo: {
    marginBottom: theme.spacing(10),
  },
});

class HomePage extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render() {
    const { classes, history } = this.props;

    const { Form } = this.props;
    return (
      <Grid container className={classes.root} component="main">
        <CssBaseline />
        <Grid align="center" item xs={false} sm={4} md={7} className={classes.image}>
          <div className={classes.footer}>
            <Typography
              className={classes.footerText}
              variant="body1"
              color="textPrimary"
              component="body1"
            >
              <span> RPL 2.0: Trabajo Profesional de Cano, Matías José y Levinas, Alejandro </span>
              <br/>
              <span> Tutor: Dr. Mendez, Mariano - Co-tutor: Lic. Camejo, Manuel </span>
              <br/>
              <span> Facultad de Ingeniería de la Universidad de Buenos Aires </span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} elevation={6} square component={Paper}>
          <div className={classes.paper}>
            <img width="30%" src={logo} alt="logo" className={classes.logo} />
            <Form history={history} />
          </div>
          <div className={classes.bottomPush}>
          <a href="https://cafecito.app/rpl" rel="noopener noreferrer" target="_blank">
            <img
              srcset="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_5.png"
              alt="Invitame un café en cafecito.app"
            />
          </a>
        </div>

        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HomePage);
