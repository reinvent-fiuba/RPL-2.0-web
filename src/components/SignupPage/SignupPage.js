// @flow
import React from "react";
import HomePage from "../HomePage/HomePage";
import SignupForm from "./SignupForm";

class SignupPage extends React.PureComponent<{ history: any }> {
  render() {
    const { history } = this.props;
    return <HomePage Form={SignupForm} history={history} />;
  }
}

export default SignupPage;
