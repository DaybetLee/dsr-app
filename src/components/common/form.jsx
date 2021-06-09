import Joi from "joi";
import { Component } from "react";

import Input from "./input";
import Select from "./select";
import SignPad from "./signPad";
import TextArea from "./textArea";
import DateTimePicker from "../common/dateTimePicker";

class Form extends Component {
  state = { data: {}, errors: {} };

  validate = () => {
    const { error } = Joi.object(this.schema)
      .options({ abortEarly: false })
      .validate(this.state.data);
    if (!error) return null;

    const errors = {};
    error.details.map(
      (item) => (errors[item.path[0]] = item.message.match(/(\w+)/gi).join(" "))
    );

    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schm = Joi.object({ [name]: this.schema[name] });
    const { error } = schm.validate(obj);
    return error ? error.details[0].message.match(/(\w+)/gi).join(" ") : null;
  };

  handleChange = ({ currentTarget }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(currentTarget);

    if (errorMessage)
      errors[currentTarget.name] = errorMessage.match(/(\w+)/gi).join(" ");
    else delete errors[currentTarget.name];

    const data = { ...this.state.data };
    data[currentTarget.name] = currentTarget.value;
    this.setState({ data, errors });
  };

  handleCustomSelectChange = ({ currentTarget }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(currentTarget);

    if (errorMessage)
      errors[currentTarget.name] = errorMessage.match(/(\w+)/gi).join(" ");
    else delete errors[currentTarget.name];

    const data = { ...this.state.data };

    data[currentTarget.name] = currentTarget.value;

    if (currentTarget.value === "N/A") {
      data.partNumber = [{ partNo: "", from: "", to: "" }];
      data.movementType = "";
      data.movementRemark = "";
    }

    this.setState({ data, errors });
  };

  renderInput({
    name,
    label,
    type,
    require,
    disabled,
    autoComplete = "",
    placeholder,
  }) {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        onChange={(e) => this.handleChange(e)}
        error={errors[name]}
        type={type}
        require={require}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    );
  }

  renderTextArea({ name, label, require, disabled, rows }) {
    const { data, errors } = this.state;

    return (
      <TextArea
        name={name}
        label={label}
        value={data[name]}
        onChange={(e) => this.handleChange(e)}
        error={errors[name]}
        require={require}
        disabled={disabled}
        rows={rows}
      />
    );
  }

  renderDateTimePicker({ name, label, disabled, require }) {
    const { data, errors } = this.state;

    return (
      <DateTimePicker
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        require={require}
        onChange={(e) =>
          this.handleChange({ currentTarget: { name, value: e.toDate() } })
        }
        disabled={disabled}
      />
    );
  }

  renderSignPad = ({ name, label, disabled, signedBy, completedDateTime }) => {
    const { data, errors } = this.state;
    return (
      <SignPad
        onChange={(signature) => this.handleChange(signature)}
        signature={data[name]}
        name={name}
        error={errors[name]}
        label={label}
        disabled={disabled}
        signedBy={signedBy}
        completedDateTime={completedDateTime}
      />
    );
  };

  renderSelect = ({
    name,
    label,
    options,
    disabled,
    require,
    customize = false,
    customSelectChange,
    id,
  }) => {
    const { data, errors } = this.state;
    return (
      <Select
        value={data[name]}
        id={id ? id : name}
        name={name}
        label={label}
        disabled={disabled}
        require={require}
        onChange={(e) =>
          customize ? customSelectChange(e) : this.handleChange(e)
        }
        options={options}
        error={errors[name]}
      />
    );
  };

  renderButton = (label, className = "", event) => {
    return (
      <button
        onClick={(e) => event(e)}
        className={"btn btn-" + className}
        type="button"
      >
        {label}
      </button>
    );
  };

  renderSubmitButton = (label, className = "") => {
    return (
      <button className={"btn btn-" + className} type="submit">
        {label}
      </button>
    );
  };
}

export default Form;
