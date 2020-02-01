import * as React from "react";
import { Markdown } from "react-showdown";

export default function MarkdownRenderer(props) {
  return <Markdown markup={props.content} />;
}
