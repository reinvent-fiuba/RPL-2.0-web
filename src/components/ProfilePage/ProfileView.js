import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import { withState } from "../../utils/State";

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  form: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(40),
    marginRight: theme.spacing(40),
    padding: `0px ${theme.spacing(4)}px`,
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: theme.spacing(7),
  },
  avatarContainer: {
    top: "25%",
  },
  property: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(3),
  },
  paperContainer: {
    width: "100%",
    height: "100%",
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { profile, classes } = this.props;
    return (
      <div>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.rightButton}
          onClick={() => this.props.onClickEdit()}
        >
          <EditIcon />
        </Fab>
        <Grid container spacing={8}>
          <Grid align="center" justify="center" direction="column" container spacing={2} xs={4}>
            <Grid item>
              <Avatar src={profile.img_uri} className={classes.avatar}>
                {profile.name[0]}
                {profile.surname[0]}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography style={{fontStyle: "italic"}} className={classes.property} variant="h6">
                {`Usuario: ${profile.username}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paperContainer}>
              <Typography className={classes.property} variant="h6">{`Nombre: ${profile.name}`}</Typography>
              <Typography className={classes.property} variant="h6">{`Apellido: ${profile.surname}`}</Typography>
              <Typography className={classes.property} variant="h6">{`Id de Universidad: ${profile.student_id}`}</Typography>
              <Typography className={classes.property} variant="h6">{`Email: ${profile.email}`}</Typography>
              <Typography className={classes.property} variant="h6">{`Universidad: ${profile.university}`}</Typography>
              <Typography className={classes.property} variant="h6">{`Carrera: ${profile.degree}`}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfileView));
