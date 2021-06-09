import React from "react";
import PropTypes from "prop-types";

import { Redirect, Route } from "react-router-dom";
import { getCurrentUserToken } from "../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!getCurrentUserToken())
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.func,
  render: PropTypes.func,
};
