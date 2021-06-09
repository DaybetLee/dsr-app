import React from "react";
import PropTypes from "prop-types";

const TableHeader = ({ columns, onSort, sortColumn }) => {
  const doSort = ({ path }) => {
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    onSort(sortColumn);
  };

  const renderSortIcon = ({ path }) => {
    const classes = "fas fa-sort-";
    if (!path || sortColumn.path !== path) return null;
    return sortColumn.order === "asc" ? classes + "up" : classes + "down";
  };

  return (
    <thead className="thead-light">
      <tr>
        {columns.map((column) => (
          <th
            className="p-2 align-middle"
            style={column.path && { cursor: "pointer" }}
            onClick={() => column.path && doSort(column)}
            key={column.key || column.label}
          >
            {column.label} {<i className={renderSortIcon(column)} />}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;

TableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortColumn: PropTypes.object.isRequired,
};
