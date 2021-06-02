import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const StderrAccordion = props => {
  const { stderr = "" } = props;

  const [expanded, setExpanded] = useState(false);

  const getStderrColor = item => {
    if (item.includes("main") || item.includes("end_BUILD")) {
      return "secondary";
    }
    return "textSecondary";
  };

  const handleExpanded = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderContent = () => {
    return (
      <div>
        {stderr.split("\n").map((item, key) => (
          <Typography key={key} variant="subtitle1" color={getStderrColor(item)} component="p">
            {item}
          </Typography>
        ))}
      </div>
    );
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary
        id="stderr-header"
        aria-controls="stderr-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" color="black" component="p">
          Stderr
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{renderContent()}</AccordionDetails>
    </Accordion>
  );
};

export default StderrAccordion;
