//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import { DropzoneArea } from "material-ui-dropzone";
import { withState } from "../../utils/State";
import cloudinaryService from "../../services/cloudinaryService";
import { validate } from "../../utils/inputValidator";
import authenticationService from "../../services/authenticationService";

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: theme.spacing(7),
  },
  avatarContainer: {
    top: "25%",
  },
  property: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(3),
  },
  paperContainer: {
    width: "100%",
    height: "100%",
  },
  form: {
    marginTop: theme.spacing(1),
    padding: `0px ${theme.spacing(4)}px`,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

type Props = {
  classes: any,
  profile: any,
  onClickSave: any,
};

class ProfileEdit extends React.Component<Props> {
  state = {
    error: { invalidFields: new Set() },
    email: "",
    name: "",
    surname: "",
    degree: "",
    studentId: "",
    university: undefined,
    universities: [],
    userImg: undefined,
  };

  componentDidMount() {
    const { profile } = this.props;

    return authenticationService.getUniversities().then(universities => {
      this.setState({
        universities,
        error: { invalidFields: new Set() },
        name: profile.name,
        surname: profile.surname,
        studentId: profile.student_id,
        email: profile.email,
        degree: profile.degree,
        university: universities.find(university => university.name === profile.university),
        userImg: undefined,
      });
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
        error: { invalidFields },
      };
    });
  }

  handleAddFile(files) {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => this.setState({ userImg: reader.result });
    reader.readAsDataURL(file);
  }

  handleClickSave() {
    const { userImg, error } = this.state;
    const { onClickSave } = this.props;

    if (error.invalidFields.size !== 0) {
      this.setState(prevState => ({
        error: {
          open: true,
          message: "El formulario cuenta con campos invalidos",
          invalidFields: prevState.error.invalidFields,
        },
      }));
      return;
    }

    const userImgPromise = userImg ? cloudinaryService.uploadFile(userImg) : Promise.resolve();

    userImgPromise.then(userImgAsset =>
      onClickSave({
        name: this.state.name,
        surname: this.state.surname,
        student_id: this.state.studentId,
        email: this.state.email,
        degree: this.state.degree,
        university: this.state.university.name,
        img_uri: userImgAsset && userImgAsset.url,
      })
    );
  }

  canEditProfile() {
    const { error } = this.state;
    return error.invalidFields.size === 0 && this.state.university !== undefined;
  }

  render() {
    const { profile, classes } = this.props;
    const { error, universities, university, degree } = this.state;

    return (
      <div>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.rightButton}
          disabled={!this.canEditProfile()}
          onClick={() => this.handleClickSave()}
        >
          <SaveIcon />
        </Fab>
        <Grid container spacing={8}>
          <Grid align="center" justify="center" direction="column" container spacing={2} xs={4}>
            <Grid item>
              <DropzoneArea
                filesLimit={1}
                acceptedFiles={["image/*"]}
                dropzoneText="Arrastra una imagen de perfil"
                onChange={files => this.handleAddFile(files)}
              />
            </Grid>
            <Grid item>
              <Typography style={{ fontStyle: "italic" }} className={classes.property} variant="h6">
                {`Usuario: ${profile.username}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paperContainer}>
              <form className={classes.form}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  name="Nombre"
                  autoComplete="name"
                  autoFocus
                  value={this.state.name}
                  error={error.invalidFields.has("name")}
                  helperText={
                    error.invalidFields.has("name") && "El nombre debe estar formado por letras"
                  }
                  onChange={e =>
                    this.handleChange(e, validate(e.target.value, /^[A-zÀ-ÿ\s]+$/, "string"))
                  }
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="surname"
                  label="Apellido"
                  name="Apellido"
                  autoComplete="surname"
                  autoFocus
                  value={this.state.surname}
                  error={error.invalidFields.has("surname")}
                  helperText={
                    error.invalidFields.has("surname") &&
                    "El apellido debe estar formado por letras"
                  }
                  onChange={e =>
                    this.handleChange(e, validate(e.target.value, /^[A-zÀ-ÿ\s]+$/, "string"))
                  }
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="studentId"
                  label="Padrón"
                  name="Padrón"
                  autoComplete="studentId"
                  autoFocus
                  value={this.state.studentId}
                  error={error.invalidFields.has("studentId")}
                  helperText={
                    error.invalidFields.has("studentId") &&
                    "El padron debe estar formado por numeros"
                  }
                  onChange={e =>
                    this.handleChange(e, validate(e.target.value, /^[0-9a-zA-Z]+$/, "string"))
                  }
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="Email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                  error={error.invalidFields.has("email")}
                  helperText={
                    error.invalidFields.has("email") && "El email debe ser un email valido"
                  }
                  onChange={e =>
                    this.handleChange(e, validate(e.target.value, /^\S+@\S+\.\S+$/, "string"))
                  }
                />
                <Autocomplete
                  margin="normal"
                  options={universities}
                  id="university"
                  name="Universidad"
                  label="Universidad"
                  autoComplete="university"
                  value={university || {}}
                  onChange={(event, newValue) => this.setState({ university: newValue })}
                  getOptionLabel={uni => uni.name}
                  renderInput={params => (
                    <TextField {...params} label="Universidad" margin="normal" />
                  )}
                />
                <Autocomplete
                  margin="normal"
                  options={university ? university.degrees : []}
                  value={degree}
                  id="degree"
                  name="degree"
                  autoComplete="degree"
                  onChange={(event, newValue) => this.setState({ degree: newValue })}
                  renderInput={params => <TextField {...params} label="Carrera" margin="normal" />}
                />
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withState(withStyles(styles)(ProfileEdit));
