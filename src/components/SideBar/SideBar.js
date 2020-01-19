import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';

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
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }
});

const actionIcons = {
  'Cursos': SchoolIcon,
  'Perfil': AccountCircleIcon,
  'Configuracion': SettingsIcon
}

class SideBar extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {open: this.props.open};
  }

  componentWillReceiveProps(newProps){
    this.setState({open: newProps.open});
  }


  render() {
    const { classes } = this.props;

    return (<Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={this.state.open}
      classes={{
        paper: classes.drawerPaper,
      }}
      >
      <div className={classes.drawerHeader}>
        <IconButton onClick={this.props.handleDrawerClose}>
          <ChevronLeftIcon/>
        </IconButton>
      </div>
      <Divider />
      <List>
        {['Cursos'].map((text) => {
          const Icon = actionIcons[text];
          return <ListItem button key={text}>
            <ListItemIcon><Icon/></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        })}
      </List>
      <Divider />
      <List>
       {['Perfil', 'Configuracion'].map((text) => {
          const Icon = actionIcons[text];
          return <ListItem button key={text}>
            <ListItemIcon><Icon/></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
      })}
      </List>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideBar);