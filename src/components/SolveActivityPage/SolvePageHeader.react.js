/* eslint-disable react/destructuring-assignment */
// @flow
import React from "react";
import { useHistory } from "react-router-dom";
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
  },
  secondHeaderTitle: {
    alignSelf: "center",
    margin: "0px",
    color: "rgb(121, 116, 116)",
    fontFamily: "Arial, Verdana, san-serif",
  },
  submitButton: {
    alignSelf: "flex-end",
  },
});

type Props = {
  handleSubmitActivity: Event => void,
  activityName: string,
  classes: any,
  history: any,
};

function getLeftTitle(permissions: Array<string>, history: any) {
  if (permissions.includes("activity_manage")) {
    return <Button onClick={() => history.goBack()}>Volver a modo profesor</Button>;
  }
  return <div> </div>;
}

function SolvePageHeader(props: Props) {
  return (
    <div className={props.classes.secondHeader}>
      {getLeftTitle(props.context.permissions, useHistory())}
      <h1 className={props.classes.secondHeaderTitle}>{props.activityName}</h1>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={props.classes.submitButton}
        onClick={e => props.handleSubmitActivity(e)}
      >
        Entregar
      </Button>
    </div>
  );
}

export default withState(withStyles(styles)(SolvePageHeader));
