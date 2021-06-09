import React from "react";
import moment from "moment";
import Datetime from "react-datetime";
import PropTypes from "prop-types";

import "react-datetime/css/react-datetime.css";
import ErrorSpan from "./errorSpan";

const DateTimePicker = ({
  onChange,
  label,
  name,
  value,
  error,
  disabled,
  labelClass,
}) => {
  const renderInput = (props, openCalendar) => {
    return (
      <div className="text-left  mb-2">
        <label htmlFor={name} className={"mb-0 " + labelClass}>
          {label}{" "}
          {require && !disabled && <span className="text-danger">*</span>}
        </label>
        <div className="input-group">
          {!disabled && (
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => openCalendar(props)}
              >
                <i type="button" className="fas fa-calendar-alt" />
              </button>
            </div>
          )}
          <input
            type="text"
            className="form-control"
            value={moment(value).format("DD/MM/YY HH:mm")}
            disabled
          />
        </div>
        <ErrorSpan error={error} />
      </div>
    );
  };

  return (
    <Datetime
      onChange={(e) => onChange(e)}
      renderInput={renderInput}
      closeOnSelect={true}
    />
  );
};

export default DateTimePicker;

DateTimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
  error: PropTypes.string,
};

DateTimePicker.defaultProps = {
  disabled: false,
};
