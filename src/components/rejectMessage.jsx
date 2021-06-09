import React from "react";
import Joi from "joi";
import Form from "./common/form";
import { updateRejectMessage } from "../services/pendingReportService";
import { patchUser } from "../services/userService";

class DenyMessage extends Form {
  state = { data: { denyMessage: "" }, errors: {} };

  schema = {
    denyMessage: Joi.string().max(255).required(),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { request, user } = this.props;
      data["deny"] = true;

      await updateRejectMessage(request._id, data);
      await patchUser(user._id, "request", { requestId: request._id });
      window.location = "/request";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { request } = this.props;
    const id = "id" + request.reportNumber;

    return (
      <React.Fragment>
        <button
          type="button"
          id="denybutton"
          className="btn btn-sm btn-danger"
          data-toggle="modal"
          data-target={"#" + id}
        >
          Deny
        </button>
        <div
          className="modal fade"
          id={id}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                <h5 className="m-0">Deny Message</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {this.renderTextArea({
                        name: "denyMessage",
                        label:
                          "Please enter the reason for denying the approval.",
                        require: true,
                        rows: "3",
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

export default DenyMessage;
