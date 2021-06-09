import React from "react";

import Table from "./common/table";
import EditBusinessUnit from "./editBusinessUnit";

const BusinessUnitListTable = ({
  businessUnits,
  onSort,
  sortColumn,
  onDelete,
}) => {
  const columns = [
    {
      label: "Name",
      path: "name",
    },
    {
      label: "Description",
      path: "description",
    },
    {
      key: "buttons",
      content: (businessUnit) => (
        <div className="text-right">
          <EditBusinessUnit businessUnit={businessUnit} />
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={() => onDelete(businessUnit)}
          >
            delete
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
      data={businessUnits}
    />
  );
};

export default BusinessUnitListTable;
