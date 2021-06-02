import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const StdoutAccordion = props => {
  const { stdout = "" } = props;

  const [expanded, setExpanded] = useState(false);

  const getStdoutColor = item => {
    if (item.includes("start_BUILD") || item.includes("end_BUILD")) {
      return "secondary";
    }
    if (item.includes("start_RUN") || item.includes("end_RUN")) {
      return "primary";
    }
    return "textSecondary";
  };

  const handleExpanded = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderContent = () => {
    return (
      <div>
        {stdout.split("\n").map((item, key) => (
          <Typography key={key} variant="subtitle1" color={getStdoutColor(item)} component="p">
            {item}
          </Typography>
        ))}
      </div>
    );
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary
        id="stdout-header"
        aria-controls="stdout-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" color="black" component="p">
          Stdout
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{renderContent()}</AccordionDetails>
    </Accordion>
  );
};

export default StdoutAccordion;
