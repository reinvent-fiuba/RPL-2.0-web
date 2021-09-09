/* eslint-disable react/destructuring-assignment */
// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { withState } from "../../utils/State";
import activitiesService from "../../services/activitiesService";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import type { Activity } from "../../types";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
const LinkRouter = props => <Link {...props} component={RouterLink} />;

const styles = theme => ({
  secondHeader: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    margin: `-${theme.spacing(3)}px -${theme.spacing(3)}px 0px -${theme.spacing(3)}px`, // Force the second header to override layout
  },
  secondHeaderTitle: {
    alignSelf: "center",
    margin: "0px",
    color: theme.palette.text.primary,
    fontFamily: "Arial, Verdana, san-serif",
  },
  topLeftButtons: {
    minWidth: "200px",
  },
  topRightButtons: {
    alignSelf: "flex-end",
  },
  rightButton: {
    marginRight: "5px",
  },
});

type Props = {
  handleSubmitActivity: Event => void,
  handleOpenPastSubmissionsSidePanel: void => void,
  activity: string,
  classes: any,
  style: any,
  history: any,
  canShowOtherSolutions: boolean,
  onlyTitle: boolean
};

type State = {
  activityMenu: { isOpen: boolean, anchorEl: ?string },
  activityOptions: Array<Activity>
};

function getLeftTitle(
  history: any,
  permissions: Array<string>,
  classes: any,
  canShowOtherSolutions: boolean
) {
  if (permissions.includes("activity_manage")) {
    return (
      <Button
        className={classes.rightButton}
        onClick={() => history.push(`${history.location.pathname}/edit`)}
      >
        Volver a modo profesor
      </Button>
    );
  }
  return (
    <Button
      type="submit"
      variant="contained"
      className={classes.rightButton}
      disabled={!canShowOtherSolutions}
      onClick={() => history.push(`${history.location.pathname}/definitives`)}
    >
      Ver otras soluciones
    </Button>
  );
}

class SolvePageHeader extends React.Component<Props, State> {
  state = {
    activityMenu: { isOpen: false, anchorEl: null },
    activityOptions: []
  };

  componentDidMount() {
    activitiesService
      .getAllActivities(this.props.context.course.id)
      .then(activitiesResponse => {
        // filter active activities and those which belong to the same category as the current one
        let activities = activitiesResponse
          .filter(activity => (activity.category_id === this.props.activity.category_id && activity.active))
          .sort((a, b) => a.name > b.name);
        this.setState({
          activityOptions: activities
        })
      })
      .catch(err => {
        if (err.status === 404) {
          return Promise.resolve(this.setState({ activityOptions: [] }));
        }
        return Promise.reject(err);
      });
  }

  handleOpenActivityMenu(event: any) {
    this.setState({ activityMenu: { isOpen: true, anchorEl: event.currentTarget } });
  }

  handleCloseActivityMenu() {
    this.setState({ activityMenu: { isOpen: false, anchorEl: null } });
  }

  render() {
    const { course } = this.props.context;
    const { activityMenu, activityOptions } = this.state;
    const { activity } = this.props;
    return (
      <div style={this.props.style} className={this.props.classes.secondHeader}>
        <Breadcrumbs aria-label="breadcrumb">
          <LinkRouter color="inherit" to={`/courses/${course.id}/dashboard`}>
            {this.props.context.course.name}
          </LinkRouter>
          <LinkRouter color="inherit" to={`/courses/${course.id}/activities`}>
            Actividades
          </LinkRouter>
          <LinkRouter color="inherit" to={this.props.history.location.pathname}>
            <Button
              color="inherit"
              aria-haspopup="true"
              onClick={(e) => this.handleOpenActivityMenu(e)}
              variant='outlined'>
              {activity.name}
            </Button>
            <Menu
              anchorEl={activityMenu.anchorEl}
              open={activityMenu.isOpen}
              onClose={() => this.handleCloseActivityMenu()}
              PaperProps={{ style: { maxHeight: 320 }}}
            >
              {activityOptions.map((option) => (
                <MenuItem
                  selected={option.id === activity.id}
                  component={RouterLink}
                  to={`/courses/${course.id}/activities/${option.id}`}
                  key={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </Menu>
          </LinkRouter>
        </Breadcrumbs>
        {!this.props.onlyTitle && (
          <div className={this.props.classes.topRightButtons}>
            {getLeftTitle(
              this.props.history,
              this.props.context.permissions,
              this.props.classes,
              this.props.canShowOtherSolutions
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={this.props.classes.rightButton}
              onClick={e => this.props.handleOpenPastSubmissionsSidePanel()}
            >
              Mis entregas
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={e => this.props.handleSubmitActivity(e)}
            >
              Entregar
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withState(withStyles(styles)(SolvePageHeader));
