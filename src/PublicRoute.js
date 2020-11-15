import React from "react";
import { Route, Redirect } from "react-router-dom";
import { withState } from "./utils/State";

// A wrapper for <Route> that redirects to the courses
// screen if are already authenticated.
function PublicRoute({ component: Component, context, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        const { location } = routeProps;
        const shouldGoToPublicRoute =
          !context.token || (location.state && location.state.hasJustSignOut);
        history.replaceState(null, ""); // Clean state after deciding whether to go to login or not
        if (shouldGoToPublicRoute) return <Component {...routeProps} />;
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { goTo: routeProps.location.pathname },
            }}
          />
        );
      }}
    />
  );
}

export default withState(PublicRoute);
