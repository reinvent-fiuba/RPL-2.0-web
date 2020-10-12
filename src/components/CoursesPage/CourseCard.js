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
import { getPalette } from "react-palette";
import { withState } from "../../utils/State";

const styles = theme => ({
  card: {
    maxWidth: 345,
    margin: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain",
  },
  actionText: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "100%",
    fontSize: "1em",
  },
  action: {
    margin: "auto",
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
  cardHeaderRoot: {
    lineClamp: 2,
    overflow: "hidden",
  },
  cardHeaderContent: {
    overflow: "hidden",
    // Wrap second line, this should fail in IE ¯\_(ツ)_/¯
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
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
  accepted: Boolean,
  onClickGoToCourse: (e: Event, courseId: number) => void,
  onClickEnrollToCourse: (e: Event, courseId: number) => void,
  onClickUnenrollToCourse: (e: Event, courseId: number) => void,
};

class CourseCard extends React.Component<Props, State> {
  state = {
    palette: {},
  };

  componentDidMount() {
    getPalette(
      this.props.imgUri || "https://www.materialui.co/materialIcons/social/school_black_192x192.png"
    ).then(palette => {
      this.setState({ palette });
    });
  }

  render() {
    const {
      classes,
      courseId,
      universityCourseId,
      name,
      description,
      enrolled,
      imgUri,
      accepted,
      onClickGoToCourse,
      onClickEnrollToCourse,
      onClickUnenrollToCourse,
    } = this.props;

    const { palette } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{universityCourseId}</Avatar>}
          classes={{
            root: classes.cardHeaderRoot,
            content: classes.cardHeaderContent,
          }}
          title={name}
        />
        <CardMedia
          className={classes.media}
          style={{
            backgroundColor: palette.lightVibrant,
          }}
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
            [
              <Button
                color="secondary"
                className={classes.action}
                onClick={e => onClickUnenrollToCourse(e, courseId)}
              >
                <Typography noWrap className={classes.actionText}>
                  Desinscribirse
                </Typography>
              </Button>,
              <Button
                color="primary"
                onClick={e => onClickGoToCourse(e, courseId)}
                className={classes.action}
                disabled={!accepted}
              >
                <Typography noWrap className={classes.actionText}>
                  Acceder
                </Typography>
              </Button>,
            ]
          ) : (
            <Button
              color="primary"
              onClick={e => onClickEnrollToCourse(e, courseId)}
              className={classes.action}
            >
              <Typography noWrap className={classes.actionText}>
                Inscribirse
              </Typography>
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }
}

export default withState(withStyles(styles)(CourseCard));
