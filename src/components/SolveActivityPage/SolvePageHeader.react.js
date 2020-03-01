// @flow
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

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
};

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getLeftTitle(query: URLSearchParams) {
  if (query.get("teacherTest") !== null) {
    return (
      <Link to={`${useLocation().pathname}/edit`} component={Button}>
        Volver a modo editar
      </Link>
    );
  }
  return <div> </div>;
}

function SolvePageHeader(props: Props) {
  const query = useQuery();

  return (
    <div className={props.classes.secondHeader}>
      {getLeftTitle(query)}
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

export default withStyles(styles)(SolvePageHeader);
