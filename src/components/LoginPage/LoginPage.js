// @flow
import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import HomePage from "../HomePage/HomePage";
import { withState } from "../../utils/State";

class LoginPage extends React.PureComponent<{ history: any }> {
  render() {
    const { history } = this.props;
    return <HomePage Form={LoginForm} history={history} />;
  }
}

export default withState(LoginPage);
