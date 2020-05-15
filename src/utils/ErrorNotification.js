import React from "react";
import { Snackbar } from "@material-ui/core";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
});

class ErrorNotifier extends React.Component {
  state = { open: true };

  handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  }

  render() {
    const { classes, message, horizontalPosition } = this.props;

    const { open } = this.state;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: horizontalPosition || "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={(_, reason) => this.handleClose(_, reason)}
      >
        <SnackbarContent
          // aria-describedby="client-snackbar"
          className={classes.error}
          message={(
            <span id="client-snackbar" className={classes.message}>
              <ErrorIcon className={`${classes.icon} ${classes.iconVariant}`} />
              {message}
            </span>
          )}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={(_, reason) => this.handleClose(_, reason)}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

export default withStyles(styles)(ErrorNotifier);
