import React, { useState, useContext } from 'react';

export const State = React.createContext();

export const StateProvider = (props) => {

  const set = (key, value) => {
    const newState = {...state, [key]: value};
    setState(newState);
    const localStorageState = JSON.parse(localStorage.getItem('state')) || {};
    localStorage.setItem('state', JSON.stringify(Object.assign(localStorageState, newState)));
  };

  const initState = {
    set: set,
    ...JSON.parse(localStorage.getItem('state'))
  };

  const [state, setState] = useState(initState);

  return (
    <State.Provider value={state}>
      {props.children}
    </State.Provider>
  )
}

export const withState = (Component) => {
  return (props) => {
    const state = useContext(State);

    return <Component state={state} {...props} />;
  };
};