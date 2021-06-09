import React from "react";

import Table from "./common/table";
import EditProduct from "./editProduct";

const ProductListTable = ({ products, onSort, sortColumn, onDelete }) => {
  const columns = [
    {
      label: "Name",
      path: "name",
    },
    {
      key: "buttons",
      content: (product) => (
        <div className="text-right">
          <EditProduct product={product} />
          <button
            className="btn btn-sm btn-danger ml-2"
            onClick={() => onDelete(product)}
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
      data={products}
    />
  );
};

export default ProductListTable;
