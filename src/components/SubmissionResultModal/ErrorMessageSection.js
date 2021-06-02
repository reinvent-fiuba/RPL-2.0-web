import React from "react";
import Typography from "@material-ui/core/Typography";

const ErrorMessageSection = props => {
  const { exitMessage } = props;

  return (
    <>
      <Typography variant="h5" color="black" component="p">
        Mensaje de error:
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" component="p">
        {exitMessage}
      </Typography>
    </>
  );
}

export default ErrorMessageSection;
