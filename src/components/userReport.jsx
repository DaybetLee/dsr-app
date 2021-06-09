import Joi from "joi";
import _ from "lodash";
import React from "react";

import Form from "./common/form";
import ReportList from "./reportList";
import Loading from "./common/loading";
import { toast } from "react-toastify";
import { patchUser } from "./../services/userService";
import { getBusinessUnits } from "./../services/businessUnit";

class UserReport extends Form {
  state = {
    data: {
      staffNumber: "",
      name: "",
      businessUnit: "",
      email: "",
      role: "user",
      userSignature: "",
      managerId: "",
    },
    errors: { error: "" },
    businessUnits: [],
    rendered: false,
  };

  async componentDidMount() {
    try {
      const user = this.props.user;
      const { data: businessUnits } = await getBusinessUnits();
      this.setState({
        data: this.mapToViewModel(user),
        businessUnits,
        rendered: true,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  schema = {
    _id: Joi.any(),
    name: Joi.any(),

    businessUnit: Joi.any(),
    staffNumber: Joi.any(),
    email: Joi.any(),
    role: Joi.any(),
    userSignature: Joi.string().allow(null, "").label("Signature"),
  };

  doSubmit = async () => {
    try {
      toast.info(`Signature Updated`);
      const { _id: userId } = this.props.user;
      const { userSignature } = { ...this.state.data };

      await patchUser(userId, "userSignature", {
        userSignature,
      });

      window.location = "/myreports";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  mapToViewModel(user) {
    return _.pick(user, [
      "_id",
      "name",
      "businessUnit",
      "staffNumber",
      "email",
      "role",
      "userSignature",
    ]);
  }

  render() {
    const { ...props } = this.props;
    const { data, businessUnits, rendered } = this.state;

    if (!rendered) return <Loading />;
    return (
      <React.Fragment>
        <div className="row mb-1">
          <div className="col">
            <h3>Hello {data.name}</h3>
          </div>
        </div>
        <div className="row mb-3 px-3">
          <div className="col-md-4 card ">
            <div className="row mt-2">
              <div className="col">
                <span className="font-weight-bold ">
                  <u>Information</u>
                </span>
              </div>
            </div>
            <div className="row">
              <span className="font-weight-bold px-3 w-50">Staff Number:</span>
              <span className="px-2">{data.staffNumber}</span>
            </div>
            <div className="row">
              <span className="font-weight-bold px-3 w-50">Email:</span>
              <span className="px-2">{data.email}</span>
            </div>
            <div className="row">
              <span className="font-weight-bold px-3 w-50">Role:</span>
              <span className="px-2">{data.role}</span>
            </div>
            <div className="row">
              <span className="font-weight-bold px-3 w-50">Business Unit:</span>
              <span className="px-2">
                {
                  businessUnits.filter(
                    (businessUnit) => businessUnit._id === data.businessUnit
                  )[0].name
                }
              </span>
            </div>
            <div className="row justify-content-center my-3">
              <form onSubmit={(e) => this.handleSubmit(e)}>
                {this.renderSignPad({
                  name: "userSignature",
                  label: "Signature",
                  contactPerson: data.contactPerson,
                  completedDateTime: data.completedDateTime,
                })}
                {this.renderSubmitButton(
                  "Update Signature",
                  "primary btn-block"
                )}
              </form>
            </div>
          </div>
        </div>
        <ReportList {...props} />
      </React.Fragment>
    );
  }
}

export default UserReport;
