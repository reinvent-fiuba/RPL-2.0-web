import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import { withState } from '../../utils/State';
import { withErrorHandling } from '../../utils/Error';
import { Button } from '@material-ui/core';

const styles = theme => ({
  card: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    action: {
      marginLeft: 'auto',
    },
    avatar: {
      backgroundColor: red[500],
      fontSize: 14
    },
});

class CourseCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    const { classes } = this.props;
    console.log('props', this.props);

    return(<Card className={classes.card}>
        <CardHeader
          avatar={
          <Avatar className={classes.avatar}>{this.props.id}</Avatar>
          }
          title={this.props.name}
        />
        <CardMedia
          className={classes.media}
          image={this.props.imgUri}
          title={this.props.name}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button>
            Acceder
          </Button>
          <Button className={classes.action}>
            Desincribirse
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withErrorHandling(withState(withStyles(styles)(CourseCard)));


