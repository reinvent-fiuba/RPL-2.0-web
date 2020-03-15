// @flow
import React from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CodeIcon from "@material-ui/icons/Code";
import SchoolIcon from "@material-ui/icons/School";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";

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
});

const actionIcons = {
  Cursos: SchoolIcon,
  Actividades: CodeIcon,
  Inscriptos: PeopleIcon,
  Perfil: AccountCircleIcon,
  Configuracion: SettingsIcon,
};

type Props = {
  open: boolean,
  classes: any,
  courseId: ?number,
  handleDrawerClose: () => void,
};

class SideBar extends React.PureComponent<Props> {
  render() {
    const { open, classes, courseId, handleDrawerClose } = this.props;

    const itemsLinks = { Cursos: "/courses" };

    if (courseId) {
      itemsLinks.Actividades = `/courses/${courseId}/activities`;
      itemsLinks.Inscriptos = `/courses/${courseId}/students`;
    }

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
        <Divider />
        <List>
          {["Perfil", "Configuracion"].map(text => {
            const Icon = actionIcons[text];
            return (
              <ListItem button key={text}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideBar);
