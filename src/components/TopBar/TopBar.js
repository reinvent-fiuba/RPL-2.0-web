import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import LockIcon from "@material-ui/icons/Lock";
import { withRouter } from "react-router-dom";
import { withState } from "../../utils/State";
import NotificationsButton from "../SideBar/NotificationsButton";

const drawerWidth = 240;
const barHeight = 64;

const styles = theme => ({
  appBar: {
    height: barHeight,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  user: {
    marginRight: theme.spacing(2),
  },
  adminIcon: {
    marginRight: theme.spacing(2),
  },
});

class TopBar extends React.PureComponent {
  state = {
    isNotificationModalOpen: false,
  };

  handleCloseNotificationModal() {
    this.setState({ isNotificationModalOpen: false });
  }

  render() {
    const {
      open,
      title,
      handleDrawerOpen,
      context,
      classes,
      refreshNotifications,
      match,
    } = this.props;
    if (!context.profile) return <div />;
    const { name, surname, is_admin, img_uri } = context && context.profile;
    const { courseId } = match.params;
    const courseName = context.course && courseId === context.course.id && context.course.name;
    const { isNotificationModalOpen } = this.state;

    return (
      <AppBar
        position="fixed"
        elevation={0}
        className={`${classes.appBar} ${open ? classes.appBarShift : ""}`}
      >
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
            {courseId && courseName ? `${title} - ${courseName}` : title}
          </Typography>
          <NotificationsButton
            open={isNotificationModalOpen}
            refresh={refreshNotifications}
            handleClose={e => this.handleCloseNotificationModal(e)}
            onClick={() => this.setState({ isNotificationModalOpen: !isNotificationModalOpen })}
          />
          <Typography variant="body1" className={classes.user}>
            {`${name} ${surname}`}
          </Typography>
          <div className={classes.adminIcon}>{is_admin ? <LockIcon /> : <div />}</div>
          <Avatar src={img_uri}>
            {name[0]}
            {surname[0]}
          </Avatar>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withState(withStyles(styles)(TopBar)));
