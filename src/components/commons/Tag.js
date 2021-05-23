// @flow
import React from "react";

class Tag extends React.PureComponent<{ text: string }> {
  render() {
    const { text } = this.props;
    return (
      <span
        style={{
          fontSize: "xx-small",
          margin: "5px",
          padding: "2px",
          borderRadius: "10%",
          verticalAlign: "middle",
          backgroundColor: "lightblue"
        }}
      >
        {text}
      </span>
    );
  }
}

export default Tag;
