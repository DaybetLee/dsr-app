import _ from "lodash";
import React, { Component } from "react";

import { getProductVendors } from "./../services/productVendor";
import { getUsers } from "../services/userService";
import ReportListTable from "./reportListTable";
import { userPriority } from "../config.json";
import ComposeBtn from "./common/composeBtn";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import Loading from "./common/loading";
import {
  getServiceReports,
  getMyServiceReport,
} from "./../services/reportService";

class reportList extends Component {
  state = {
    reports: [],
    pageSize: 4,
    sortColumn: { path: "reportNumber", order: "asc" },
    rendered: false,
    users: [],
    productVendors: [],
  };

  async componentDidMount() {
    if (!this.props.user) return this.props.location.push("/login");

    const { data: users } = await getUsers();
    const { data: productVendors } = await getProductVendors();
    users.shift();

    const { data: reports } =
      this.props.match.path === "/myreports"
        ? await getMyServiceReport()
        : await getServiceReports();

    this.setState({
      reports,
      rendered: true,
      users,
      productVendors,
    });
  }

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (search, allReports) => {
    return search.length > 0 ? search : allReports;
  };

  render() {
    const {
      reports: allReports,
      pageSize,
      sortColumn,
      rendered,
      productVendors,
      users,
    } = this.state;

    const user = this.props.user;

    if (!rendered) return <Loading />;

    const { reports: search, currentPage, onPageChange } = this.props;

    const filtered = this.handleSearch(search, allReports);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const reports = paginate(sorted, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                {this.props.match.path === "/myreports" ? (
                  <h5 className="font-weight-bold">My Reports</h5>
                ) : (
                  <h3 className="">All Reports</h3>
                )}
              </div>
              <div className="col text-right">
                <label className="pt-2 ">
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + reports.length
                  } of ${filtered.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col overflow-auto">
                <ReportListTable
                  reports={reports}
                  sortColumn={sortColumn}
                  onSort={(path) => this.handleSort(path)}
                  path={this.props.match.path}
                  users={users}
                  user={user}
                  productVendors={productVendors}
                />
              </div>
            </div>
            <div className="row ">
              <div className="col">
                <Pagination
                  itemsCount={filtered.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={(sortColumn) => onPageChange(sortColumn)}
                />
              </div>
            </div>
          </div>
        </div>
        {userPriority[user.role] < userPriority["admin"] && (
          <ComposeBtn
            path="/report/new"
            label="Report"
            signature={user.userSignature}
          />
        )}
      </React.Fragment>
    );
  }
}

export default reportList;
