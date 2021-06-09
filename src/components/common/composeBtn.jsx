import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ComposeBtn = ({ path, label, signature }) => {
  return (
    <React.Fragment>
      <div className="fixed-bottom mb-4 clearfix mr-4">
        {signature ? (
          <Link
            to={path}
            className="btn btn-primary float-right"
            style={{ width: "100px", borderRadius: "90px" }}
          >
            <i className="fas fa-plus" /> {label}
          </Link>
        ) : (
          <button
            className="btn btn-primary float-right"
            style={{ width: "100px", borderRadius: "90px" }}
            data-toggle="modal"
            data-target="#signingWarning"
          >
            <i className="fas fa-plus" /> {label}
          </button>
        )}
      </div>
      <div
        className="modal fade"
        id="signingWarning"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered " role="document">
          <div className="modal-content">
            <div className="modal-header bg-secondary" />
            <div className="modal-body pb-0 pt-3 text-left text-wrap ">
              <i className="fas fa-exclamation-triangle text-warning fa-2x px-2" />
              <span className="font-weight-bold" id="exampleModalLabel">
                Signature not provided.
              </span>
              <p className="pl-2">
                User signature is require to create a report, please update your
                signature in <Link to="/myreports">My Reports</Link> to
                continue.
              </p>
            </div>
            <div className="mb-3 text-center">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComposeBtn;

ComposeBtn.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired,
};
