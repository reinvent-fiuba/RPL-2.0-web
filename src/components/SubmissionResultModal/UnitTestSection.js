import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";

const UnitTestSection = props => {
  const { unitTestResults } = props;

  const renderContent = () => {
    return unitTestResults
      .sort((a, b) => (a.test_name > b.test_name ? 1 : -1))
      .map((unitTestResult, idx) => {
        const result = unitTestResult.passed ? "success" : "error";
        return (
          <DialogContentText key={idx} id="scroll-dialog-description" tabIndex={-1} component="div">
            <Alert severity={result}>
              <AlertTitle>{unitTestResult.test_name.replace(/_/g, " ")}</AlertTitle>
              {unitTestResult.error_messages &&
                unitTestResult.error_messages.split("\n").map((line, key) => {
                  if (key === 0 || key === unitTestResult.error_messages.split("\n").length - 2) {
                    return <span>{line}</span>;
                  }
                  return (
                    <span>
                      <blockquote>{line}</blockquote>
                    </span>
                  );
                })}
            </Alert>
          </DialogContentText>
        );
      });
  };

  return (
    <>
      <Typography variant="h5" color="black" component="p">
        Tests unitarios:
      </Typography>
      {renderContent()}
    </>
  );
};

export default UnitTestSection;
