import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import IOTestSection from "./IOTestSection";
import UnitTestSection from "./UnitTestSection";
import ErrorMessageSection from "./ErrorMessageSection";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";

const useStyles = makeStyles({
  codeEditor: {
    height: "500px",
    width: "100%",
    display: "flex",
    paddingBottom: "70px",
    flex: "1 0 auto",
  },
});

const TestAccordion = props => {
  const { results } = props;

  const [expanded, setExpanded] = useState(true);

  const classes = useStyles();

  const handleExpanded = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderContent = () => {
    const {
      io_test_run_results: ioTestResults,
      unit_test_run_results: unitTestResults,
      submission_status: status,
      submited_code: submitedCode,
      activity_language: language,
      exit_message: exitMessage,
    } = results;

    return (
      <>
        {/* IO test results (if any) */}
        {ioTestResults && ioTestResults.length > 0 && (
          <Box mb={3}>
            <IOTestSection ioTestResults={ioTestResults} />
          </Box>
        )}
        {/* Unit test results (if any) */}
        {unitTestResults && unitTestResults.length > 0 && (
          <Box mb={3}>
            <UnitTestSection unitTestResults={unitTestResults} />
          </Box>
        )}
        {/* Error message */}
        {status.includes("ERROR") && (
          <Box mb={3}>
            <ErrorMessageSection exitMessage={exitMessage} />
          </Box>
        )}
        {/* Editor */}
        {submitedCode && (
          <div className={classes.codeEditor}>
            <MultipleTabsEditor
              width="100%"
              initialCode={submitedCode}
              language={language}
              readOnly
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary
        id="test-header"
        aria-controls="test-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" color="black" component="p">
          Resultados
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{renderContent()}</AccordionDetails>
    </Accordion>
  );
};

export default TestAccordion;
