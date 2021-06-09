import React from "react";
import PropTypes from "prop-types";

import ErrorSpan from "./errorSpan";

const Select = ({
  value,
  label,
  onChange,
  options,
  name,
  error,
  labelClass,
  disabled,
  require,
}) => {
  return (
    <div className="text-left pb-2">
      <label htmlFor={name} className={"mb-0 " + labelClass}>
        {label} {require && !disabled && <span className="text-danger">*</span>}
      </label>
      <select
        name={name}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e)}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option
            key={option._id ? option._id : option.key ? option.key : index}
            value={option._id ? option._id : option.value}
          >
            {option.name ? option.name : option.key}
          </option>
        ))}
      </select>
      <ErrorSpan error={error} />
    </div>
  );
};

export default Select;

Select.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  labelClass: PropTypes.string,
  disabled: PropTypes.bool,
  require: PropTypes.bool,
};

Select.defaultProps = {
  disabled: false,
  require: false,
};
