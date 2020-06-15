import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
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
  form: {
    marginTop: theme.spacing(1),
    padding: `0px ${theme.spacing(4)}px`,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    const { profile } = this.props;
    this.state = {
      name: profile.name,
      surname: profile.surname,
      studentId: profile.student_id,
      email: profile.email,
      degree: profile.degree,
      university: profile.university
    };
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    const { profile, classes } = this.props;

    return (
      <div>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.rightButton}
          onClick={() => this.props.onClickSave({
              name: this.state.name,
              surname: this.state.surname,
              student_id: this.state.studentId,
              email: this.state.email,
              degree: this.state.degree,
              university: this.state.university,
            })}
        >
          <SaveIcon />
        </Fab>
        <Grid container spacing={8}>
          <Grid align="center" justify="center" direction="column" container spacing={2} xs={4}>
            <Grid item>
              <Avatar className={classes.avatar}>
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
              <form className={classes.form}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="Name"
                  autoComplete="name"
                  autoFocus
                  value={this.state.name}
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
                  value={this.state.surname}
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
                  value={this.state.studentId}
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
                  value={this.state.email}
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
                  value={this.state.degree}
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
                  value={this.state.university}
                  onChange={e => this.handleChange(e)}
                />
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfileEdit));
