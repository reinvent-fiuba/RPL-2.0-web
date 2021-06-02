import React from "react";
import Typography from "@material-ui/core/Typography";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Alert } from "@material-ui/lab";
import ReactDiffViewer from "react-diff-viewer";

const IOTestSection = props => {
  const { ioTestResults } = props;

  const renderContent = () => {
    return ioTestResults.map((ioResult, idx) => {
      const {
        id,
        name,
        expected_output: expectedOutput,
        run_output: runOutput
      } = ioResult;

      const result = expectedOutput === runOutput ? "success" : "error";

      const allGoodStyle =
        result === "success"
          ? {
              variables: {
                light: {
                  diffViewerBackground: "#fff",
                },
              },
            }
          : {};

      const separateNewLines = str => str.replace(/(\n)\1+/g, str => str.split("").join(" "));
      // Hack to fix issue #97 where '\n\n' is not displayed in diff viewer correctly but '\n \n' does

      return (
        <DialogContentText key={idx} id="scroll-dialog-description" tabIndex={-1} component="div">
          <Alert severity={result}>{name}</Alert>
          <ReactDiffViewer
            styles={allGoodStyle}
            key={id}
            leftTitle="Resultado de la corrida"
            oldValue={separateNewLines(runOutput)}
            rightTitle="Resultado esperado"
            newValue={separateNewLines(expectedOutput)}
            showDiffOnly={false}
            splitView
          />
        </DialogContentText>
      );
    });
  };

  return (
    <>
      <Typography variant="h5" color="black" component="p">
        Tests de entrada/salida:
      </Typography>
      {renderContent()}
    </>
  );
};

export default IOTestSection;
