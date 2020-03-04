/* eslint-disable class-methods-use-this */
// @flow
import React from "react";
import SlidingPanel from "react-sliding-side-panel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import Typography from "@material-ui/core/Typography";
import { ThumbUp, ThumbDown, ThumbsUpDown } from "@material-ui/icons";
import { green, red, yellow } from "@material-ui/core/colors";
import ErrorNotification from "../../utils/ErrorNotification";
import type { SubmissionResult } from "../../types";
import submissionsService from "../../services/submissionsService";
import { withState } from "../../utils/State";
import getText from "../../utils/messages";

const _ = require("lodash");

type Props = {
  activityId: number,
  courseId: number,
  backdropClicked: void => void,
  isOpen: boolean,
  onSelectSubmission: (submissionId: number, idx: number) => void,
};

type State = {
  error: { open: boolean, message: ?string },
  submissions: Array<SubmissionResult>,
};

class SubmissionsSidePanel extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    submissions: [],
  };

  componentDidUpdate(prevProps) {
    const { courseId, activityId } = this.props;

    if (activityId !== prevProps.activityId && activityId !== null) {
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
  }

  getSubmissionResultStatusIcon(submissionStatus: string): any {
    if (submissionStatus === "SUCCESS") {
      return <ThumbUp style={{ color: green[500] }} />;
    }
    if (submissionStatus === "FAILURE" || submissionStatus.includes("ERROR")) {
      return <ThumbDown style={{ color: red[500] }} />;
    }
    return <ThumbsUpDown style={{ color: yellow[800] }} />;
  }

  render() {
    const { submissions, error } = this.state;
    const { isOpen, onSelectSubmission, backdropClicked } = this.props;

    const submissionsByDate = _.groupBy(
      submissions,
      submission => submission.submission_date.split("T")[0]
    );

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}
        <SlidingPanel
          type="right"
          isOpen={isOpen}
          size={25} // percentage of screen
          backdropClicked={() => backdropClicked()}
        >
          <div className="panel-container">
            {submissions &&
              Object.keys(submissionsByDate).map(date => {
                return (
                  <div key={date} className="date-submission-container">
                    <Typography variant="h6" color="textSecondary" component="p">
                      {date}
                    </Typography>
                    <List>
                      {submissionsByDate[date].map((submission, idxx) => (
                        <ListItem
                          button
                          key={submission.id}
                          onClick={() => onSelectSubmission(submission.id, idxx)}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <DescriptionOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={getText(submission.submission_status).toUpperCase()}
                            secondary={submission.submission_date.split("T")[1].split(".")[0]}
                          />
                          <ListItemSecondaryAction>
                            {this.getSubmissionResultStatusIcon(submission.submission_status)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                );
              })}
            {submissions.length === 0 ? (
              <Typography variant="h5" color="textSecondary" component="h6">
                No hay entregas
              </Typography>
            ) : null}
          </div>
        </SlidingPanel>
      </div>
    );
  }
}

export default withState(SubmissionsSidePanel);
