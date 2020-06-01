// @flow
import React from "react";
import HomePage from "../HomePage/HomePage";
import ValidateEmailForm from "./ValidateEmailForm.react";
import { withState } from "../../utils/State";

class ValidateEmailPage extends React.PureComponent<{ history: any }> {
  render() {
    const { history } = this.props;
    return <HomePage Form={ValidateEmailForm} history={history} />;
  }
}

export default withState(ValidateEmailPage);
