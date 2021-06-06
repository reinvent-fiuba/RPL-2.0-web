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
import { Accordion, Grid } from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
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
  tableRowEnabled: {
    cursor: "pointer",
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
    <TableContainer component={Accordion} className={classes.tableContainer}>
      <AccordionSummary content={{ display: "inline" }} expandIcon={<ExpandMoreIcon />}>
        <Grid container xs={12}>
          <Grid item xs={10}>
            <Typography display="inline" variant="h6" color="textPrimary" component="h1">
              {activities[0].category_name}
            </Typography>
            <br />
            <Typography display="inline" variant="body1" color="textSecondary" component="body1">
              {activities[0].category_description}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography display="inline" variant="body2" color="textSecondary" component="body1">
              {`Cantidad de actividades: ${activities.length}`}
            </Typography>
            <br />
            <Typography display="inline" variant="body2" color="textSecondary" component="body1">
              {`Cantidad de puntos: ${_.sumBy(activities, "points")}`}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
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
              <TableCell key={5} align="right">
                Entregas
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map(activity => (
                <TableRow hover key={activity.id} className={classes.tableRowEnabled}>
                  <TableCell
                    key={1}
                    component="th"
                    scope="row"
                    onClick={event => handleCellClick(event, activity.id)}
                  >
                    {activity.name}
                  </TableCell>
                  <TableCell
                    key={2}
                    align="right"
                    onClick={event => handleCellClick(event, activity.id)}
                  >
                    {(activity.last_submission_date &&
                      activity.last_submission_date.split("T")[0]) ||
                      "-"}
                  </TableCell>
                  <TableCell
                    key={3}
                    align="right"
                    onClick={event => handleCellClick(event, activity.id)}
                  >
                    {activity.points}
                  </TableCell>
                  <TableCell
                    key={4}
                    align="right"
                    onClick={event => handleCellClick(event, activity.id)}
                  >
                    {getText(activity.submission_status).toUpperCase() || "SIN EMPEZAR"}
                  </TableCell>
                  <TableCell key={5} align="right">
                    <IconButton onClick={() => setOpenPanel(activity.id)}>
                      <SearchIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </TableContainer>
  );
}

export default withStyles(styles)(ActivitiesTable);
