import React from 'react';
import HomePage from '../HomePage/HomePage';
import SignupForm from '../SignupForm/SignupForm';

class SignupPage extends React.Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render() {
    return (
      <HomePage Form={SignupForm} />
    );
  }
}

export default SignupPage;
