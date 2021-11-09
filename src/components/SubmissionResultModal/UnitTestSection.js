// @flow
import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import type { UnitTestRunResult } from "../../types";

type Props = {
  unitTestResults: Array<UnitTestRunResult>,
};

const UnitTestSection = (props: Props) => {
  const { unitTestResults } = props;

  const renderContent = () => {
    return unitTestResults
      .sort((a, b) => (a.test_name > b.test_name ? 1 : -1))
      .map((unitTestResult, idx) => {
        const { test_name: testName, error_messages: errorMessages } = unitTestResult;
        const result = unitTestResult.passed ? "success" : "error";
        return (
          <DialogContentText key={idx} id="scroll-dialog-description" tabIndex={-1} component="div">
            <Alert severity={result}>
              <AlertTitle>{testName.replace(/_/g, " ")}</AlertTitle>
              <pre>{errorMessages}</pre>
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
