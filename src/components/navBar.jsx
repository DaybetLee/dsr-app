import Joi from "joi";
import React from "react";

import Logo from "../assets/brands/android-chrome-512x512.svg";
import { userPriority } from "../config.json";
import { NavLink } from "react-router-dom";
import Form from "./common/form";
import {
  getServiceReports,
  getMyServiceReport,
} from "./../services/reportService";

class Navbar extends Form {
  state = { data: { searchQuery: "" } };

  schema = {
    searchQuery: Joi.string(),
  };

  doSubmit = async () => {
    try {
      const { onSearch, onPageChange, history } = this.props;
      const data = { ...this.state.data };
      const { data: reports } = await getServiceReports(data.searchQuery);
      onSearch(reports);
      onPageChange(1);
      history.push("/main");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handleClear = async () => {
    this.setState({ data: { searchQuery: "" } });
    let reports;

    try {
      if (this.props.location.pathname === "/myreports") {
        reports = await getMyServiceReport();
      }
      if (this.props.location.pathname === "/main") {
        reports = await getServiceReports();
      }

      this.props.onSearch(reports);
      this.props.onPageChange(1);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { data } = this.state;
    const user = this.props.user;

    if (!user) return null;

    return (
      <nav className="navbar navbar-dark bg-dark justify-content-between align-items-center navbar-expand-lg fixed-top">
        <img
          src={Logo}
          alt=""
          className="img-fluid bg-light border border-white mr-4 rounded"
          width="35"
        />
        <form className="flex-fill " onSubmit={(e) => this.handleSubmit(e)}>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text pr-1 border-white bg-white">
                <i className="fas fa-search" />
              </span>
            </div>
            <input
              style={{
                width: "100px",
              }}
              type="text"
              name="searchQuery"
              onChange={(e) => this.handleChange(e)}
              value={data["searchQuery"]}
              className="form-control searchBar pl-1 border-white"
              placeholder="Search report"
            />
            {data.searchQuery && (
              <div className="input-group-append">
                <button
                  className="input-group-text border-white bg-white"
                  type="button"
                  onClick={() => this.handleClear()}
                >
                  <i className="fas fa-times clickable-icon" />
                </button>
              </div>
            )}
          </div>
        </form>
        <button
          className="navbar-toggler ml-3"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            {userPriority[user.role] < userPriority["admin"] && (
              <React.Fragment>
                <li className="nav-item ml-auto">
                  <NavLink
                    onClick={() => this.handleClear()}
                    className="nav-link"
                    to="/myreports"
                  >
                    My Reports <i className="fas fa-portrait ml-1" />
                  </NavLink>
                </li>

                <li className="nav-item ml-auto">
                  <NavLink
                    onClick={() => this.handleClear()}
                    className="nav-link"
                    to="/template"
                  >
                    Template <i className="far fa-copy ml-1" />
                  </NavLink>
                </li>

                <li className="nav-item ml-auto">
                  <NavLink
                    onClick={() => this.handleClear()}
                    className="nav-link"
                    to="activation"
                  >
                    My Activation{" "}
                    <i className="fas fa-file-invoice-dollar ml-1" />
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {userPriority[user.role] > userPriority["user"] && (
              <li className="nav-item ml-auto ">
                <NavLink
                  onClick={() => this.handleClear()}
                  className="nav-link"
                  to="/main"
                >
                  All Reports <i className="fas fa-file-contract ml-1" />
                </NavLink>
              </li>
            )}
            {userPriority[user.role] > userPriority["manager"] && (
              <li className="nav-item ml-auto">
                <NavLink
                  onClick={() => this.handleClear()}
                  className="nav-link"
                  to="/user"
                >
                  Users <i className="fas fa-users ml-1" />
                </NavLink>
              </li>
            )}
            {userPriority[user.role] > userPriority["manager"] && (
              <li className="nav-item ml-auto">
                <NavLink
                  onClick={() => this.handleClear()}
                  className="nav-link"
                  to="/report_settings"
                >
                  Report Settings <i className="fas fa-cog ml-1" />
                </NavLink>
              </li>
            )}
            {userPriority[user.role] < userPriority["admin"] && (
              <li className="nav-item ml-auto">
                <NavLink
                  onClick={() => this.handleClear()}
                  className="nav-link"
                  to="/request"
                >
                  Requests{" "}
                  {user.request.length > 0 ? (
                    <span className="badge badge-warning">
                      {user.request.length}
                    </span>
                  ) : (
                    <i className="fas fa-file-signature ml-1" />
                  )}
                </NavLink>
              </li>
            )}
            {
              <li className="nav-item ml-auto">
                <NavLink
                  onClick={() => this.handleClear()}
                  className="nav-link"
                  to="/logout"
                >
                  Signout
                  <i className="fas fa-sign-out-alt ml-1" />
                </NavLink>
              </li>
            }
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
