// @flow
import React from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import CodeIcon from "@material-ui/icons/Code";
import SchoolIcon from "@material-ui/icons/School";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Link, withRouter } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import { withState } from "../../utils/State";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  bottomPush: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 10,
    marginLeft: theme.spacing(2),
  },
});

const actionIcons = {
  Dashboard: BarChartIcon,
  Cursos: SchoolIcon,
  Actividades: CodeIcon,
  "Alumnos y Docentes": PeopleIcon,
  Perfil: AccountCircleIcon,
  "Configuracion de Curso": SettingsIcon,
  Usuarios: RecentActorsIcon,
  "Cerrar Sesión": ExitToAppIcon,
};

type Props = {
  open: boolean,
  classes: any,
  courseId: ?number,
  handleDrawerClose: () => void,
};

// eslint-disable-next-line react/no-redundant-should-component-update
class SideBar extends React.PureComponent<Props> {
  handleSignOut() {
    const { context, history } = this.props;
    context.invalidate();
    history.push({
      pathname: "/login",
      search: "",
      state: { hasJustSignOut: true }, // Flag to avoid internal redirections between public and private routes
    });
  }

  render() {
    const { open, classes, courseId, context, handleDrawerClose } = this.props;

    const itemsLinks = {};

    if (context.profile && context.profile.is_admin) {
      itemsLinks.Usuarios = `/users`;
    }

    if (courseId) {
      itemsLinks.Dashboard = `/courses/${courseId}/dashboard`;
      itemsLinks.Actividades = `/courses/${courseId}/activities`;
      if (context.permissions && context.permissions.includes("course_edit")) {
        itemsLinks["Configuracion de Curso"] = `/courses/${courseId}/edit`;
        itemsLinks["Alumnos y Docentes"] = `/courses/${courseId}/students`;
      }
    }

    const configurationLinks = {
      Cursos: "/courses",
      Perfil: "/profile",
    };

    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => handleDrawerClose()}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {Object.keys(itemsLinks).map(text => {
            const Icon = actionIcons[text];

            return (
              <ListItem button key={text} component={Link} to={itemsLinks[text]}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
        {Object.keys(itemsLinks).length !== 0 && <Divider />}
        <List>
          {Object.keys(configurationLinks).map(text => {
            const Icon = actionIcons[text];
            return (
              <ListItem button key={text} component={Link} to={configurationLinks[text]}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}

          <ListItem button key="Cerrar Sesión" onClick={() => this.handleSignOut()}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
        <div className={classes.bottomPush}>
          <a href="https://cafecito.app/rpl" rel="noopener noreferrer" target="_blank">
            <img
              srcset="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_5.png"
              alt="Invitame un café en cafecito.app"
            />
          </a>
        </div>
      </Drawer>
    );
  }
}

export default withRouter(withState(withStyles(styles)(SideBar)));
