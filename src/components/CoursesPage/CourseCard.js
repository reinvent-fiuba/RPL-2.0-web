import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { withState } from '../../utils/State';
import { withErrorHandling } from '../../utils/Error';

const styles = (theme) => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundColor: 'lightsteelblue',
    backgroundSize: 'contain',
  },
  action: {
    marginLeft: 'auto',
  },
  avatar: {
    backgroundColor: red[500],
    fontSize: 14,
  },
});

class CourseCard extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>{this.props.university_course_id}</Avatar>
          }
          title={this.props.name}
        />

        <CardMedia
          className={classes.media}
          image={this.props.imgUri || 'https://www.materialui.co/materialIcons/social/school_black_192x192.png'}
          title={this.props.name}
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.description}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <Button component={Link} to={`/courses/${this.props.id}/activities`}>
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
