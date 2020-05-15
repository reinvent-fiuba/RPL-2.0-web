// @flow
import React from "react";
import ResetPasswordForm from "./ResetPasswordForm.react";
import HomePage from "../HomePage/HomePage";
import { withState } from "../../utils/State";

class ResetPasswordPage extends React.PureComponent<{ history: any }> {
  render() {
    const { history } = this.props;
    return <HomePage Form={ResetPasswordForm} history={history} />;
  }
}

export default withState(ResetPasswordPage);
