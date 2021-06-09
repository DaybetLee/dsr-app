import React from "react";
import { Link } from "react-router-dom";

import Table from "./common/table";

const TemplateListTable = ({
  templates,
  onSort,
  sortColumn,
  onDelete,
  onClone,
  productVendors,
}) => {
  const columns = [
    { label: "Company Name", path: "companyName" },
    { label: "Contact Person", path: "contactPerson" },
    {
      label: "Product Vendor",
      path: "productVendor",
      content: (report) =>
        productVendors.filter(
          (productVendor) => productVendor._id === report.productVendor
        )[0].name,
    },
    { label: "Hardware Movement", path: "swapReason" },
    {
      key: "buttons",
      content: (template) => (
        <div className="text-center">
          <Link
            className="btn btn-sm btn-primary mx-2"
            to={`/report/template=${template._id}`}
          >
            Edit
          </Link>
          <button
            className="btn btn-sm btn-danger "
            onClick={() => onDelete(template)}
          >
            Delete
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
      data={templates}
    />
  );
};

export default TemplateListTable;
