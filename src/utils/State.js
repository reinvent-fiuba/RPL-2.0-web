import React, { useState, useContext } from "react";

export const State = React.createContext();

export const StateProvider = props => {
  const set = (key, value, softSave = false) => {
    return setState(oldState => {
      const newState = { ...oldState, [key]: value };
      if (softSave) {
        return newState;
      }
      const localStorageState = JSON.parse(localStorage.getItem("state")) || {};
      localStorage.setItem("state", JSON.stringify(Object.assign(localStorageState, newState)));
      return newState;
    });
  };

  const initState = {
    set,
    ...JSON.parse(localStorage.getItem("state")),
  };

  const [state, setState] = useState(initState);

  return <State.Provider value={state}>{props.children}</State.Provider>;
};

export const withState = Component => {
  return props => {
    const state = useContext(State);

    return <Component context={state} {...props} />;
  };
};

export const getState = () => {
  return JSON.parse(localStorage.getItem("state")) || {};
};
