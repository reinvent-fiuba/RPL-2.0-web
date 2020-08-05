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
        const shouldGoToRoute = !context.token || (location.state && location.state.onSignOut);
        history.replaceState(null, ""); // Clean state after deciding whether to go to login or not
        if (shouldGoToRoute) return <Component {...routeProps} />;
        return (
          <Redirect
            to={{
              pathname: "/courses",
              state: { goTo: routeProps.location.pathname },
            }}
          />
        );
      }}
    />
  );
}

export default withState(PublicRoute);