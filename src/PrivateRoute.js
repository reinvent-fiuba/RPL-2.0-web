import React from "react";
import { Route, Redirect } from "react-router-dom";
import { withState } from "./utils/State";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ component: Component, context, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps =>
        context.token ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { goTo: routeProps.location.pathname },
            }}
          />
        )}
    />
  );
}

export default withState(PrivateRoute);
