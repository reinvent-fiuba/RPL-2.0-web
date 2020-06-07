// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { fade, withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withState } from "../../../utils/State";
import ErrorNotification from "../../../utils/ErrorNotification";
import coursesService from "../../../services/coursesService";
import authenticationService from "../../../services/authenticationService";


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
  courseAdminId: string,
};

class CreateCourseForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: "" },
    name: "",
    university: "",
    universityCourseId: "",
    semester: "",
    description: "",
    courseAdminId: "",
    users: [],
  };

  componentDidMount() {
    this.loadUsers("");
  }

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
    const {
      name,
      university,
      universityCourseId,
      semester,
      description,
      courseAdminId,
    } = this.state;
    coursesService
      .create(name, university, universityCourseId, semester, courseAdminId, description)
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

  loadUsers(query) {
    authenticationService.findUsers(query).then(users => {
      this.setState({ users });
    });
  }

  render() {
    const { classes } = this.props;

    const { error, users } = this.state;

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
          <Autocomplete
            margin="normal"
            options={users}
            id="courseAdmin"
            name="courseAdmin"
            autoComplete="courseAdmin"
            onChange={(event, newValue) => this.setState({ courseAdminId: newValue.id })}
            getOptionLabel={user => `${user.name} ${user.surname} (${user.username})`}
            renderInput={params => (
              <TextField
                {...params}
                label="Usuario administrador"
                margin="normal"
              />
            )}
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
