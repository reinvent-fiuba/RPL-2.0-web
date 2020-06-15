import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import authenticationServer from "../../services/authenticationService";
import ProfileView from "./ProfileView";

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
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
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

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, context, history } = this.props;

    const profile = this.state.profile || context.profile;

    return (
      <div>
        <TopBar
          handleDrawerOpen={this.handleDrawerOpen}
          open={this.state.open}
          title="Crear Curso"
        />
        <SideBar handleDrawerClose={this.handleDrawerClose} open={this.state.open} />
        <main className={`${classes.content} ${this.state.open ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <div className={classes.form}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.rightButton}
              onClick={() => this.handleCreateCourseClick()}
            >
              <EditIcon />
            </Fab>
            <ProfileView profile={profile}/>
          </div>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfilePage));
