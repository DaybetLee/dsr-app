import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Table from "./common/table";

const UserListTable = ({
  users,
  onSort,
  sortColumn,
  onDelete,
  businessUnits,
}) => {
  const columns = [
    {
      label: "Staff Number",
      path: "staffNumber",
    },
    { label: "Name", path: "name" },
    { label: "Email", path: "email" },
    { label: "Role", path: "role" },
    {
      label: "Business Unit",
      path: "businessUnit",
      content: (user) =>
        businessUnits.filter(
          (businessUnit) => businessUnit._id === user.businessUnit
        )[0].name,
    },
    {
      key: "buttons",
      content: (user) => (
        <div className="text-center">
          <Link
            className="btn btn-sm btn-primary mr-2"
            to={`/user/${user._id}`}
          >
            Edit
          </Link>
          <button
            className="btn btn-sm btn-danger "
            data-toggle="modal"
            data-target={"#" + user.staffNumber}
          >
            Delete
          </button>
          <div
            className="modal fade"
            id={user.staffNumber}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered "
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header bg-secondary" />
                <div className="modal-body pb-0 pt-3 text-left text-wrap ">
                  <i className="fas fa-exclamation-triangle text-warning fa-2x px-2" />
                  <span className="font-weight-bold" id="exampleModalLabel">
                    Are you sure your want to delete user "{user.name}"?
                  </span>
                  <p className="pl-2">
                    This user will be deleted immediately. You can't undo this
                    action.
                  </p>
                </div>
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-secondary mr-4"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      onSort={(column) => onSort(column)}
      sortColumn={sortColumn}
      data={users}
    />
  );
};

export default UserListTable;

UserListTable.propTypes = {
  users: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortColumn: PropTypes.object.isRequired,
};
