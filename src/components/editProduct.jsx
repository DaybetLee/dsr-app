import Joi from "joi";
import React from "react";

import Form from "./common/form";
import { saveProductVendor } from "./../services/productVendor";

class EditProduct extends Form {
  state = { data: { name: "" }, errors: {} };

  schema = {
    name: Joi.string().max(255).required().label("Company Name"),
  };

  doSubmit = async () => {
    try {
      const { product } = this.props;
      const data = { ...this.state.data };
      await saveProductVendor({ _id: product._id, name: data.name });
      window.location = "/report_settings";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { product } = this.props;

    return (
      <React.Fragment>
        {product._id ? (
          <button
            type="button"
            id="forwardbutton"
            className="btn btn-sm btn-primary"
            data-toggle="modal"
            data-target={"#id" + product._id}
          >
            Edit
          </button>
        ) : (
          <button
            className="fas fa-plus fa-2x align-right clickable-icon bg-white"
            data-toggle="modal"
            data-target={"#id" + product._id}
          />
        )}
        <div
          className="modal fade"
          id={"id" + product._id}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="modal-header bg-secondary py-2">
                {product._id ? (
                  <h5 className="m-0">Edit Product Name</h5>
                ) : (
                  <h5 className="m-0">New Product Name</h5>
                )}
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {this.renderInput({
                        name: "name",
                        label: "Please enter the product name.",
                        placeholder: product.name,
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

export default EditProduct;
