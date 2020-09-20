import * as React from "react";
import { Markdown } from "react-showdown";
import "github-markdown-css";

export default function MarkdownRenderer(props) {
  return (
    <div className="markdown-body" style={{ margin: "20px" }}>
      <Markdown markup={props.content} />
    </div>
);
}
