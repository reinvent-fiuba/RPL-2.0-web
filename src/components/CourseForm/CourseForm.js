// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { withState } from "../../utils/State";
import ErrorNotification from "../../utils/ErrorNotification";
import coursesService from "../../services/coursesService";
import usersService from "../../services/usersService";

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
  semesterFields: {
    alignItems: "center",
    justifyContent: "center",
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

class CourseForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: "" },
    name: "",
    university: "",
    universityCourseId: "",
    semester: "",
    semesterStart: Date.now(),
    semesterEnd: Date.now(),
    description: "",
    courseAdminId: "",
    users: [],
  };

  componentDidMount() {
    const course = this.props.course;
    if (course) {
      this.setState({
        name: course.name,
        university: course.university,
        universityCourseId: course.university_course_id,
        semester: course.semester,
        semesterStart: new Date(course.semester_start_date),
        semesterEnd: new Date(course.semester_end_date),
        description: course.description,
      });
    } else {
      this.loadUsers(""); // Load users only if we are creating a course
    }
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
      semesterStart,
      semesterEnd,
      description,
      courseAdminId,
    } = this.state;
    coursesService
      .create(
        name,
        university,
        universityCourseId,
        semester,
        semesterStart.toLocaleDateString("sv-SE"),
        semesterEnd.toLocaleDateString("sv-SE"),
        courseAdminId,
        description
      )
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

  handleSaveClick(event) {
    event.preventDefault();
    const {
      name,
      university,
      universityCourseId,
      semester,
      semesterStart,
      semesterEnd,
      description,
    } = this.state;
    const { course } = this.props;
    coursesService
      .edit(
        course.id,
        name,
        university,
        universityCourseId,
        semester,
        semesterStart.toLocaleDateString("sv-SE"),
        semesterEnd.toLocaleDateString("sv-SE"),
        description
      )
      .then(course => {
        this.props.context.set("course", course);
        this.props.history.push(`/courses/${course.id}/dashboard`);
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message:
              "Hubo un error al guardar el curso, revisa que los datos ingresados sean validos.",
          },
        });
      });
  }

  loadUsers(query) {
    return usersService.findUsers(query).then(users => {
      this.setState({ users });
    });
  }

  render() {
    const { classes, course } = this.props;
    const editMode = !!course;
    const { error, users } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <form noValidate className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre del Curso"
              name="name"
              autoComplete="name"
              value={this.state.name}
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
              value={this.state.university}
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
              value={this.state.universityCourseId}
              onChange={e => this.handleChange(e)}
            />
            <Grid container className={classes.semesterFields} xs={12} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="semester"
                  label="Semestre"
                  name="semester"
                  autoComplete="semester"
                  value={this.state.semester}
                  onChange={e => this.handleChange(e)}
                />
              </Grid>
              <Grid item xs={3}>
                <KeyboardDatePicker
                  label="Comienzo"
                  fullWidth
                  required
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  value={this.state.semesterStart}
                  autoComplete="semesterStart"
                  onChange={date => this.setState({ semesterStart: date })}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <KeyboardDatePicker
                  label="Fin"
                  fullWidth
                  required
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  value={this.state.semesterEnd}
                  autoComplete="semesterEnd"
                  onChange={date => this.setState({ semesterEnd: date })}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </Grid>
            {!editMode && (
              <Autocomplete
                margin="normal"
                options={users}
                id="courseAdmin"
                name="courseAdmin"
                autoComplete="courseAdmin"
                onChange={(event, newValue) => this.setState({ courseAdminId: newValue.id })}
                getOptionLabel={user => `${user.name} ${user.surname} (${user.username})`}
                renderInput={params => (
                  <TextField {...params} label="Usuario administrador" margin="normal" />
                )}
              />
            )}
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
              value={this.state.description}
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
                onClick={e => (editMode ? this.handleSaveClick(e) : this.handleCreateClick(e))}
              >
                {editMode ? "Guardar" : "Crear"}
              </Button>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default withState(withStyles(styles)(CourseForm));
