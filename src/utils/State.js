import React, { useState, useContext } from 'react';

export const State = React.createContext();

export const StateProvider = (props) => {

  const set = (key, value) => {
    const newState = {...state, [key]: value};
    const localStorageState = JSON.parse(localStorage.getItem('state')) || {};
    console.log('before setItem', JSON.parse(localStorage.getItem('state')));
    localStorage.setItem('state', JSON.stringify(Object.assign(localStorageState, newState)));
    console.log('after setItem', JSON.parse(localStorage.getItem('state')));
    return setState(newState);
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

    return <Component context={state} {...props} />;
  };
};

export const getState = () => {
  return JSON.parse(localStorage.getItem('state')) || {};
}
