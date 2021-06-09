import _ from "lodash";
import React, { Component } from "react";

import RequestReportListTable from "./requestReportListTable";
import { saveServiceReport } from "../services/reportService";
import { patchUser } from "../services/userService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import {
  deletePendingRequest,
  getMyPendingRequest,
} from "./../services/pendingReportService";

class requestReportList extends Component {
  state = {
    requests: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "reportNumber", order: "asc" },
  };

  async componentDidMount() {
    const { data: requests } = await getMyPendingRequest();

    this.setState({ requests });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleApprove = async (request) => {
    try {
      const user = this.props.user;
      const requestId = request._id;
      request.signedBy = user.name;
      request.customerSignature = user.userSignature;
      delete request["_id"];
      delete request["deny"];
      delete request["denyMessage"];

      await saveServiceReport(request);
      await deletePendingRequest(requestId);
      await patchUser(user._id, "request", { requestId });

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
    const {
      requests: allRequests,
      pageSize,
      currentPage,
      sortColumn,
    } = this.state;

    const { user, users } = this.props;

    const sorted = _.orderBy(
      allRequests,
      [sortColumn.path],
      [sortColumn.order]
    );

    const requests = paginate(sorted, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                <h5>Signing Requests</h5>
              </div>
              <div className="col text-right">
                <label>
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + requests.length
                  } of ${allRequests.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col overflow-auto">
                <RequestReportListTable
                  users={users}
                  requests={requests}
                  sortColumn={sortColumn}
                  onApprove={(request) => this.handleApprove(request)}
                  onSort={(path) => this.handleSort(path)}
                  user={user}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Pagination
                  itemsCount={allRequests.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={(sortColumn) =>
                    this.handlePageChange(sortColumn)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default requestReportList;
