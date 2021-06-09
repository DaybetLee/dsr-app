import React from "react";
import PropTypes from "prop-types";

import ErrorSpan from "./errorSpan";

const Input = ({
  name,
  label,
  onChange,
  labelClass = "",
  inputClass = "",
  error,
  require,
  disabled,
  ...rest
}) => {
  return (
    <div className="text-left pb-2">
      <label htmlFor={name} className={"mb-0 " + labelClass}>
        {label} {require && !disabled && <span className="text-danger">*</span>}
      </label>
      <input
        {...rest}
        disabled={disabled}
        onChange={(e) => onChange(e)}
        name={name}
        className={"form-control " + inputClass}
      />
      <ErrorSpan error={error} />
    </div>
  );
};

export default Input;

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  labelClass: PropTypes.string,
  inputClass: PropTypes.string,
  error: PropTypes.string,
  require: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
};

Input.defaultProps = {
  disabled: false,
  type: "text",
  require: false,
};
