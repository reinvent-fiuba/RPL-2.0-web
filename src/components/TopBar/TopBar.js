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
import Badge from '@material-ui/core/Badge';
import { withState } from "../../utils/State";
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsModal from "../SideBar/NotificationsModal";
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
    error: { open: false, message: null },
    isNotificationModalOpen: false,
    notificationRef: null,
  };

  handleCloseNotificationModal(){
    this.setState({ isNotificationModalOpen: false })
  }

  render() {
    console.log('TopBar', this.props);
    const { open, title, handleDrawerOpen, context, classes } = this.props;
    const { name, surname } = context && context.profile;

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
          <NotificationsModal
            open={this.state.isNotificationModalOpen}
            handleClose={e => this.handleCloseNotificationModal(e)}
            notificationRef={this.notificationRef}
            userId={this.props.userId}
            courseId={this.props.courseId}
            onClick={() => this.setState({ isNotificationModalOpen: !this.state.isNotificationModalOpen })}
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
