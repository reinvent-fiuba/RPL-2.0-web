// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import ErrorNotification from "../../utils/ErrorNotification";
import activitiesService from "../../services/activitiesService";
import AddIOTestModal from "./AddIOTestModal.react";
import { withState } from "../../utils/State";
import type { Activity, IOTest } from "../../types";

const drawerWidth = 240;

const styles = theme => ({
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  divider: {
    margin: 20,
  },
  list: {
    margin: 20,
    backgroundColor: "#f5f5f5",
    maxWidth: "500px",
  },
  addTestCaseButton: {
    margin: "20px 0 0 20px",
  },
});

type Props = {
  classes: any,
  courseId: number,
  activityId: number,
};

type State = {
  error: { open: boolean, message: ?string },
  activity: ?Activity,
  isTestModalOpen: boolean,
  selectedIOTest: ?IOTest,
  selectedIdx: ?number,
};

class IOCorrectionTests extends React.Component<Props, State> {
  state = {
    error: { open: false, message: null },
    activity: null,
    isTestModalOpen: false,
    selectedIOTest: null,
    selectedIdx: null,
  };

  componentDidMount() {
    const { courseId, activityId } = this.props;
    activitiesService
      .getActivity(courseId, activityId)
      .then(response => {
        this.setState({ activity: response });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar la actividad, Por favor reintenta",
          },
        });
      });
  }

  handleClickIOTestItem(ioTest: IOTest, idx: number) {
    this.setState({ selectedIOTest: ioTest, isTestModalOpen: true, selectedIdx: idx });
  }

  handleClickAddIOTest() {
    this.setState({ isTestModalOpen: true });
  }

  handleCloseModal() {
    const { courseId, activityId } = this.props;
    activitiesService.getActivity(courseId, activityId).then(response => {
      this.setState({ activity: response, selectedIOTest: null, isTestModalOpen: false });
    });
  }

  handleDeleteTest(ioTest: IOTest) {
    const { courseId, activityId } = this.props;
    activitiesService
      .deleteIOTest(courseId, activityId, ioTest.id)
      .then(response => {
        this.setState({ activity: response, selectedIOTest: null, isTestModalOpen: false });
      })
      .catch(() => {
        this.setState({
          error: {
            open: true,
            message: "Hubo un error al Eliminar la actividad, Por favor reintenta",
          },
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { courseId, activityId } = this.props;

    const { error, activity, selectedIOTest, isTestModalOpen, selectedIdx } = this.state;

    return (
      <div>
        {error.open && <ErrorNotification open={error.open} message={error.message} />}

        <Typography variant="h4" color="textSecondary" component="h1" className={classes.title}>
          Test de Entrada / Salida
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary" component="p" className={classes.title}>
          Agrega tests de entrada salida para que los alumnos puedan corroborar que el ejercicio
          está bien hecho.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.addTestCaseButton}
          onClick={() => this.handleClickAddIOTest()}
        >
          Agregar caso
        </Button>
        <div className={classes.list}>
          <List>
            {activity &&
              activity.activity_iotests.map((ioTest, idx) => (
                <ListItem
                  button
                  key={ioTest.id}
                  className={classes.listItem}
                  onClick={() => this.handleClickIOTestItem(ioTest, idx)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <DescriptionOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`Test case ${idx + 1}`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => this.handleDeleteTest(ioTest)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          {isTestModalOpen && (
            <AddIOTestModal
              ioTest={selectedIOTest}
              idx={selectedIdx}
              open={isTestModalOpen}
              handleCloseModal={() => this.handleCloseModal()}
              courseId={courseId}
              activityId={activityId}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withState(withStyles(styles)(IOCorrectionTests));
