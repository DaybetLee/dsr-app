import React from "react";
import PropTypes from "prop-types";

import ErrorSpan from "./errorSpan";

const TextArea = ({
  name,
  label,
  onChange,
  labelClass = "",
  textAreaClass = "",
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
      <textarea
        {...rest}
        disabled={disabled}
        onChange={(e) => onChange(e)}
        name={name}
        id={name}
        type="text"
        className={"form-control " + textAreaClass}
        placeholder={labelClass ? label : null}
      />
      <ErrorSpan error={error} />
    </div>
  );
};

export default TextArea;

TextArea.propTypes = {
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

TextArea.defaultProps = {
  disabled: false,
  require: false,
};
