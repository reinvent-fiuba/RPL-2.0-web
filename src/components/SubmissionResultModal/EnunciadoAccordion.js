import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import activitiesService from "../../services/activitiesService";

const EnunciadoAccordion = props => {
  const { courseId, activityId } = props;

  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await activitiesService.getActivityForStudent(courseId, activityId);
        setContent(res?.description);
      } catch (err) {
        setError(true);
      }
    };

    fetchActivity();
  }, [courseId, activityId]);

  const handleExpanded = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderContent = () => {
    if (error) {
      return (
        <Alert severity="error">
          Parece que hubo un error al intentar cargar el enunciado. :/
        </Alert>
      );
    }

    return <MarkdownRenderer content={content} />;
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
      <AccordionDetails>{renderContent()}</AccordionDetails>
    </Accordion>
  );
};

export default EnunciadoAccordion;
