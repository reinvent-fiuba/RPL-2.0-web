// @flow
import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm.react";
import HomePage from "../HomePage/HomePage";
import { withState } from "../../utils/State";

class ForgotPasswordPage extends React.PureComponent<{ history: any }> {
  render() {
    const { history } = this.props;
    return <HomePage Form={ForgotPasswordForm} history={history} />;
  }
}

export default withState(ForgotPasswordPage);
