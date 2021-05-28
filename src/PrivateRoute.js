import React from "react";
import { Route, Redirect } from "react-router-dom";
import { withState } from "./utils/State";
import PageWrapper from "./utils/PageWrapper";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ component: Component, context, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        const { location } = routeProps;
        const shouldGoToLogin = !context.token || (location.state && location.state.hasJustSignOut);
        history.replaceState(null, ""); // Clean state after deciding whether to go to login or not
        if (shouldGoToLogin) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { goTo: routeProps.location.pathname },
              }}
            />
          );
        }
        return (
          <PageWrapper>
            <Component {...routeProps} />
          </PageWrapper>
        );
      }}
    />
  );
}

export default withState(PrivateRoute);
