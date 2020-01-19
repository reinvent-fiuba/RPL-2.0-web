import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withState } from '../../../utils/State';
import { withErrorHandling } from '../../../utils/Error';
import ErrorNotification from '../../../utils/ErrorNotification';
import coursesService from '../../../services/coursesService';

const _ = require('lodash');

const styles = (theme) => ({
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
    display: 'flex',
    marginRight: theme.spacing(2),
    marginLeft: 'auto',
    marginTop: theme.spacing(3),
  },
  createButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(44),
    marginTop: theme.spacing(3),
  },
});

class CreateCourseForm extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);

    this.state = {
      username: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
  }

  handleChange(event) {
    event.persist();
    // Close error message
    this.setState({ [event.target.id]: event.target.value, error: { open: false, message: '' } });
  }

  handleCancelClick() {
    this.setState({ toCoursesPage: true });
  }

  handleCreateClick() {
    event.preventDefault();
    coursesService.create({
      name: this.state.name,
      university: this.state.university,
      universityCourseId: this.state.universityCourseId,
      semester: this.state.semester,
      description: this.state.description,
    }).then((response) => {
      this.setState({ toCoursesPage: true });
    }).catch((err) => {
      this.setState({ error: { open: true, message: 'Hubo un error al crear el curso, revisa que los datos ingresados sean validos.' } });
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.toCoursesPage) {
      return <Redirect to="/courses" />;
    }

    return (
      <div>
        <ErrorNotification open={_.get(this.state, 'error.open')} message={_.get(this.state, 'error.message')} />
        <form noValidate className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre del Curso"
            name="name"
            autoComplete="name"
            onChange={this.handleChange}
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
            onChange={this.handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="universityCourseId"
            label="Id del Curso"
            name="universityCourseId"
            autoComplete="universityCourseId"
            onChange={this.handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="semester"
            label="Semestre"
            name="semester"
            autoComplete="semester"
            onChange={this.handleChange}
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
            onChange={this.handleChange}
            variant="outlined"
          />
        </form>
        <Grid container>
          <Grid item xs>
            <Button
              variant="contained"
              color="secondary"
              className={classes.cancelButton}
              onClick={this.handleCancelClick}
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
              onClick={this.handleCreateClick}
            >
              Crear
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withErrorHandling(withState(withStyles(styles)(CreateCourseForm)));
