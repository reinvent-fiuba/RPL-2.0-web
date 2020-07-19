/* eslint-disable react/destructuring-assignment */
// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";

const styles = theme => ({
  secondHeader: {
    backgroundColor: "rgb(244, 243, 243)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    marginTop: "8px",
  },
  secondHeaderTitle: {
    alignSelf: "center",
    margin: "0px",
    color: "rgb(121, 116, 116)",
    fontFamily: "Arial, Verdana, san-serif",
  },
  topLeftButtons: {
    minWidth: "200px",
  },
  topRightButtons: {
    alignSelf: "flex-end",
  },
  mySubmissionsButton: {
    marginRight: "5px",
  },
});

type Props = {
  handleSubmitActivity: Event => void,
  handleOpenPastSubmissionsSidePanel: void => void,
  activityName: string,
  classes: any,
  history: any,
  canShowOtherSolutions: boolean,
  onlyTitle: boolean,
};

function getLeftTitle(
  history: any,
  permissions: Array<string>,
  classes: any,
  canShowOtherSolutions: boolean
) {
  if (permissions.includes("activity_manage")) {
    return (
      <Button onClick={() => history.push(`${history.location.pathname}/edit`)}>
        Volver a modo profesor
      </Button>
    );
  }
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      className={classes.topRightButtons}
      disabled={!canShowOtherSolutions}
      onClick={() => history.push(`${history.location.pathname}/definitives`)}
    >
      Ver otras soluciones
    </Button>
  );
}

function SolvePageHeader(props: Props) {
  return (
    <div className={props.classes.secondHeader}>
      {!props.onlyTitle && (
        <div className={props.classes.topLeftButtons}>
          {getLeftTitle(
            props.history,
            props.context.permissions,
            props.classes,
            props.canShowOtherSolutions
          )}
        </div>
      )}
      <h1 className={props.classes.secondHeaderTitle}>{props.activityName}</h1>
      {!props.onlyTitle && (
        <div className={props.classes.topRightButtons}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={props.classes.mySubmissionsButton}
            onClick={e => props.handleOpenPastSubmissionsSidePanel()}
          >
            Mis entregas
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={e => props.handleSubmitActivity(e)}
          >
            Entregar
          </Button>
        </div>
      )}
    </div>
  );
}

export default withState(withStyles(styles)(SolvePageHeader));
