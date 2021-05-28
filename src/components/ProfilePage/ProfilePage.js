import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import authenticationServer from "../../services/authenticationService";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

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
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  componentDidMount() {
    this.loadProfile();
  }

  loadProfile() {
    authenticationServer
      .getProfile()
      .then(response => {
        this.setState({ profile: response });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener el perfil, Por favor reintenta",
          },
        });
      });
  }

  handleClickEdit() {
    this.setState({ editMode: true });
  }

  handleClickSave(profileData) {
    authenticationServer.updateProfile(profileData).then(response => {
      this.props.context.set("profile", response);
      this.setState({ profile: response, editMode: false });
    });
  }

  render() {
    const { classes, context, history } = this.props;
    const { editMode } = this.state;
    const profile = this.state.profile || context.profile;

    return (
      <div>
        <main className={`${classes.content} ${this.state.open ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <div className={classes.form}>
            {editMode ? (
              <ProfileEdit onClickSave={this.handleClickSave} profile={profile} />
            ) : (
              <ProfileView onClickEdit={this.handleClickEdit} profile={profile} />
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfilePage));
