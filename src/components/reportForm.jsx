import Joi from "joi";
import React from "react";
import moment from "moment";
import objectId from "joi-objectid";

import PartNumInputGrp from "./common/partNumInputGrp";
import { getServiceReport, saveServiceReport } from "../services/reportService";
import { createTemplate, findTemplate } from "../services/templateService";
import { deletePendingRequest } from "../services/pendingReportService";
import { getProductVendors } from "../services/productVendor";
import { patchUser } from "../services/userService";
import {
  savePendingRequest,
  findPendingRequest,
} from "../services/pendingReportService";
import Form from "./common/form";

const JoiObjectId = objectId(Joi);

class ReportForm extends Form {
  state = {
    data: {
      companyName: "",
      site: "",
      address: "",
      contactPerson: "",
      contactPersonEmail: "",
      telephone: "",
      productVendor: "",
      ticketNumber: "",
      actionTaken: "",
      remark: "",
      chargeable: false,
      serviceDateTime: moment().toDate(),
      completedDateTime: moment().add(1, "minutes").toDate(),
      partNumber: [{ partNo: "-", from: "-", to: "-" }],
      movementType: "",
      movementRemark: "",
      jobCategory: "Post-Sale",
      swapReason: "N/A",
      reportNumber: "",
      customerSignature: "",
      userSignature: "",
      signedByUser: "",
      signedBy: "",
      owner: "",
    },
    errors: {},
    chargable: [
      { key: "No", value: false },
      { key: "Yes", value: true },
    ],
    jobCategory: [
      { key: "Post-Sale", value: "Post-Sale" },
      { key: "Project", value: "Project" },
      { key: "Pre-Sale", value: "Pre-Sale" },
    ],
    swapReason: [
      { key: "N/A", value: "N/A" },
      { key: "Replacement", value: "Replacement" },
      { key: "Repair", value: "Repair" },
      { key: "Loan", value: "Loan" },
    ],
    movementType: [
      { key: "", value: "" },
      { key: "3-Legged RMA", value: "3-Legged RMA" },
      { key: "Maintenance Swap", value: "Maintenance Swap" },
      { key: "Direct RMA", value: "Direct RMA" },
    ],
    movementRemark: [
      { key: "", value: "" },
      { key: "Permanent Replacement", value: "Permanent Replacement" },
      { key: "Temporary Loan", value: "Temporary Loan" },
    ],
    productVendors: [],
    disabled: false,
    request: false,
    deny: false,
  };

  dataModel = {
    companyName: "",
    site: "",
    address: "",
    contactPerson: "",
    contactPersonEmail: "",
    telephone: "",
    productVendor: "",
    ticketNumber: "",
    actionTaken: "",
    remark: "",
    chargeable: false,
    serviceDateTime: moment().toDate(),
    completedDateTime: moment().add(1, "minutes").toDate(),
    partNumber: [{ partNo: "", from: "", to: "" }],
    movementType: "",
    movementRemark: "",
    jobCategory: "Post-Sale",
    swapReason: "N/A",
    reportNumber: "",
    customerSignature: "",
    signedByUser: "",
    signedBy: "",
    owner: "",
  };

  schema = {
    _id: Joi.string(),
    serviceDateTime: Joi.date(),
    completedDateTime: Joi.date(),
    companyName: Joi.string().max(255).required().label("Company Name"),
    site: Joi.string().allow(null, "").max(255).label("Site"),
    address: Joi.string().max(255).allow(null, "").label("Address"),
    contactPerson: Joi.string().required().max(255).label("Contact Person"),
    contactPersonEmail: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label(`Contact Person Email`),
    telephone: Joi.string()
      .pattern(/\d/)
      .max(8)
      .min(8)
      .allow(null, "")
      .label("Telephone"),
    chargeable: Joi.boolean(),
    jobCategory: Joi.string(),
    productVendor: JoiObjectId().required().label("Product Vendor"),
    ticketNumber: Joi.string()
      .pattern(/\d/)
      .max(8)
      .min(8)
      .required()
      .label("Ticket Number"),
    actionTaken: Joi.string().max(2500).required().label("Action Taken"),
    remark: Joi.string().max(255).allow(null, "").label("Remark"),
    swapReason: Joi.string(),
    partNumber: Joi.when("swapReason", {
      not: "N/A",
      then: Joi.array().items(
        Joi.object({
          to: Joi.string().max(255).required().label("New Serial Number"),
          from: Joi.string().max(255).required().label("Old Serial Number"),
          partNo: Joi.string().max(255).required().label("Part Number"),
        })
      ),
    }),
    movementType: Joi.string().allow(null, "").label("Movement Type"),
    movementRemark: Joi.string().allow(null, "").label("Movement Remark"),
    customerSignature: Joi.string().required().label("Signature"),
    userSignature: Joi.string().required().label("User's Signature"),
    reportNumber: Joi.any(),
    signedByUser: Joi.string().max(255),
    signedBy: Joi.string().max(255).allow(null, ""),
    owner: JoiObjectId().allow(null, ""),
  };

