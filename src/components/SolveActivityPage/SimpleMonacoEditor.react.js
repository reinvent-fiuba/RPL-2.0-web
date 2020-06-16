// @flow
import React from "react";
import MonacoEditor from "react-monaco-editor";

type Props = {
  onCodeChange: (code: string) => void,
  language: string,
  width: number | string,
  initialCode: string,
};

type State = {
  code: string,
};

export default class SimpleMonacoEditor extends React.Component<Props, State> {
  state = {
    code: this.props.initialCode,
  };

  onChange(newValue: string) {
    this.setState({ code: newValue });
    this.props.onCodeChange(newValue);
  }

  getLanguage(): string {
    const { language } = this.props;

    const lang = language.split("_")[0];
    if (lang.includes("python")) {
      return "python";
    }
    return lang;
  }

  render() {
    const { language, width } = this.props;
    const { code } = this.state;
    return (
      <MonacoEditor
        options={{
          renderFinalNewline: true,
        }}
        width={width}
        // height="800"
        language={this.getLanguage()}
        theme="vs-dark"
        defaultValue=""
        value={code}
        onChange={(c: string) => this.onChange(c)}
        editorDidMount={mountedEditor => {
          mountedEditor.changeViewZones(changeAccessor => {
            changeAccessor.addZone({
              afterLineNumber: 0,
              heightInLines: 1,
              domNode: document.createElement("span"),
            });
          });
        }}
      />
    );
  }
}
