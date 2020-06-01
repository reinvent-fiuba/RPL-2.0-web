/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Snackbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

class CustomSnackbar extends React.Component {
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
        autoHideDuration={2000}
        onClose={(_, reason) => this.handleClose(_, reason)}
      >
        <Alert
          severity="success"
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
        >
          {message}
        </Alert>
      </Snackbar>
    );
  }
}

export default withStyles(styles)(CustomSnackbar);
