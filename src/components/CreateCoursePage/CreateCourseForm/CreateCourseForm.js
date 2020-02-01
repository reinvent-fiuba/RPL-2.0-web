// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../../utils/State";
import ErrorNotification from "../../../utils/ErrorNotification";
import coursesService from "../../../services/coursesService";

const styles = theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(40),
    marginRight: theme.spacing(40),
    padding: `0px ${theme.spacing(4)}px`,
  },
  cancelButton: {
    display: "flex",
    marginRight: theme.spacing(2),
    marginLeft: "auto",
    marginTop: theme.spacing(3),
  },
  createButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(44),
    marginTop: theme.spacing(3),
  },
});

type Props = {
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  name: string,
  university: string,
  universityCourseId: string,
  semester: string,
  description: string,
};

class CreateCourseForm extends React.Component<Props, State> {
  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: "" } });
  }

  handleCancelClick(event) {
    event.preventDefault();
    this.props.history.push("/courses");
  }

  handleCreateClick(event) {
    event.preventDefault();
    const { name, university, universityCourseId, semester, description } = this.state;
    coursesService
      .create({
        name,
        university,
        universityCourseId,
        semester,
        description,
      })
      .then(() => {
        this.props.history.push("/courses");
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message:
              "Hubo un error al crear el curso, revisa que los datos ingresados sean validos.",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;

    const { error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre del Curso"
            name="name"
            autoComplete="name"
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="university"
            label="Universidad"
            type="university"
            id="university"
            autoComplete="university"
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="universityCourseId"
            label="Id del Curso"
            name="universityCourseId"
            autoComplete="universityCourseId"
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="semester"
            label="Semestre"
            name="semester"
            autoComplete="semester"
            onChange={e => this.handleChange(e)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={5}
            name="description"
            label="Descripcion del Curso"
            type="description"
            id="description"
            autoComplete="description"
            onChange={e => this.handleChange(e)}
            variant="outlined"
          />
        </form>
        <Grid container>
          <Grid item xs>
            <Button
              variant="contained"
              color="secondary"
              className={classes.cancelButton}
              onClick={e => this.handleCancelClick(e)}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.createButton}
              onClick={e => this.handleCreateClick(e)}
            >
              Crear
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CreateCourseForm));
