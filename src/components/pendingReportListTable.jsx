import { Link } from "react-router-dom";
import moment from "moment";
import React from "react";

import Table from "./common/table";

const PendingReportListTable = ({
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
      label: "Service Date",
      path: "serviceDateTime",
      content: (report) =>
        report.serviceDateTime
          ? moment(report.serviceDateTime).format("DD/MM/YY HH:mm")
          : null,
    },
    {
      key: "buttons",
      content: (request) => (
        <div className="text-center">
          <Link
            className="btn btn-sm btn-secondary"
            to={`/report/request=${request._id}`}
          >
            View
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

export default PendingReportListTable;
