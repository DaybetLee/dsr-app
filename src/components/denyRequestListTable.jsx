import React from "react";
import { Link } from "react-router-dom";

import Table from "./common/table";

const DenyReportListTable = ({
  requests,
  onSort,
  sortColumn,
  users,
  onWithraw,
}) => {
  const columns = [
    {
      label: "Requestor",
      path: "owner",
      content: (request) =>
        users.filter((user) => user._id === request.owner)[0].name,
    },
    { label: "Ticket No.", path: "ticketNumber" },
    { label: "Company", path: "companyName" },

    {
      label: "Reject Reason",
      path: "denyMessage",
    },
    {
      key: "buttons",
      content: (request) => (
        <div className="text-center">
          <Link
            className="btn btn-sm btn-primary"
            to={`/report/request=${request._id}`}
          >
            Edit
          </Link>
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={() => onWithraw(request)}
          >
            Withdraw
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      onSort={(column) => onSort(column)}
      sortColumn={sortColumn}
      data={requests}
    />
  );
};

export default DenyReportListTable;
