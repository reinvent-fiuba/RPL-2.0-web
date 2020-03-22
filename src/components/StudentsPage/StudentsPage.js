// @flow
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import Avatar from "@material-ui/core/Avatar";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import coursesService from "../../services/coursesService";
import ErrorNotification from "../../utils/ErrorNotification";

import type { Student } from "../../types";

const _ = require("lodash");

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
  title: {
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    margin: 20,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "80%",
  },
  tableContainerDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 30px 30px 30px",
  },
  tableTitle: {
    alignSelf: "start",
    paddingLeft: "15px",
  },
  tableAvatarColumn: {
    width: theme.spacing(5),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "0.75rem",
  },
  status: {
    height: theme.spacing(1.5),
    width: theme.spacing(1.5),
    borderRadius: "50%",
    display: "inline-block",
  },
  activeStatus: {
    backgroundColor: theme.palette.success.main,
  },
  inactiveStatus: {
    backgroundColor: theme.palette.error.main,
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  students: Array<Activity>,
};

class StudentsPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    students: [],
  };

  componentDidMount() {
    const { match } = this.props;
    coursesService
      .getAllStudentsByCourseId(match.params.courseId)
      .then(response => {
        this.setState({ students: response });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener las actividades, Por favor reintenta",
          },
        });
      });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  // eslint-disable-next-line class-methods-use-this
  renderStudents(students: Array<Student>, classes: any) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={0}>
              <TableCell key={1} className={classes.tableAvatarColumn} />
              <TableCell key={2}>Alumno</TableCell>
              <TableCell key={3} align="right">
                Email
              </TableCell>
              <TableCell key={4} align="right">
                Id
              </TableCell>
              <TableCell key={5} align="right">
                Rol
              </TableCell>
              <TableCell key={6} align="right">
                Activo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow hover key={student.student_id}>
                <TableCell key={1} component="th" scope="row">
                  <Avatar className={classes.avatar}>
                    {student.name[0]}
                    {student.surname[0]}
                  </Avatar>
                </TableCell>
                <TableCell key={2} component="th" scope="row">
                  {`${student.name} ${student.surname}`}
                </TableCell>
                <TableCell key={3} align="right">
                  {student.email}
                </TableCell>
                <TableCell key={4} align="right">
                  {student.student_id}
                </TableCell>
                <TableCell key={5} align="right">
                  {student.role}
                </TableCell>
                <TableCell key={6} align="right">
                  <span
                    className={`${classes.status} ${
                      student.accepted ? classes.activeStatus : classes.inactiveStatus
                    }`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes, match } = this.props;

    const { students, isSideBarOpen, error } = this.state;
    const { profile } = this.props.context;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Inscriptos"
          courseId={match.params.courseId}
          userId={profile.id}
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          courseId={match.params.courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <div className={classes.tableContainerDiv}>
            {students && this.renderStudents(students, classes)}
          </div>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(StudentsPage));