  async componentDidMount() {
    try {
      const { data: allProductVendors } = await getProductVendors();
      const productVendors = [{ key: " " }, ...allProductVendors];

      const data = { ...this.state.data };
      const user = this.props.user;

      data.userSignature = user.userSignature;
      data.signedByUser = user.name;

      const reportId = this.props.match.params.id;
      if (reportId === "new")
        return this.setState({
          data,
          productVendors,
        });

      if (reportId.substring(0, 8) === "template") {
        const { data: template } = await findTemplate(
          reportId.substring(
            reportId.lastIndexOf("template=") + "template=".length
          )
        );
        delete template._id;
        return this.setState({
          data: this.mapToViewModel(template),
          productVendors,
        });
      } else if (reportId.substring(0, 7) === "request") {
        const { data: request } = await findPendingRequest(
          reportId.substring(
            reportId.lastIndexOf("request=") + "request=".length
          )
        );

        return request.deny
          ? this.setState({
              data: this.mapToViewModel(request),

              request: true,
              deny: request.deny,
              productVendors,
            })
          : this.setState({
              data: this.mapToViewModel(request),

              request: true,
              disabled: true,
              deny: request.deny,
              productVendors,
            });
      } else {
        const { data: report } = await getServiceReport(reportId);
        return this.setState({
          data: this.mapToViewModel(report),
          disabled: true,
          productVendors,
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  mapToViewModel(report) {
    return {
      _id: report._id,
      companyName: report.companyName,
      site: report.site,
      address: report.address,
      contactPerson: report.contactPerson,
      contactPersonEmail: report.contactPersonEmail,
      telephone: report.telephone,
      productVendor: report.productVendor,
      ticketNumber: report.ticketNumber,
      actionTaken: report.actionTaken,
      remark: report.remark,
      chargeable: report.chargeable,
      serviceDateTime: report.serviceDateTime,
      completedDateTime: report.completedDateTime,
      jobCategory: report.jobCategory,
      swapReason: report.swapReason,
      partNumber: report.partNumber,
      movementType: report.movementType,
      movementRemark: report.movementRemark,
      reportNumber: report.reportNumber,
      customerSignature: report.customerSignature,
      userSignature: report.userSignature,
      signedByUser: report.signedByUser,
      signedBy: report.signedBy,
      owner: report.owner,
    };
  }

  doSubmit = async () => {
    try {
      const data = { ...this.state.data };
      data.signedBy = data.contactPerson;
      await saveServiceReport(data);
      this.props.history.push("/main");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handleTemplate = async (e) => {
    e.preventDefault();

    try {
      const data = { ...this.state.data };
      data.customerSignature = "";
      await createTemplate(data);
      this.props.history.push("/template");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handlePending = async (e) => {
    e.preventDefault();

    try {
      const data = { ...this.state.data };

      data.customerSignature = "";
      data["deny"] = false;

      await savePendingRequest(data);
      this.props.history.push("/myreports");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handlePartNumber = ({ currentTarget }) => {
    const data = { ...this.state.data };
    if (data.swapReason === "" || data.swapReason === "N/A") {
      data.partNumber = [{ partNo: "", from: "", to: "" }];
    } else
      data.partNumber[currentTarget.id][currentTarget.name] =
        currentTarget.value;
    this.setState({ data });
  };

  handleAddItem = () => {
    const data = { ...this.state.data };
    data.partNumber.push({ partNo: "-", from: "-", to: "-" });
    this.setState({ data });
  };

  handleSubItem = () => {
    const data = { ...this.state.data };

    data.partNumber.pop();

    this.setState({ data });
  };

  handleReset = () => {
    this.setState({
      data: {
        companyName: "",
        site: "",
        address: "",
        contactPerson: "",
        contactPersonEmail: "",
        telephone: "",
        productVendor: "",
        ticketNumber: "",
        actionTaken: "",
        remark: "",
        chargeable: false,
        serviceDateTime: moment().toDate(),
        completedDateTime: moment().add(1, "minutes").toDate(),
        partNumber: [{ partNo: "-", from: "-", to: "-" }],
        movementType: "",
        movementRemark: "",
        jobCategory: "Post-Sale",
        swapReason: "N/A",
        reportNumber: "",
        customerSignature: "",
      },
    });
  };

  handleApprove = async () => {
    try {
      const user = this.props.user;
      const { data } = this.state;
      const requestId = data._id;

      data.signedBy = user.name;
      data.customerSignature = user.userSignature;
      delete data["_id"];
      delete data["deny"];
      delete data["denyMessage"];
      await saveServiceReport(data);
      await deletePendingRequest(requestId);
      await patchUser(user._id, "request", { requestId });

      window.location = "/main";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const {
      chargable,
      jobCategory,
      swapReason,
      data,
      disabled,
      movementRemark,
      movementType,
      errors,
      request,
      deny,
      productVendors,
    } = this.state;

    return (
      <div className="pb-4 d-flex justify-content-center">
        <form
          className="report-create text-center curved-border"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <div className="row">
            <span className="col-md-6  text-left ">
              <h1 className="h3 font-weight-normal mb-0">
                {data.reportNumber ? "Service Report" : "New Service Report"}
              </h1>
              {data.reportNumber ? (
                <span className="h5 font-weight-normal mb-0 text-danger">
                  No.{data.reportNumber}
                </span>
              ) : null}
            </span>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderDateTimePicker({
                name: "serviceDateTime",
                label: "Service Date Time",
                require: true,
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderDateTimePicker({
                name: "completedDateTime",
                label: "Completed Date Time",
                require: true,
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderInput({
                name: "companyName",
                label: "Company Name",
                require: true,
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderInput({ name: "site", label: "Site", disabled })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderInput({
                name: "address",
                label: "Address",
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderInput({
                name: "contactPerson",
                label: "Contact Person",
                require: true,
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderInput({
                name: "contactPersonEmail",
                label: "Contact Person Email",
                require: true,
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderInput({
                name: "telephone",
                label: "Telephone",
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderSelect({
                name: "chargeable",
                label: "Chargeable",
                options: chargable,
                require: true,
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderSelect({
                name: "jobCategory",
                label: "Job Category",
                options: jobCategory,
                require: true,
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 ">
              {this.renderSelect({
                name: "productVendor",
                label: "Product Vendor",
                options: productVendors,
                require: true,
                disabled,
              })}
            </div>
            <div className="col-md-6 ">
              {this.renderInput({
                name: "ticketNumber",
                label: "Ticket Number",
                require: true,
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              {this.renderTextArea({
                name: "actionTaken",
                label: "Action Taken",
                require: true,
                rows: "5",
                disabled,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              {this.renderTextArea({
                name: "remark",
                label: "Remark",
                rows: "2",
                disabled,
              })}
            </div>
          </div>
          <div className="row ">
            <div className="col-md-4 ">
              {this.renderSelect({
                name: "swapReason",
                label: "Hardware Movement",
                options: swapReason,
                require: true,
                customize: true,
                customSelectChange: (e) => this.handleCustomSelectChange(e),
                disabled,
              })}
            </div>
            <div className="col-md-4 ">
              {data.swapReason === "N/A"
                ? null
                : this.renderSelect({
                    name: "movementType",
                    label: "Movement Type",
                    options: movementType,
                    require: true,
                    disabled,
                  })}
            </div>
            <div className="col-md-4 ">
              {data.swapReason === "N/A"
                ? null
                : this.renderSelect({
                    name: "movementRemark",
                    label: "Movement Remark",
                    options: movementRemark,
                    require: true,
                    disabled,
                  })}
            </div>
          </div>
          <PartNumInputGrp
            swapReason={data.swapReason}
            handlePartNumber={(e) => this.handlePartNumber(e)}
            partNumber={data.partNumber}
            onAddItem={() => this.handleAddItem()}
            onSubItem={() => this.handleSubItem()}
            disabled={disabled}
            error={errors.partNumber}
            require={true}
          />
          <div className="row text-left ">
            <div className="col-md-12 ">
              <label>
                I/We* undersigned confirmed that the equipment has been serviced
                and in working condition. Cost of parts replaced due to
                accident, neglects, abuse, misuse of any other apart from
                oridinary use of equipment shall be bome by the user.
              </label>
            </div>
          </div>
          <div className="row ">
            <div className="col-md-12 ">
              {this.renderSignPad({
                name: "customerSignature",
                label: "Customer Signature",
                signedBy: data.signedBy,
                completedDateTime: data.completedDateTime,
                disabled: deny || disabled,
              })}
            </div>
          </div>
          <div className="row ">
            <div className="col-md-12">
              {this.renderButton("Back", "secondary m-1", () =>
                this.props.history.goBack()
              )}

              {!disabled &&
                !deny &&
                this.renderButton("Template", "primary m-1", (e) =>
                  this.handleTemplate(e)
                )}
              {(!disabled || (request && deny)) &&
                this.renderButton("Manager", "warning m-1", (e) =>
                  this.handlePending(e)
                )}

              {!disabled &&
                !deny &&
                this.renderButton("Reset", "danger m-1", () =>
                  this.handleReset()
                )}
              {!disabled &&
                !deny &&
                this.renderSubmitButton("Submit", "success m-1")}
            </div>
          </div>
          {errors.error && (
            <div className="row">
              <div className="col-md-12  ">
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

export default ReportForm;
