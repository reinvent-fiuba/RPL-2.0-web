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
import type { IOTest } from "../../types";

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
  handleCloseModal: Event => void,
  open: boolean,
  courseId: number,
  activityId: number,
  classes: any,
};

type State = {
  error: { open: boolean, message: ?string },

  name: ?string,
  description: ?string,
};

class CreateActivityCategoryModal extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    name: null,
    description: null,
  };

  handleSubmit(e) {
    const { courseId, handleCloseModal } = this.props;
    const { name, description } = this.state;
    if (!name) {
      return this.setState({ error: { open: true, message: "No puede estar en blanco" } });
    }

    activitiesService
      .createActivityCategories(courseId, name, description)
      .then(() => {
        handleCloseModal(e);
      })
      .catch(() => {
        // console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al crear el test, Por favor reintenta",
          },
        });
      });
  }

  handleChange(event) {
    event.persist();
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  render() {
    const { classes, open, handleCloseModal } = this.props;
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
          <DialogTitle id="scroll-dialog-title">Nueva Categoría</DialogTitle>

          <DialogContent dividers>
            <div>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                autoComplete="name"
                onChange={e => this.handleChange(e)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={5}
                name="description"
                label="Descripcion de la Categoría"
                type="description"
                id="description"
                autoComplete="description"
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
              <Button onClick={e => this.handleSubmit(e)} color="primary">
                Crear
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CreateActivityCategoryModal);
