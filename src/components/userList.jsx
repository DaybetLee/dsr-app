import _ from "lodash";
import React, { Component } from "react";

import { getUsers, deleteUser } from "./../services/userService";
import { deleteTemplate } from "../services/templateService";
import { paginate } from "./../utils/paginate";
import Pagination from "./common/pagination";
import ComposeBtn from "./common/composeBtn";
import UserListTable from "./userListTable";
import Loading from "./common/loading";
import { getBusinessUnits } from "./../services/businessUnit";

class UserList extends Component {
  state = {
    users: [],
    businessUnits: [],
    pageSize: 2,
    currentPage: 1,
    sortColumn: { path: "reportNumber", order: "asc" },
    rendered: false,
  };

  async componentDidMount() {
    const { data: users } = await getUsers();
    const { data: businessUnits } = await getBusinessUnits();
    users.shift();
    this.setState({ users, businessUnits, rendered: true });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleDelete = async (user) => {
    const orignal = [...this.state.users];
    const users = orignal.filter((m) => m !== user);
    this.setState({ users, currentPage: 1 });

    try {
      await deleteUser(user._id);
      await deleteTemplate({ user: user._id });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ users: orignal, currentPage: 1 });
      }
    }
  };

  render() {
    const {
      users: allUsers,
      businessUnits,
      pageSize,
      currentPage,
      sortColumn,
      rendered,
    } = this.state;

    if (!rendered) return <Loading />;

    const sorted = _.orderBy(allUsers, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                <h3 className="">Users</h3>
              </div>
              <div className="col text-right">
                <label className="pt-2 ">
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + users.length
                  } of ${allUsers.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div className="row">
              <div className="col overflow-auto">
                <UserListTable
                  users={users}
                  sortColumn={sortColumn}
                  onSort={(path) => this.handleSort(path)}
                  onDelete={(user) => this.handleDelete(user)}
                  businessUnits={businessUnits}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Pagination
                  itemsCount={allUsers.length}
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

        <ComposeBtn path="/user/new" label="User" signature="dummy" />
      </React.Fragment>
    );
  }
}

export default UserList;
