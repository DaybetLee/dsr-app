import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Table from "./common/table";
import Forward from "./common/forward";
import { userPriority } from "../config.json";

const ReportListTable = ({
  reports,
  onSort,
  sortColumn,
  path,
  users,
  user,
  productVendors,
}) => {
  const deleteColumn = {
    key: "forward",
    content: (report) => <Forward report={report} />,
  };

  const columns = [
    {
      label: "Report No.",
      path: "reportNumber",
      content: (report) => (
        <Link to={`/report/${report._id}`}>{report.reportNumber}</Link>
      ),
    },
    {
      label: "Owner",
      path: "owner",
      content: (report) =>
        users.filter((user) => user._id === report.owner)[0].name,
    },
    { label: "Ticket No.", path: "ticketNumber" },
    { label: "Company", path: "companyName" },
    {
      label: "Product",
      path: "productVendor",
      content: (report) =>
        productVendors.filter(
          (productVendor) => productVendor._id === report.productVendor
        )[0].name,
    },
    {
      label: "Service Date",
      path: "serviceDateTime",
      content: (report) =>
        report.serviceDateTime
          ? moment(report.serviceDateTime).format("DD/MM/YY HH:mm")
          : null,
    },
    {
      label: "Job Category",
      path: "jobCategory",
    },
    {
      label: "Hardware Replacement",
      path: "swapReason",
    },
  ];

  if (
    user &&
    userPriority[user.role] < userPriority["admin"] &&
    path === "/myreports"
  )
    columns.push(deleteColumn);

  return (
    <Table
      columns={columns}
      onSort={(column) => onSort(column)}
      sortColumn={sortColumn}
      data={reports}
    />
  );
};

export default ReportListTable;

ReportListTable.propTypes = {
  reports: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortColumn: PropTypes.object.isRequired,
};
