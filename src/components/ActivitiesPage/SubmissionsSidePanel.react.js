// @flow
import React from "react";
import SlidingPanel from "react-sliding-side-panel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import type { SubmissionResult } from "../../types";
import submissionsService from "../../services/submissionsService";
import TestResultsModal from "../SolveActivityPage/TestResultsModal.react";
import { withState } from "../../utils/State";

type Props = {
  activityId: number,
  courseId: number,
  backdropClicked: void => void,
  isOpen: boolean,
  onSelectSubmission: (submission: SubmissionResult, idx: number) => void,
};

type State = {
  error: { open: boolean, message: ?string },
  submissions: Array<SubmissionResult>,
  isSelectedResult: boolean,
  selectedResult: ?SubmissionResult,
  isOpen: boolean,
};

class SubmissionsSidePanel extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    submissions: [],
    isSelectedResult: false,
    selectedResult: null,
    isOpen: false,
  };

  componentDidMount() {
    const { courseId, activityId } = this.props;

    submissionsService
      .getAllSubmissions(courseId, activityId)
      .then(response => {
        this.setState({ submissions: response });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener las actividades, Por favor reintenta",
          },
        });
      });
  }

  handleClickOnSubmission(submission: SubmissionResult, idx: number) {
    this.setState({ isSelectedResult: true, selectedResult: submission, isOpen: false });
  }

  handleDeleteTest(submission: SubmissionResult) {
    console.log(submission);
  }

  handleCloseModal(e: Event) {
    e.preventDefault();
    this.setState({ isSelectedResult: false, selectedResult: null, isOpen: true });
  }

  render() {
    const { submissions, error, isSelectedResult, selectedResult } = this.state;
    const { isOpen, onSelectSubmission } = this.props;

    return (
      <div>
        <SlidingPanel
          type="right"
          isOpen={isOpen}
          size={30} // percentage of screen
          backdropClicked={() => this.props.backdropClicked()}
        >
          <div className="panel-container">
            <List>
              {submissions &&
                submissions.map((submission, idx) => (
                  <ListItem
                    button
                    key={submission.id}
                    // className={classes.listItem}
                    onClick={() => onSelectSubmission(submission, idx)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionOutlinedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Resultado: ${submission.submission_status}`} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => this.handleDeleteTest(submission)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}

              <div>My Panel Content</div>
            </List>
          </div>
        </SlidingPanel>
        {/* {isSelectedResult && (
          <TestResultsModal
            results={selectedResult}
            open={isSelectedResult}
            handleCloseModal={e => this.handleCloseModal(e)}
          />
        )} */}
      </div>
    );
  }
}

export default withState(SubmissionsSidePanel);
