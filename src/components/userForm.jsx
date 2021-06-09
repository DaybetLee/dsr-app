import Joi from "joi";
import React from "react";
import objectId from "joi-objectid";
import jpc from "joi-password-complexity";

import { getManagerUser, getUser, saveUser } from "../services/userService";
import { getBusinessUnits } from "./../services/businessUnit";
import Loading from "./common/loading";
import Form from "./common/form";

const JoiObjectId = objectId(Joi);

class UserForm extends Form {
  state = {
    data: {
      staffNumber: "",
      name: "",
      businessUnit: "",
      email: "",
      password: "",
      role: "user",
      userSignature: "",
      managerId: "",
      rep_pass: "",
      request: [],
    },
    errors: { error: "" },
    role: [
      { key: "admin", value: "admin" },
      { key: "manager", value: "manager" },
      { key: "user", value: "user" },
    ],
    managers: [],
    businessUnits: [],
    rendered: false,
  };

  passwordOption = {
    min: 10,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .pattern(/[\d\w\s]/)
      .min(3)
      .max(255)
      .required()
      .label("Name"),
    businessUnit: Joi.string().required().label("Business Unit"),
    staffNumber: Joi.string().min(3).max(30).required().label("Staff Number"),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Email"),
    role: Joi.string().valid("user", "manager", "admin").label("Role"),
    managerId: Joi.string().allow(null, ""),
    password: jpc(this.passwordOption).required().label("Password"),
    rep_pass: jpc(this.passwordOption).required().label("Password"),
    userSignature: Joi.string().allow(null, "").label("Signature"),
    request: Joi.array().items(JoiObjectId()).allow(null),
  };

  async componentDidMount() {
    try {
      const { data: allManagers } = await getManagerUser();
      const managers = [{ key: "N/A" }, ...allManagers];
      const { data: allBusinessUnits } = await getBusinessUnits();
      const businessUnits = [{ key: " " }, ...allBusinessUnits];

      const userId = this.props.match.params.id;
      if (userId === "new")
        return this.setState({ managers, businessUnits, rendered: true });
      const { data: user } = await getUser(userId);

      const filtered = managers.filter((manager) => manager.name !== user.name);

      this.setState({
        data: this.mapToViewModel(user),
        rendered: true,
        businessUnits,
        managers: filtered,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name,
      businessUnit: user.businessUnit,
      staffNumber: user.staffNumber,
      email: user.email,
      role: user.role,
      managerId: user.manager || "",
      password: "",
      userSignature: user.userSignature,
      rep_pass: "",
      request: user.request,
    };
  }

  doSubmit = async () => {
    try {
      const data = { ...this.state.data };
      await saveUser(data);
      this.props.history.push("/user");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handleReset = () => {
    this.setState({
      data: {
        staffNumber: "",
        name: "",
        businessUnit: "",
        email: "",
        password: "",
        role: "user",
        signature: "",
        managerId: "",
        rep_pass: "",
        request: [],
      },
    });
  };

  render() {
    const { data, role, managers, errors, rendered, businessUnits } =
      this.state;

    if (!rendered) return <Loading />;

    return (
      <div className="pb-4 d-flex justify-content-center">
        <form
          className="report-create text-center curved-border"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <div className="row">
            <span className="col-md-12 text-left ">
              <h1 className="h3 font-weight-normal mb-0">
                {data._id ? "User Profile" : "New User"}
              </h1>
            </span>
          </div>
          <div className="row">
            <div className="col-md-6">
              {this.renderInput({
                name: "name",
                label: "Name",
                require: true,
              })}
            </div>
            <div className="col-md-6">
              {this.renderInput({
                name: "email",
                label: "Email",
                require: true,
                autoComplete: "username",
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {this.renderSelect({
                name: "businessUnit",
                label: "Business Unit",
                options: businessUnits,
                require: true,
              })}
            </div>
            <div className="col-md-6">
              {this.renderInput({
                name: "staffNumber",
                label: "Staff Number",
                require: true,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {this.renderSelect({
                name: "role",
                label: "Role",
                options: role,
                require: true,
              })}
            </div>
            <div className="col-md-6">
              {this.renderSelect({
                name: "managerId",
                label: "Manager",
                options: managers,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {this.renderInput({
                name: "password",
                label: "Password",
                type: "password",
                autoComplete: "current-password",
                require: true,
              })}
            </div>
            <div className="col-md-6">
              {this.renderInput({
                name: "rep_pass",
                label: "Retype Password",
                type: "password",
                autoComplete: "current-password",
                require: true,
              })}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12">
              {this.renderButton("Back", "secondary m-2", () =>
                this.props.history.goBack()
              )}
              {data._id && this.renderSubmitButton("Update", "primary")}
              {!data._id &&
                this.renderButton("Clear", "warning m-2", () =>
                  this.handleReset()
                )}
              {!data._id && this.renderSubmitButton("Submit", "primary")}
            </div>
          </div>
          {errors.error && (
            <div className="row">
              <div className="col-md-12 ">
                <div className="border border-danger text-danger loginError">
                  {errors.error}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default UserForm;
