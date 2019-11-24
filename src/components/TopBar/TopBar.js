import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SchoolIcon from '@material-ui/icons/School';
import Avatar from '@material-ui/core/Avatar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';


const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  user: {
    marginRight: theme.spacing(2),
  }
});

const actionIcons = {
  'Cursos': SchoolIcon,
  'Perfil': AccountCircleIcon,
  'Configuracion': SettingsIcon
}

class TopBar extends React.Component {
  
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {open: this.props.open};
  }

  componentWillReceiveProps(newProps){
    this.setState({open: newProps.open});
  }

  render() {
    const { classes } = this.props;

    return (<AppBar
      position="fixed"
      className={`${classes.appBar} ${this.state.open ? classes.appBarShift : ''}`}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.props.handleDrawerOpen}
            edge="start"
            className={`${classes.menuButton} ${this.state.open ? classes.hide : ''}`}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>
            Cursos
          </Typography>
          <Typography variant="body1" className={classes.user}>
            Matias Cano
          </Typography>
          <Avatar className={classes.avatar}>MC</Avatar>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TopBar);
