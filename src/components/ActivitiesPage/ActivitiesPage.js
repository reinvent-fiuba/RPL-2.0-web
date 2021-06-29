// @flow
import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import ErrorNotification from "../../utils/ErrorNotification";
import type { Activity } from "../../types";
import "./ActivitiesPage.css";
import SubmissionsSidePanel from "./SubmissionsSidePanel.react";
import ActivitiesTable from "./ActivitiesTable.react";
import SubmissionResultModal from "../SubmissionResultModal/TestResultsModal.react";

const _ = require("lodash");

const styles = theme => ({
  title: {
    marginTop: 20,
    marginBottom: 20,
  },
  rightButton: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  tableContainerDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 30px 30px 30px",
  },
});

type Props = {
  match: any,
  classes: any,
  history: any,
  context: any,
};

type State = {
  error: { open: boolean, message: ?string },
  activities: Array<Activity>,
  submissionsPanel: { isOpen: boolean, activityId: ?number },
  isSelectedResult: boolean,
  selectedSubmissionId: ?number,
};

class ActivitiesPage extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    activities: [],
    submissionsPanel: { isOpen: false, activityId: null },
    isSelectedResult: false,
    selectedSubmissionId: null,
  };

  componentDidMount() {
    const { match } = this.props;
    activitiesService
      .getAllActivities(match.params.courseId)
      .then(response => {
        this.props.context.set("activities", response);
        this.setState({ activities: response });
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

  // submissions sidepanel
  setOpenPanel(activityId: number) {
    this.setState({ submissionsPanel: { isOpen: true, activityId } });
  }

  // submissions sidepanel
  setClosePanel() {
    this.setState({ submissionsPanel: { isOpen: false, activityId: null } });
  }

  handleClickOnActivityTitle(event: any, activityId: number) {
    const { history, match } = this.props;
    // TODO: si es un docente que vaya a /edit
    history.push(`/courses/${match.params.courseId}/activities/${activityId}`);
  }

  // click on submission in the right SidePanel
  handleClickOnSubmission(submissionId: number, idx: number) {
    this.setState(prevState => ({
      submissionsPanel: { isOpen: false, activityId: prevState.submissionsPanel.activityId },
    }));
    setTimeout(() => {
      this.setState({
        isSelectedResult: true,
        selectedSubmissionId: submissionId,
      });
    }, 200);
  }

  handleCloseModal(e: Event) {
    e.preventDefault();
    this.setState({ isSelectedResult: false });
    setTimeout(() => {
      this.setState(prevState => ({
        submissionsPanel: { isOpen: true, activityId: prevState.submissionsPanel.activityId },
        selectedSubmissionId: null,
      }));
    }, 200);
  }

  render() {
    const { classes, match, context } = this.props;

    const {
      activities,
      error,
      submissionsPanel,
      isSelectedResult,
      selectedSubmissionId,
    } = this.state;

    const activeActivities = _.filter(
      activities || (context && context.activities),
      activity => activity.active && !activity.deleted
    );
    const activitiesByCategory = _.groupBy(activeActivities, "category_name");

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        {/* Se abre cuando alguien presiona el boton de VER ENTEGAS */}
        <SubmissionsSidePanel
          isOpen={submissionsPanel.isOpen}
          activityId={submissionsPanel.activityId}
          courseId={match.params.courseId}
          backdropClicked={() => this.setClosePanel()}
          onSelectSubmission={(submissionId, i) => this.handleClickOnSubmission(submissionId, i)}
        />

        {/* APARECE CUANDO SE QUIERE VER EL DETALLE DE UNA ENTEGA PASADA DESDE EL SIDE PANEL */}
        {isSelectedResult && (
          <SubmissionResultModal
            open={isSelectedResult}
            handleCloseModal={e => this.handleCloseModal(e)}
            showWaitingDialog
            activitySubmissionId={selectedSubmissionId}
            courseId={match.params.courseId}
          />
        )}

        {context.permissions && context.permissions.includes("activity_manage") ? (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.rightButton}
            component={Link}
            to={`/courses/${match.params.courseId}/activity/create`}
          >
            <AddIcon />
          </Fab>
        ) : (
          <div />
        )}

        {activeActivities &&
          Object.keys(activitiesByCategory)
            .sort((a, b) => (a > b ? 1 : -1))
            .map(category => (
              <div key={category} className={classes.tableContainerDiv}>
                <ActivitiesTable
                  activities={activitiesByCategory[category]}
                  setOpenPanel={activityId => this.setOpenPanel(activityId)}
                  handleCellClick={(event, activityId) =>
                    this.handleClickOnActivityTitle(event, activityId)
                  }
                />
              </div>
            ))}
      </div>
    );
  }
}

export default withState(withStyles(styles)(ActivitiesPage));
