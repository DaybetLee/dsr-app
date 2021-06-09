import _ from "lodash";
import React, { Component } from "react";

import ProductListTable from "./productListTable";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import EditProduct from "./editProduct";
import Loading from "./common/loading";
import {
  deleteProductVendor,
  getProductVendors,
} from "../services/productVendor";

class ProductList extends Component {
  state = {
    products: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    rendered: false,
  };

  async componentDidMount() {
    const { data: products } = await getProductVendors();
    this.setState({ products, rendered: true });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleDelete = async (product) => {
    const orignal = [...this.state.products];
    const products = orignal.filter((t) => t !== product);
    this.setState({ products, currentPage: 1 });

    try {
      await deleteProductVendor(product._id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ products: orignal, currentPage: 1 });
      }
    }
  };

  render() {
    const {
      products: allProduct,
      pageSize,
      currentPage,
      sortColumn,
      rendered,
    } = this.state;

    if (!rendered) return <Loading />;

    const sorted = _.orderBy(allProduct, [sortColumn.path], [sortColumn.order]);

    const products = paginate(sorted, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                <h5>Product Vendors</h5>
              </div>
              <div className="col text-right">
                <label>
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + products.length
                  } of ${allProduct.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div className="text-right">
              <EditProduct product={{ _id: "" }} />
            </div>

            <div className="row">
              <div className="col overflow-auto">
                <ProductListTable
                  products={products}
                  sortColumn={sortColumn}
                  onSort={(path) => this.handleSort(path)}
                  onDelete={(product) => this.handleDelete(product)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Pagination
                  itemsCount={allProduct.length}
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
      </React.Fragment>
    );
  }
}

export default ProductList;
