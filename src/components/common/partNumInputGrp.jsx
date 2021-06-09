import React from "react";
import PropTypes from "prop-types";

import ErrorSpan from "./errorSpan";

const PartNumInputGrp = ({
  handlePartNumber,
  partNumber,
  onAddItem,
  onSubItem,
  swapReason,
  disabled,
  error,
  require,
}) => {
  const columns = [
    { name: "partNo", label: "PartNo." },
    { name: "from", label: "From" },
    { name: "to", label: "To" },
  ];
  if (swapReason === "N/A") {
    return null;
  }

  return (
    <React.Fragment>
      {partNumber.map((item, index) => (
        <div key={index} className="row text-left ">
          {columns.map(({ name, label }) => (
            <div key={name} className="col-md-3 mb-3 ">
              <label htmlFor={name} className="mb-0 ">
                {label}{" "}
                {require && !disabled && <span className="text-danger">*</span>}
              </label>
              <input
                value={item[name]}
                onChange={(e) => handlePartNumber(e)}
                type="text"
                name={name}
                id={index}
                className="form-control"
                disabled={disabled}
              />
            </div>
          ))}

          {disabled ? null : index + 1 === partNumber.length ? (
            <div className="btn-group col-md-1 mb-3 pt-4">
              {partNumber.length < 9 ? (
                <button
                  onClick={() => onAddItem()}
                  className="btn btn-primary btn-sm"
                >
                  <i className="fas fa-plus" />
                </button>
              ) : null}
              {partNumber.length > 1 ? (
                <button
                  onClick={() => onSubItem()}
                  className="btn btn-danger btn-sm "
                >
                  <i className="fas fa-minus" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
      <ErrorSpan error={error} div="text-left text-danger small mb-3" />
    </React.Fragment>
  );
};

export default PartNumInputGrp;

PartNumInputGrp.propTypes = {
  handlePartNumber: PropTypes.func.isRequired,
  partNumber: PropTypes.array,
  onAddItem: PropTypes.func.isRequired,
  onSubItem: PropTypes.func.isRequired,
  swapReason: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  require: PropTypes.bool,
};

PartNumInputGrp.defaultProps = {
  disabled: false,
  require: false,
};
