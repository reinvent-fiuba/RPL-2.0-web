// @flow
import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { red } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { withState } from "../../utils/State";

const styles = () => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundColor: "lightsteelblue",
    backgroundSize: "contain",
  },
  action: {
    marginLeft: "auto",
  },
  avatar: {
    backgroundColor: red[500],
    fontSize: 14,
  },
  description: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
});

type Props = {
  classes: any,
  courseId: number,
  universityCourseId: string,
  name: string,
  description: string,
  imgUri: string,
  enrolled: Boolean,
  onClickGoToCourse: (e: Event, courseId: number) => void,
  onClickEnrollToCourse: (e: Event, courseId: number) => void,
  onClickUnenrollToCourse: (e: Event, courseId: number) => void,
};

class CourseCard extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      courseId,
      universityCourseId,
      name,
      description,
      enrolled,
      imgUri,
      onClickGoToCourse,
      onClickEnrollToCourse,
      onClickUnenrollToCourse,
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{universityCourseId}</Avatar>}
          title={name}
        />

        <CardMedia
          className={classes.media}
          image={
            imgUri || "https://www.materialui.co/materialIcons/social/school_black_192x192.png"
          }
          title={name}
        />

        <CardContent>
          <Tooltip title={description} placement="top">
            <Typography
              className={classes.description}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {description}
            </Typography>
          </Tooltip>
        </CardContent>

        <CardActions disableSpacing>
          {enrolled ? (
            <Button onClick={e => onClickGoToCourse(e, courseId)}>Acceder</Button>
          ) : (
            <div />
          )}
          <Button
            onClick={e =>
              enrolled ? onClickUnenrollToCourse(e, courseId) : onClickEnrollToCourse(e, courseId)}
            className={classes.action}
          >
            {enrolled ? "Desinscribirse" : "Inscribirse"}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withState(withStyles(styles)(CourseCard));
