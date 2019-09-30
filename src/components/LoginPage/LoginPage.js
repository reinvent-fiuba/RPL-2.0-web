import React, { useContext } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import HomePage from '../HomePage/HomePage';
import { withState } from '../../utils/State'

class LoginPage extends React.Component {

  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render(){
    return(
        <HomePage Form={LoginForm} />
    );
  }
}

export default withState(LoginPage);
