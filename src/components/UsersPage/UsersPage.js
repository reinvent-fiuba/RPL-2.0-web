/* eslint-disable class-methods-use-this */
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
import { withState } from "../../utils/State";
import usersService from "../../services/usersService";
import ErrorNotification from "../../utils/ErrorNotification";

import type { Student } from "../../types";

const styles = theme => ({
  title: {
    marginTop: 20,
    marginBottom: 20,
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
});

type Props = {
  match: any,
  classes: any,
  history: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  users: Array<Student>,
};

class UsersPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    users: [],
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    usersService
      .findUsers("") // Search for all users, no query
      .then(response => {
        this.setState({ users: response });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener a los alumnos, Por favor reintenta",
          },
        });
      });
  }

  renderUserRow(user: any, classes: any) {
    return (
      <TableRow hover key={user.student_id}>
        <TableCell key={1} component="th" scope="row">
          <Avatar src={user.img_uri} className={classes.avatar}>
            {user.name[0]}
            {user.surname[0]}
          </Avatar>
        </TableCell>
        <TableCell key={2} component="th" scope="row">
          {`${user.name} ${user.surname}`}
        </TableCell>
        <TableCell key={3} align="right">
          {user.email}
        </TableCell>
        <TableCell key={4} align="right">
          {user.student_id}
        </TableCell>
        <TableCell key={5} align="right">
          {user.university}
        </TableCell>
        <TableCell key={6} align="right">
          {user.degree}
        </TableCell>
      </TableRow>
    );
  }

  renderUsers(users: Array<Student>, classes: any) {
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
                Universidad
              </TableCell>
              <TableCell key={6} align="right">
                Grado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{users.map(user => this.renderUserRow(user, classes))}</TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const { classes } = this.props;

    const { users, error } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <div className={classes.tableContainerDiv}>{users && this.renderUsers(users, classes)}</div>
      </div>
    );
  }
}

export default withState(withStyles(styles)(UsersPage));
