import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import SignatureCanvas from "react-signature-canvas";
import ErrorSpan from "./errorSpan";

const SignPad = ({
  onChange,
  signature,
  name,
  error,
  label,
  disabled,
  signedBy,
  completedDateTime,
}) => {
  let sigPad = {};

  const onClear = () => {
    sigPad.clear();

    onChange({
      currentTarget: {
        name,
        value: "",
      },
    });
  };

  const onSign = () => {
    onChange({
      currentTarget: {
        name,
        value: sigPad.toDataURL("image/png"),
      },
    });
    sigPad.clear();
  };

  return (
    <React.Fragment>
      <div className="text-center pb-2">
        {signature ? (
          <img
            width="260px"
            height="130px"
            className={
              disabled ? "border border-dark" : "border border-dark btn"
            }
            data-toggle="modal"
            data-target={disabled ? null : "#signingModal"}
            alt="signature"
            src={signature}
          />
        ) : (
          <button
            width="260px"
            height="130px"
            className="btn border border-dark btn signPadbtn"
            data-toggle="modal"
            data-target="#signingModal"
            disabled={disabled}
            type="button"
          >
            {label}
          </button>
        )}
        {disabled && signedBy ? (
          <div className="text-centerpt-1">
            <span className="font-weight-normal pl-1">
              Signed by {signedBy} on {moment(completedDateTime).format("L")}
            </span>
          </div>
        ) : (
          <ErrorSpan error={error} div="text-center text-danger small pt-1" />
        )}
      </div>
      <div
        className="modal fade"
        id="signingModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="signPad"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered " role="document">
          <div className="modal-content">
            <div className="modal-header"></div>
            <div className="modal-body text-center">
              <SignatureCanvas
                penColor="black"
                name={name}
                canvasProps={{
                  width: "360px",
                  height: "180px",
                  className: "sigCanvas border border-dark",
                }}
                ref={(ref) => {
                  sigPad = ref;
                }}
              />
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onClear()}
                className="btn btn-warning"
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSign()}
                data-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignPad;

SignPad.propTypes = {
  onChange: PropTypes.func.isRequired,
  signature: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  contactPerson: PropTypes.string,
  completedDateTime: PropTypes.any,
};

SignPad.defaultProps = {
  disabled: false,
};
