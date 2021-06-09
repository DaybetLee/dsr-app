import React from "react";
import PropTypes from "prop-types";

import TableBody from "./tableBody";
import TableHeader from "./tableHeader";

const Table = ({ columns, sortColumn, onSort, data }) => {
  return (
    <table className="table table-bordered table-striped">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} />
    </table>
  );
};

export default Table;

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortColumn: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};
