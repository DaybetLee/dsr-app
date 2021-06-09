import Joi from "joi";
import React from "react";

import Form from "./common/form";
import { saveBusinessUnit } from "./../services/businessUnit";

class EditBusinessUnit extends Form {
  state = { data: { name: "", description: "" }, errors: {} };

  schema = {
    name: Joi.string().max(255).required().label("Business Unit Name"),
    description: Joi.string().max(255).allow(null, "").label("Description"),
  };

  doSubmit = async () => {
    try {
      const { businessUnit } = this.props;
      const data = { ...this.state.data };
      await saveBusinessUnit({
        _id: businessUnit._id,
        name: data.name,
        description: data.description,
      });
      window.location = "/user";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { businessUnit } = this.props;

    return (
      <React.Fragment>
        {businessUnit._id ? (
          <button
            type="button"
            id="forwardbutton"
            className="btn btn-sm btn-primary"
            data-toggle="modal"
            data-target={"#id" + businessUnit._id}
          >
            Edit
          </button>
        ) : (
          <button
            className="fas fa-plus fa-2x align-right clickable-icon bg-white"
            data-toggle="modal"
            data-target={"#id" + businessUnit._id}
          />
        )}
        <div
          className="modal fade"
          id={"id" + businessUnit._id}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                {businessUnit._id ? (
                  <h5 className="m-0">Edit Business Unit Name</h5>
                ) : (
                  <h5 className="m-0">New Business Unit Name</h5>
                )}
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {this.renderInput({
                        name: "name",
                        label: "Please enter the business unit name.",
                        placeholder: businessUnit.name,
                        require: true,
                      })}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {this.renderInput({
                        name: "description",
                        label: "Description",
                        placeholder: businessUnit.description,
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
                        Save
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

export default EditBusinessUnit;
