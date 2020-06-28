// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import type { Activity } from "../../types";

const styles = () => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "80%",
  },
  categoryTableTitle: {
    alignSelf: "start",
    paddingLeft: "15px",
  },
  submissionsColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tableRowDisabled: {
    backgroundColor: "#d0c4c4",
  },
  tableRowEnabled: {
    cursor: "pointer",
  },
  actionColumnButton: {
    marginRight: "2%",
    marginLeft: "2%",
  },
});

type Props = {
  activities: Array<Activity>,
  classes: any,
  onClickActivityResults: (e: Event, activityId: number) => void,
  onClickDeleteActivity: (activityId: number) => void,
  onClickDisableActivity: (activityId: number, newStatus: boolean) => void,
  handleActivityRowClick: (e: Event, activityId: number) => void,
};

function ActivitiesTeacherTable(props: Props) {
  const {
    activities,
    onClickActivityResults,
    onClickDeleteActivity,
    onClickDisableActivity,
    handleActivityRowClick,
    classes,
  } = props;

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Typography
        variant="h5"
        color="textSecondary"
        component="p"
        className={classes.categoryTableTitle}
      >
        {activities[0].category_name}
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow key={0}>
            <TableCell key={1} width={500}>
              Nombre
            </TableCell>
            <TableCell key={2} align="center">
              Lenguaje
            </TableCell>
            <TableCell key={3} align="center">
              Puntos
            </TableCell>
            <TableCell key={4} align="center">
              Entregas
            </TableCell>
            <TableCell key={5} align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {activities
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map(activity => (
              <TableRow
                hover={activity.active}
                key={activity.id}
                disabled
                className={activity.active ? classes.tableRowEnabled : classes.tableRowDisabled}
              >
                <TableCell
                  key={1}
                  component="th"
                  scope="row"
                  onClick={event => handleActivityRowClick(event, activity.id)}
                >
                  {activity.name}
                </TableCell>
                <TableCell
                  key={2}
                  align="center"
                  onClick={event => handleActivityRowClick(event, activity.id)}
                >
                  {activity.language}
                </TableCell>
                <TableCell
                  key={3}
                  align="center"
                  onClick={event => handleActivityRowClick(event, activity.id)}
                >
                  {activity.points}
                </TableCell>
                <TableCell key={4} align="center">
                  <div className={classes.submissionsColumn}>
                    #TODO
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={e => onClickActivityResults(e, activity.id)}
                    >
                      Explorar
                    </Button>
                  </div>
                </TableCell>
                <TableCell key={5} align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onClickDeleteActivity(activity.id)}
                    className={classes.actionColumnButton}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant={activity.active ? "outlined" : "contained"}
                    color="primary"
                    onClick={() => onClickDisableActivity(activity.id, !activity.active)}
                    className={classes.actionColumnButton}
                  >
                    {activity.active ? "Ocultar" : "Habilitar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default withStyles(styles)(ActivitiesTeacherTable);
