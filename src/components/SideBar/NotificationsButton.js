// @flow
import React from "react";
import Typography from "@material-ui/core/Typography";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withRouter } from "react-router-dom";
import ErrorNotification from "../../utils/ErrorNotification";
import { withState } from "../../utils/State";

import notificationsService from "../../services/notificationsService";

const styles = theme => ({
  menu: {
    width: "250px",
  },
  typography: {
    padding: theme.spacing(2),
    whiteSpace: "normal",
    fontSize: 14,
  },
  notifications: {
    marginRight: theme.spacing(2),
  },
});

type Props = {
  classes: any,
  history: any,
  context: any,
  match: any,
  open: boolean,
  refresh: boolean,
  handleClose: (event: Event) => any,
  onClick: (event: Event) => any,
};

type State = {
  error: { open: boolean, message: ?string },
};

class NotificationsButton extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
  };

  componentDidMount() {
    this.loadNotifications();
  }

  componentDidUpdate(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    const { profile, permissions } = this.props.context;
    const userId = profile.id;
    const { courseId } = this.props.match.params;

    if (courseId && userId) {
      const options = {
        studentsNotifications: permissions && permissions.includes("user_manage"),
      };

      notificationsService.get(userId, courseId, options).then(notifications => {
        this.setState({ notifications });
      });
    }
  }

  renderNotifications() {
    const { classes, history } = this.props;
    const { notifications } = this.state;

    if (!notifications || !notifications.length) {
      return [
        <MenuItem>
          <Typography className={classes.typography}>
            No tienes notificaciones pendientes
          </Typography>
        </MenuItem>,
      ];
    }

    return notifications.map(notification => (
      <MenuItem onClick={() => history.push(notification.redirect)}>
        <Typography className={classes.typography}>{notification.message}</Typography>
      </MenuItem>
    ));
  }

  render() {
    const { classes, open, handleClose, onClick } = this.props;
    const { error, notifications } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <IconButton
          className={classes.notifications}
          component="span"
          onClick={onClick}
          buttonRef={node => {
            this.notificationRef = node;
          }}
        >
          <Badge color="secondary" badgeContent={notifications && notifications.length}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          onClose={e => {
            handleClose(e);
          }}
          anchorEl={this.notificationRef}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuList className={classes.menu} autoFocusItem={open}>
            {this.renderNotifications()}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

export default withRouter(withState(withStyles(styles)(NotificationsButton)));
