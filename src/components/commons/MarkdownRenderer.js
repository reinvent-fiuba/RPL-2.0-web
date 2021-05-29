import React from "react";
import MarkdownView from "react-showdown";
import "github-markdown-css";

export default function MarkdownRenderer(props) {
  const {
    content
  } = props;

  return (
    <div className="markdown-body" style={{ margin: "30px" }}>
      <MarkdownView markdown={content} />
    </div>
  );
}
