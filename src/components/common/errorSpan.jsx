import React from "react";
import PropTypes from "prop-types";

const ErrorSpan = ({ error, div }) => {
  return error ? (
    <div className={div}>
      <i className="fas fa-exclamation-circle" />
      <span className="font-weight-normal pl-1">{error}</span>
    </div>
  ) : null;
};

export default ErrorSpan;

ErrorSpan.propTypes = {
  error: PropTypes.string,
  divClass: PropTypes.string,
};

ErrorSpan.defaultProps = {
  disabled: false,
  div: "text-left text-danger small pt-1 ",
};
