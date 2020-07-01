// @flow
import React from "react";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbsUpDown from "@material-ui/icons/ThumbsUpDown";
import StarIcon from "@material-ui/icons/StarTwoTone";
import { green, red, yellow } from "@material-ui/core/colors";

type SubmissionResultStatusProps = {
  isFinalSolution: boolean,
  submissionStatus: string,
};

function SubmissionResultStatusIcon({
  isFinalSolution,
  submissionStatus,
}: SubmissionResultStatusProps) {
  if (isFinalSolution) {
    return <StarIcon style={{ color: green[500] }} fontSize="large" />;
  }
  if (submissionStatus === "SUCCESS") {
    return <ThumbUp style={{ color: green[500] }} />;
  }
  if (submissionStatus === "FAILURE" || submissionStatus.includes("ERROR")) {
    return <ThumbDown style={{ color: red[500] }} />;
  }
  return <ThumbsUpDown style={{ color: yellow[800] }} />;
}

export default SubmissionResultStatusIcon;
