// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import notificationsService from '../../services/notificationsService';

const styles = theme => ({
  popover: {
    width: '250px',
  },
  typography: {
    padding: theme.spacing(2),
    whiteSpace: "normal",
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
      notificationsService.get(1, 1).then(notifications => {
        this.setState({ notifications });
      });
    }
  }

  renderNotifications() {
    const { classes } = this.props;
    const { notifications } = this.state; 
    return notifications ? notifications.map(notification => 
      <MenuItem>
        <Typography className={classes.typography}>{notification.message}</Typography>
      </MenuItem>
    ) : [];
  }

  render() {
    const { classes, open, handleClose, notificationRef } = this.props;
    const { error, } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <Popover
          className={classes.popover} 
          open={open}
          onClose={e => { 
            handleClose(e);
          }}
          anchorEl={notificationRef}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <MenuList className={classes.popover} autoFocusItem={open} id="menu-list-grow" >
            {this.renderNotifications()}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(NotificationsModal);
