// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";

const styles = () => ({
  modal: {
    minHeight: "200px",
  },
  circularProgress: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

type Props = {
  handleCloseModal: number => void,
  handleClickSave: any => void,
  open: boolean,
  courseId: number,
  activityCategory: any,
  classes: any,
  saveButtonText: string,
  titleText: string,
};

type State = {
  error: { open: boolean, message: ?string },

  name: ?string,
  description: ?string,
};

class ActivityCategoryModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    name: this.props.activityCategory ? this.props.activityCategory.name : null,
    description: this.props.activityCategory ? this.props.activityCategory.description : null,
  };

  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  render() {
    const {
      classes,
      open,
      handleCloseModal,
      handleClickSave,
      titleText,
      saveButtonText,
      activityCategory,
    } = this.props;
    const { error, name, description } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <Dialog
          open={open}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          className={classes.modal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="scroll-dialog-title">{titleText || "Nueva categoría"}</DialogTitle>

          <DialogContent dividers>
            <div>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                value={name}
                autoFocus
                onChange={e => this.handleChange(e)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={5}
                name="description"
                value={description}
                label="Descripcion de la Categoría"
                type="description"
                id="description"
                onChange={e => this.handleChange(e)}
                variant="outlined"
              />
            </div>
            <DialogActions>
              <Button
                onClick={e => {
                  this.setState({ name: null, description: null });
                  handleCloseModal(e);
                }}
                color="primary"
              >
                Cancelar
              </Button>
              <Button
                onClick={e =>
                  handleClickSave({
                    id: activityCategory && activityCategory.id,
                    name,
                    description,
                  })
                }
                color="primary"
              >
                {saveButtonText || "Guardar"}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityCategoryModal);
