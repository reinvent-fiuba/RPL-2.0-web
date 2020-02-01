// @flow
import React from 'react';
import MonacoEditor from 'react-monaco-editor';

type Props = {
  onCodeChange: (code: string) => void,
  language: string,
  width: number | string,
  initialCode: string
};

type State = {
  code: string
};

export default class SimpleMonacoEditor extends React.Component<Props, State> {
  state = {
    code: this.props.initialCode,
  };

  onChange(newValue: string, e: Event) {
    this.setState({ code: newValue });
    this.props.onCodeChange(newValue);
  }

  render() {
    const { language, width } = this.props;
    const { code } = this.state;
    return (
      <MonacoEditor
        width={width}
        // height="800"
        language={language.split('_')[0]}
        theme="vs-dark"
        defaultValue=""
        value={code}
        onChange={(c: string, e: Event) => this.onChange(c, e)}
      />
    );
  }
}
