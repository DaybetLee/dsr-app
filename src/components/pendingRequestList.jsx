import _ from "lodash";
import React, { Component } from "react";

import PendingReportListTable from "./pendingReportListTable";
import { patchUser } from "../services/userService";
import {
  deletePendingRequest,
  getMyRequest,
} from "./../services/pendingReportService";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";

class pendingRequestList extends Component {
  state = {
    requests: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "reportNumber", order: "asc" },
  };

  async componentDidMount() {
    const { data: requests } = await getMyRequest(false);

    this.setState({
      requests,
    });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleWithdraw = async ({ _id: requestId }) => {
    try {
      const user = this.props.user;
      const allRequests = this.state.requests;

      await deletePendingRequest(requestId);
      await patchUser(user.manager, "request", { requestId });
      const requests = allRequests.filter((r) => r._id === requestId);
      this.setState({ requests });

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

    const { users } = this.props;

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
                <h5>Pending Approval</h5>
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
                <PendingReportListTable
                  users={users}
                  requests={requests}
                  sortColumn={sortColumn}
                  onSort={(path) => this.handleSort(path)}
                  onWithraw={(request) => this.handleWithdraw(request)}
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

export default pendingRequestList;
