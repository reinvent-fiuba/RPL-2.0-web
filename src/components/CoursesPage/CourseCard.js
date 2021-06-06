// @flow
import React, { useState } from "react";
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
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

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
    isUnenrolling: false,
  };

  componentDidMount() {
    getPalette(
      this.props.imgUri || "https://www.materialui.co/materialIcons/social/school_black_192x192.png"
    ).then(palette => {
      this.setState({ palette });
    });
    this.setState({ isUnenrolling: false });
  }

  renderActions(enrolled, isUnrolling) {
    const {
      classes,
      accepted,
      courseId,
      onClickGoToCourse,
      onClickEnrollToCourse,
      onClickUnenrollToCourse,
    } = this.props;

    if (!enrolled) {
      return (
        <CardActions disableSpacing>
          <Button
            color="primary"
            onClick={e => onClickEnrollToCourse(e, courseId)}
            className={classes.action}
          >
            <Typography noWrap className={classes.actionText}>
              Inscribirse
            </Typography>
          </Button>
        </CardActions>
      );
    }
    if (isUnrolling) {
      return (
        <CardActions disableSpacing>
          <Typography noWrap className={classes.actionText}>
            ¿Estás seguro?
          </Typography>
          <Button
            color="secondary"
            onClick={e => {
              onClickUnenrollToCourse(e, courseId);
              this.setState({ isUnenrolling: false });
            }}
            className={classes.action}
            variant="contained"
            style={{ marginRight: "5px" }}
          >
            <Typography noWrap className={classes.actionText}>
              Si
            </Typography>
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.setState({ isUnenrolling: false });
            }}
            className={classes.action}
            variant="contained"
          >
            <Typography noWrap className={classes.actionText}>
              No
            </Typography>
          </Button>
        </CardActions>
      );
    }
    return (
      <CardActions disableSpacing>
        <Tooltip title="Desinscribirme del curso">
          <IconButton
            aria-label="desinscribirme"
            color="secondary"
            className={classes.action}
            onClick={() => {
              this.setState({ isUnenrolling: true });
            }}
            style={{ marginLeft: "5px", padding: "0px" }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
        <Button
          color="primary"
          onClick={e => onClickGoToCourse(e, courseId)}
          className={classes.action}
          disabled={!accepted}
          variant="contained"
          style={{ marginRight: "5px" }}
        >
          <Typography noWrap className={classes.actionText}>
            Acceder
          </Typography>
        </Button>
      </CardActions>
    );
  }

  render() {
    const { classes, universityCourseId, name, description, enrolled, imgUri } = this.props;

    const { palette, isUnenrolling } = this.state;

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
        {this.renderActions(enrolled, isUnenrolling)}
      </Card>
    );
  }
}

export default withState(withStyles(styles)(CourseCard));
