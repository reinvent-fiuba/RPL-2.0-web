// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { DropzoneArea } from "material-ui-dropzone";
import { withState } from "../../utils/State";
import ErrorNotification from "../../utils/ErrorNotification";
import coursesService from "../../services/coursesService";
import usersService from "../../services/usersService";
import cloudinaryService from "../../services/cloudinaryService";
import { validate } from "../../utils/inputValidator";
import authenticationService from "../../services/authenticationService";

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
  course: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  name: string,
  university: any,
  universityCourseId: string,
  semester: string,
  description: string,
  courseAdminId: string,
  semesterEnd: Date,
  semesterStart: Date,
  users: Array<any>,
  imgUri: string,
  universities: Array<any>,
};

class CourseForm extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null, invalidFields: new Set() },
    name: "",
    university: undefined,
    universityCourseId: "",
    semester: "",
    semesterStart: new Date(),
    semesterEnd: new Date(),
    description: "",
    courseAdminId: "",
    courseImg: undefined,
    imgUri: "",
    users: [],
    universities: [],
  };

  componentDidMount() {
    const { course } = this.props;
    authenticationService.getUniversities().then(universities => {
      this.setState({ universities });
      if (!course) {
        return this.loadUsers("");
      }

      this.setState({
        name: course.name,
        university: universities.find(university => university.name === course.university),
        universityCourseId: course.university_course_id,
        semester: course.semester,
        semesterStart: new Date(course.semester_start_date),
        semesterEnd: new Date(course.semester_end_date),
        imgUri: course.img_uri,
        description: course.description,
      });
    });
  }

  loadUsers(query) {
    return usersService.findUsers(query).then(users => {
      this.setState({ users });
    });
  }

  handleChange(event, valid) {
    event.persist();
    // Close error message
    this.setState(prevState => {
      const { invalidFields } = prevState.error;
      if (valid && invalidFields.has(event.target.id)) {
        invalidFields.delete(event.target.id);
      } else if (!valid) {
        invalidFields.add(event.target.id);
      }
      return {
        [event.target.id]: event.target.value,
        error: { open: false, message: "", invalidFields },
      };
    });
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
      courseImg,
      imgUri,
      error,
    } = this.state;

    if (error.invalidFields.size !== 0 || !university) {
      this.setState(prevState => ({
        error: {
          open: true,
          message: "El formulario cuenta con campos invalidos",
          invalidFields: prevState.error.invalidFields,
        },
      }));
      return;
    }

    const courseImgPromise = courseImg
      ? cloudinaryService.uploadFile(courseImg)
      : Promise.resolve();

    courseImgPromise
      .then(courseImgAsset => {
        return coursesService.create(
          name,
          university.name,
          universityCourseId,
          semester,
          semesterStart.toLocaleDateString("sv-SE"),
          semesterEnd.toLocaleDateString("sv-SE"),
          courseAdminId,
          description,
          (courseImgAsset && courseImgAsset.url) || imgUri
        );
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
      courseImg,
      imgUri,
    } = this.state;
    const { course } = this.props;
    const courseImgPromise = courseImg
      ? cloudinaryService.uploadFile(courseImg)
      : Promise.resolve();

    courseImgPromise
      .then(courseImgAsset => {
        return coursesService.edit(
          course.id,
          name,
          university.name,
          universityCourseId,
          semester,
          semesterStart.toLocaleDateString("sv-SE"),
          semesterEnd.toLocaleDateString("sv-SE"),
          description,
          (courseImgAsset && courseImgAsset.url) || imgUri
        );
      })
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

  handleAddFile(files) {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => this.setState({ courseImg: reader.result });
    reader.readAsDataURL(file);
  }

  canSaveCourse() {
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
    const { course } = this.props;
    const editMode = !!course;

    if (
      !name ||
      !university ||
      !universityCourseId ||
      !semester ||
      !semesterStart ||
      !semesterEnd ||
      !description ||
      (!editMode && !courseAdminId)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { classes, course } = this.props;
    const editMode = !!course;
    const { error, users, university, universities } = this.state;

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
              error={error.invalidFields.has("name")}
              helperText={
                error.invalidFields.has("name") &&
                "El nombre del curso estar formado por letras y numeros"
              }
              onChange={e =>
                this.handleChange(e, validate(e.target.value, /^[0-9A-zÀ-ÿ\s]+$/, "string"))
              }
            />
            <Autocomplete
              margin="normal"
              options={universities}
              id="university"
              name="university"
              autoComplete="university"
              value={university || {}}
              onChange={(event, newValue) => this.setState({ university: newValue })}
              getOptionLabel={uni => uni.name || ""}
              renderInput={params => <TextField {...params} label="Universidad" margin="normal" />}
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
              error={error.invalidFields.has("universityCourseId")}
              helperText={
                error.invalidFields.has("universityCourseId") &&
                "El Id del Curso debe estar formada por letras, numeros, guiones (_ ó -) o puntos (.)"
              }
              onChange={e =>
                this.handleChange(e, validate(e.target.value, /^[0-9a-zA-Z_.-]+$/, "string"))
              }
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
                  error={error.invalidFields.has("semester")}
                  helperText={
                    error.invalidFields.has("semester") &&
                    "El semestre debe estar formada por letras, numeros, guiones (_ ó -) o puntos (.)"
                  }
                  onChange={e =>
                    this.handleChange(e, validate(e.target.value, /^[0-9a-zA-Z_-]+$/, "string"))
                  }
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
                    "aria-label": "change date",
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
                    "aria-label": "change date",
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
              onChange={e => this.handleChange(e, true)}
              variant="outlined"
            />
            <DropzoneArea
              filesLimit={1}
              acceptedFiles={["image/*"]}
              dropzoneText="Arrastra una imagen para el curso"
              onChange={files => this.handleAddFile(files)}
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
                disabled={!this.canSaveCourse()}
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
