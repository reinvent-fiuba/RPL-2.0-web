// @flow
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";
import type { SubmissionResult } from "../../types";

const useStyles = makeStyles({
  codeEditor: {
    height: "500px",
    width: "100%",
    display: "flex",
    paddingBottom: "70px",
    flex: "1 0 auto",
  },
});

type Props = {
  results: SubmissionResult,
};

const TestAccordion = (props: Props) => {
  const { results } = props;

  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();

  const handleExpanded = (event: Event, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const renderContent = () => {
    const {
      submited_code: submitedCode,
      activity_language: language,
    } = results;

    return (
      submitedCode && (
        <div className={classes.codeEditor}>
          <MultipleTabsEditor
            width="100%"
            initialCode={submitedCode}
            language={language}
            readOnly
          />
        </div>
      )
    );
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary
        id="code-header"
        aria-controls="code-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" color="black" component="p">
          Resolución
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{renderContent()}</AccordionDetails>
    </Accordion>
  );
};

export default TestAccordion;
