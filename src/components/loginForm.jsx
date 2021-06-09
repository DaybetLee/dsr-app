import React from "react";
import Joi from "joi";

import Logo from "../assets/brands/android-chrome-512x512.png";
import { login } from "../services/authService";
import Loading from "./common/loading";
import Form from "./common/form";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
    rendered: false,
  };

  componentDidMount = () => {
    this.setState({ rendered: true });
  };

  schema = {
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label(`Email`),
    password: Joi.string().required().label(`Password`),
  };

  doSubmit = async () => {
    const { email, password } = this.state.data;
    let errors = { ...this.state.errors };

    try {
      await login(email, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/login";
    } catch (ex) {
      if (ex.response && ex.response.status >= 400) {
        errors.error = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { errors, rendered } = this.state;
    if (!rendered) return <Loading />;

    return (
      <div className="pt-2 pb-4 d-flex justify-content-center">
        <form
          className="form-signin text-center curved-border"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <img className="mb-4" src={Logo} alt="" width="72" height="72" />
          <h1 className="h3 font-weight-normal">Please sign in</h1>
          {errors.error && (
            <div className="border border-danger text-danger loginError ">
              {errors.error}
            </div>
          )}

          <div className="mb-3 mt-3">
            {this.renderInput({
              name: "email",
              label: "Email",
              autoComplete: "username",
            })}
            {this.renderInput({
              name: "password",
              label: "Password",
              type: "password",
              autoComplete: "current-password",
            })}
          </div>
          {this.renderSubmitButton("Sign in", "primary btn-lg btn-block")}
          <p className="mt-5 mb-0 text-muted small">Ver. 0.1 build 1</p>
          <p className="mt-0 mb-3 text-muted small">A Project of Daybet Lee</p>
        </form>
      </div>
    );
  }
}

export default LoginForm;
