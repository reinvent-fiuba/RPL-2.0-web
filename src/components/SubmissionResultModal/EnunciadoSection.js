import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import activitiesService from "../../services/activitiesService";

const EnunciadoSection = props => {
  const { courseId, activityId } = props;

  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await activitiesService.getActivityForStudent(courseId, activityId);
        setContent(res?.description);
      } catch (err) {
        console.log("Hubo un error al cargar el enunciado");
      }
    };

    fetchActivity();
  });

  const handleExpanded = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpanded}>
      <AccordionSummary
        id="enunciado-header"
        aria-controls="enunciado-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" color="black" component="p">
          Enunciado
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MarkdownRenderer content={content} />
      </AccordionDetails>
    </Accordion>
  );
};

export default EnunciadoSection;
