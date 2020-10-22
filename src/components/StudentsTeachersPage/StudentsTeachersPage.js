// @flow
import React from "react";
import Table from "@material-ui/core/Table";
import Avatar from "@material-ui/core/Avatar";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { withState } from "../../utils/State";
import coursesService from "../../services/coursesService";
import authenticationService from "../../services/authenticationService";
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
    marginBottom: theme.spacing(2),
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
  tableIconsColumn: {
    width: theme.spacing(20),
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
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  isSideBarOpen: boolean,
  students: Array<Student>,
  teachers: Array<Student>,
  refreshStudentsNotification: boolean,
};

class StudentsTeachersPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    isSideBarOpen: false,
    students: [],
    teachers: [],
    refreshStudentsNotification: false,
    editMode: false,
    currentUserId: "",
    currentUserRole: undefined,
    roles: [],
  };

  componentDidMount() {
    this.loadStudents();
    this.loadRoles();
  }

  loadStudents() {
    const { match } = this.props;
    coursesService
      .getAllStudentsAndTeachersByCourseId(match.params.courseId)
      .then(response => {
        const students = response.filter(user => user.role === "student");
        const teachers = response.filter(user => user.role === "admin");
        this.setState({ students, teachers });
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

  loadRoles() {
    authenticationService.getRoles().then(roles => {
      this.setState({ roles });
    });
  }

  handleSwitchDrawer(event: any) {
    this.setState(prevState => ({ isSideBarOpen: !prevState.isSideBarOpen }));
  }

  handleAcceptStudent(courseId: number, userId: number, event: any) {
    coursesService
      .acceptStudent(courseId, userId)
      .then(() => this.loadStudents())
      .then(() =>
        this.setState(prevState => ({
          refreshStudentsNotification: !prevState.refreshStudentsNotification,
        }))
      );
  }

  handleDeleteStudent(courseId: Number, userId: number, event: any) {
    coursesService
      .deleteStudent(courseId, userId)
      .then(() => this.loadStudents())
      .then(() =>
        this.setState(prevState => ({
          refreshStudentsNotification: !prevState.refreshStudentsNotification,
        }))
      );
  }

  handleEditStudent(courseId: Number, userId: number, event: any) {
    this.setState(prevState => ({ editMode: true, currentUserId: userId }));
  }

  handleSaveStudent(courseId: Number, userId: number, event: any) {
    if (!this.state.currentUserRole) {
      return this.setState(prevState => ({
        editMode: false,
        currentUserId: "",
        currentUserRole: undefined,
      }));
    }

    coursesService
      .changeStudentRole(courseId, userId, this.state.currentUserRole.name)
      .then(() => this.loadStudents())
      .then(() =>
        this.setState(prevState => ({
          editMode: false,
          currentUserId: "",
          currentUserRole: undefined,
        }))
      );
  }

  handleCloseModal() {
    this.setState({ editMode: false });
  }

  handleSelectRole(event) {
    this.setState({ currentUserRole: event.target.value });
  }

  renderRolesOptions() {
    const { roles } = this.state;
    return _.map(roles, role => (
      <MenuItem key={role.id} value={role}>
        {role.name}
      </MenuItem>
    ));
  }

  renderHeadRow(classes: any) {
    const cells = [
      <TableCell key={1} className={classes.tableAvatarColumn} />,
      <TableCell key={2}>Usuario</TableCell>,
      <TableCell key={3} align="right">
        Email
      </TableCell>,
      <TableCell key={4} align="right">
        Id
      </TableCell>,
      <TableCell key={5} align="right">
        Rol
      </TableCell>,
    ];

    const { context } = this.props;
    if (context.permissions && context.permissions.includes("user_manage")) {
      const extraCells = [
        <TableCell key={6} align="right">
          Activo
        </TableCell>,
        <TableCell key={7} className={classes.tableIconsColumn} />,
      ];

      cells.push(...extraCells);
    }

    return <TableRow key={0}>{cells}</TableRow>;
  }

  renderStudentRow(student: any, classes: any) {
    const cells = [
      <TableCell key={1} component="th" scope="row">
        <Avatar src={student.img_uri} className={classes.avatar}>
          {student.name[0]}
          {student.surname[0]}
        </Avatar>
      </TableCell>,
      <TableCell key={2} component="th" scope="row">
        {`${student.name} ${student.surname}`}
      </TableCell>,
      <TableCell key={3} align="right">
        {student.email}
      </TableCell>,
      <TableCell key={4} align="right">
        {student.student_id}
      </TableCell>,
      <TableCell key={5} align="right">
        {this.state.editMode && this.state.currentUserId === student.id ? (
          <Select id="role" name="role" onChange={event => this.handleSelectRole(event)}>
            {this.renderRolesOptions()}
          </Select>
        ) : (
          student.role
        )}
      </TableCell>,
    ];

    const { match, context } = this.props;
    const { courseId } = match.params;
    if (context.permissions && context.permissions.includes("user_manage")) {
      const extraCells = [
        <TableCell
          key={6}
          align="right"
          style={
            context.permissions && context.permissions.includes("user_manage")
              ? {}
              : { display: "none" }
          }
        >
          <span
            className={`${classes.status} ${
              student.accepted ? classes.activeStatus : classes.inactiveStatus
            }`}
          />
        </TableCell>,
        <TableCell
          key={7}
          align="right"
          style={
            context.permissions && context.permissions.includes("user_manage")
              ? {}
              : { display: "none" }
          }
        >
          <IconButton
            style={student.accepted ? { display: "none" } : {}}
            component="span"
            onClick={event => this.handleAcceptStudent(courseId, student.id, event)}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            component="span"
            onClick={event => this.handleDeleteStudent(courseId, student.id, event)}
          >
            <DeleteIcon />
          </IconButton>

          {this.state.editMode && this.state.currentUserId === student.id ? (
            <IconButton
              component="span"
              onClick={event => this.handleSaveStudent(courseId, student.id, event)}
            >
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton
              component="span"
              onClick={event => this.handleEditStudent(courseId, student.id, event)}
            >
              <EditIcon />
            </IconButton>
          )}
        </TableCell>,
      ];

      cells.push(...extraCells);
    }

    return (
      <TableRow hover key={student.student_id}>
        {cells}
      </TableRow>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderUsers(tableTitle: string, students: Array<Student>, classes: any) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Typography
          variant="h3"
          color="textSecondary"
          component="h3"
          className={classes.titleContainer}
        >
          {tableTitle}
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>{this.renderHeadRow(classes)}</TableHead>
          <TableBody>{students.map(student => this.renderStudentRow(student, classes))}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes, match } = this.props;

    const { students, teachers, isSideBarOpen, refreshStudentsNotification, error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <TopBar
          handleDrawerOpen={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          title="Inscriptos"
          refreshNotifications={refreshStudentsNotification}
        />
        <SideBar
          handleDrawerClose={e => this.handleSwitchDrawer(e)}
          open={isSideBarOpen}
          courseId={match.params.courseId}
        />
        <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
          <div className={classes.drawerHeader} />
          <div className={classes.tableContainerDiv}>
            {students && this.renderUsers("Alumnos", students, classes)}
          </div>
          <div className={classes.tableContainerDiv}>
            {teachers && this.renderUsers("Docentes", teachers, classes)}
          </div>
        </main>
      </div>
    );
  }
}

export default withState(withStyles(styles)(StudentsTeachersPage));
