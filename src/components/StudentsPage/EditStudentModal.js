// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
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
      .createActivityCategories(courseId, name, description || "")
      .then(category => {
        handleCloseModal(category.id);
      })
      .catch(() => {
        // console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al crear la categoría, Por favor reintenta",
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
    console.log(this.props.student);
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
          <DialogTitle id="scroll-dialog-title">Editar Alumno</DialogTitle>

          <DialogContent dividers>
            <form noValidate className={classes.form}>
              <Typography variant="h6">
                {`Alumno: ${this.props.student.name} ${this.props.student.username}`}
              </Typography>
              <Typography variant="h6">
                {`Padron: ${this.props.student.student_id}`}
              </Typography>
              <Typography variant="body1" color="textSecondary" component="p">
                {this.props.student.username}
              </Typography>
              <Autocomplete
                margin="normal"
                options={this.props.roles}
                // id="courseAdmin"
                // name="courseAdmin"
                // autoComplete="courseAdmin"
                // onChange={(event, newValue) => this.setState({ courseAdminId: newValue.id })}
                getOptionLabel={role => role.name}
                renderInput={params => (
                  <TextField {...params} label="Usuario administrador" margin="normal" />
                )}
              />
            </form>
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
