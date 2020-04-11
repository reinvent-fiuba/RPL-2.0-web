import React from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SchoolIcon from "@material-ui/icons/School";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import { withState } from "../../utils/State";
import NotificationsButton from "../SideBar/NotificationsButton";
import { withRouter } from 'react-router-dom';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  user: {
    marginRight: theme.spacing(2)
  }
});

class TopBar extends React.PureComponent {
  state = {
    isNotificationModalOpen: false,
  };

  handleCloseNotificationModal(){
    this.setState({ isNotificationModalOpen: false })
  }

  render() {
    const { open, title, handleDrawerOpen, context, classes, refreshNotifications } = this.props;
    const { name, surname } = context && context.profile;
    const { isNotificationModalOpen } = this.state;

    return (
      <AppBar position="fixed" className={`${classes.appBar} ${open ? classes.appBarShift : ""}`}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={`${classes.menuButton} ${open ? classes.hide : ""}`}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>
            {title}
          </Typography>
          <NotificationsButton
            open={isNotificationModalOpen}
            refresh={refreshNotifications}
            handleClose={e => this.handleCloseNotificationModal(e)}
            onClick={() => this.setState({ isNotificationModalOpen: !isNotificationModalOpen })}
          />
          <Typography variant="body1" className={classes.user}>
            {name} {surname}
          </Typography>
          <Avatar>
            {name[0]}
            {surname[0]}
          </Avatar>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withState(withStyles(styles)(TopBar)));
