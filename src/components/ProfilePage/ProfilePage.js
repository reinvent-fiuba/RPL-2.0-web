import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import authenticationServer from "../../services/authenticationService";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

const styles = theme => ({
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
        <div className={classes.form}>
          {editMode ? (
            <ProfileEdit onClickSave={this.handleClickSave} profile={profile} />
          ) : (
            <ProfileView onClickEdit={this.handleClickEdit} profile={profile} />
          )}
        </div>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfilePage));
