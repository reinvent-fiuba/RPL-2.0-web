// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import NotificationsIcon from '@material-ui/icons/Notifications';
import { withStyles } from "@material-ui/core/styles";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";
import Popover from '@material-ui/core/Popover';
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withRouter } from 'react-router-dom';

import notificationsService from '../../services/notificationsService';

const styles = theme => ({
  menu: {
    width: '250px',
  },
  typography: {
    padding: theme.spacing(2),
    whiteSpace: "normal",
    fontSize: 14,
  },
  notifications: {
    marginRight: theme.spacing(2)
  },
});

type Props = {
  handleCloseModal: Event => void,
  open: boolean,
  ioTest: ?IOTest,
  idx: ?number,
  courseId: number,
  activityId: number,
  classes: any,
};

type State = {
  error: { open: boolean, message: ?string },

  textIn: ?string,
  textOut: ?string,
  textInError: ?string,
  textOutError: ?string,
};

class NotificationsModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },

    // eslint-disable-next-line react/destructuring-assignment
    textIn: this.props.ioTest ? this.props.ioTest.in : "",
    // eslint-disable-next-line react/destructuring-assignment
    textOut: this.props.ioTest ? this.props.ioTest.out : "",
    textInError: null,
    textOutError: null,
  };

  componentDidMount() {
    this.loadNotifications();
  }

  loadNotifications() {
    const { courseId, userId } = this.props;
    if (courseId && userId) {
      notificationsService.get(userId, courseId).then(notifications => {
        this.setState({ notifications });
      });
    }
  }

  renderNotifications() {
    const { classes, history } = this.props;
    const { notifications } = this.state; 
    console.log('renderNotifications', this.props);
    return (notifications && !!notifications.length) ? notifications.map(notification => 
      <MenuItem
        onClick={() => history.push(notification.redirect)}
      >
        <Typography className={classes.typography}>{notification.message}</Typography>
      </MenuItem>
    ) : [
      <MenuItem>
        <Typography className={classes.typography}> No tienes notificaciones pendientes</Typography>
      </MenuItem>
    ];
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
          buttonRef={(node) => { 
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
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <MenuList className={classes.menu} autoFocusItem={open}>
            {this.renderNotifications()}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NotificationsModal));
