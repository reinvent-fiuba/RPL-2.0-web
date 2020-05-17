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
import "./ActivitiesPage.css";
import getText from "../../utils/messages";

const _ = require("lodash");

const styles = () => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "80%",
  },
  tableTitle: {
    alignSelf: "start",
    paddingLeft: "15px",
  },
});

type Props = {
  activities: any,
  classes: any,
  setOpenPanel: (activityId: number) => void,
  handleCellClick: (e: Event, activityId: number) => void,
};

function ActivitiesTable(props: Props) {
  const { activities, setOpenPanel, handleCellClick, classes } = props;

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Typography variant="h5" color="textSecondary" component="p" className={classes.tableTitle}>
        {activities[0].category_name}
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow key={0}>
            <TableCell key={1} width={500}>
              Nombre
            </TableCell>
            <TableCell key={2} align="right">
              Última actividad
            </TableCell>
            <TableCell key={3} align="right">
              Puntos
            </TableCell>
            <TableCell key={4} align="right">
              Estado
            </TableCell>
            <TableCell key={5} align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map(activity => (
            <TableRow hover key={activity.id}>
              <TableCell
                key={1}
                component="th"
                scope="row"
                onClick={event => handleCellClick(event, activity.id)}
              >
                {activity.name}
              </TableCell>
              <TableCell key={2} align="right">
                {(activity.last_submission_date && activity.last_submission_date.split("T")[0]) ||
                  "-"}
              </TableCell>
              <TableCell key={3} align="right">
                {15}
              </TableCell>
              <TableCell key={4} align="right">
                {getText(activity.submission_status).toUpperCase() || "SIN EMPEZAR"}
              </TableCell>
              <TableCell key={5} align="right">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpenPanel(activity.id)}
                >
                  Ver entregas
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default withStyles(styles)(ActivitiesTable);
