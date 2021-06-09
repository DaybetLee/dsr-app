import React from "react";
import Form from "./form";
import Joi from "joi";

import { forwardReport } from "../../services/forwardService";

class Forward extends Form {
  state = { data: { email: "" }, errors: {} };

  schema = {
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label(`Recipent Email`),
  };

  doSubmit = async () => {
    const { report } = this.props;

    try {
      const data = { ...this.state.data };
      await forwardReport(report._id, data);
      window.location = "/myreports";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { report } = this.props;
    const id = "id" + report.reportNumber;

    return (
      <React.Fragment>
        <i
          type="button"
          id="forwardbutton"
          className="fas fa-share-square clickable-icon"
          data-toggle="modal"
          data-target={"#" + id}
        ></i>
        <div
          className="modal fade"
          id={id}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                <h5 className="m-0">Forward Report</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {this.renderInput({
                        name: "email",
                        label: "Please enter the recipient email.",
                        require: true,
                      })}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 text-right">
                      <button
                        type="button"
                        className="btn btn-secondary mr-2"
                        data-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="Submit" className="btn btn-primary">
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Forward;
