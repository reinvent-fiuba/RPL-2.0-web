import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import { withState } from '../../utils/State';
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab"
import { Redirect } from 'react-router-dom';

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    marginTop: 20,
    marginBottom: 20
  },
  divider: {
    margin: 20
  },
  rightButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  }
});

class ActivitiesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.createData = this.createData.bind(this);
    this.renderCategoriyActivities = this.renderCategoriyActivities.bind(this);
    const { profile } = this.props.context;

    console.log(props.match.params.courseId);
  }

  handleAddClick() {
    this.setState({ toCreateActivitiePage: true });
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  renderCategoriyActivities(activities, classes) {
    return <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell align="right">Última actividad</TableCell>
            <TableCell align="right">Puntos</TableCell>
            <TableCell align="right">Estado</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  }



  render() {
    const { classes } = this.props;

    const categoryActivities = [
      this.createData('Ejercicio 1', "Apr 24 2020", 15, "Completado", "Descargar"),
      this.createData('Ejercicio 2', "-", 15, "-", "Descargar"),
      this.createData('Ejercicio 3', "Apr 24 2020", 15, "Completado", "Descargar"),
      this.createData('Ejercicio 4', "Apr 24 2020", 15, "Corriendo", "Descargar"),
      this.createData('Ejercicio 5', "Apr 24 2020", 15, "Completado", "Descargar"),
    ];

    const categories = ["Conceptos básicos", "Conceptos no tan básicos"]

    if (this.state.toCreateActivitiePage) {
      return <Redirect to="/activities/create" />
    }

    return ([
      <TopBar handleDrawerOpen={this.handleDrawerOpen} open={this.state.open} title='Actividades'></TopBar>,
      <SideBar handleDrawerClose={this.handleDrawerClose} open={this.state.open}></SideBar>,
      <main
        className={`${classes.content} ${this.state.open ? classes.contentShift : ''}`}
      >
        <div className={classes.drawerHeader} />
        <Fab
          color="primary"
          aria-label="add"
          className={classes.rightButton}
          onClick={this.handleAddClick}
        >
          <AddIcon />
        </Fab>


        {categories.map(categorie =>
          <div>
            <Typography variant="h5" color="textSecondary" component="p" className={classes.title}>
              {categorie}
            </Typography>
            {this.renderCategoriyActivities(categoryActivities, classes)}
          </div>
        )}
      </main>
    ]);
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
