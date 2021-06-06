//@flow
import React from "react";
import MarkdownView from "react-showdown";
import "github-markdown-css";

type Props = {
  content: any,
};

export default function MarkdownRenderer(props: Props) {
  return (
    <div className="markdown-body" style={{ margin: "30px" }}>
      <MarkdownView markdown={props.content} />
    </div>
  );
}
