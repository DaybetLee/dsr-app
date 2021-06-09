import React, { Component } from "react";
import _ from "lodash";

import { deleteBusinessUnit, getBusinessUnits } from "../services/businessUnit";
import BusinessUnitListTable from "./businessUnitListTable";
import EditBusinessUnit from "./editBusinessUnit";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import Loading from "./common/loading";

class BusinessUnitList extends Component {
  state = {
    businessUnits: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    rendered: false,
  };

  async componentDidMount() {
    const { data: businessUnits } = await getBusinessUnits();

    this.setState({ businessUnits, rendered: true });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page, rendered: true });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleDelete = async (businessUnit) => {
    const orignal = [...this.state.businessUnits];
    const businessUnits = orignal.filter((t) => t !== businessUnit);
    this.setState({ businessUnits, currentPage: 1 });

    try {
      await deleteBusinessUnit(businessUnit._id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ businessUnits: orignal, currentPage: 1 });
      }
    }
  };

  render() {
    const {
      businessUnits: allBusinessUnit,
      pageSize,
      currentPage,
      sortColumn,
      rendered,
    } = this.state;

    if (!rendered) return <Loading />;

    const sorted = _.orderBy(
      allBusinessUnit,
      [sortColumn.path],
      [sortColumn.order]
    );

    const businessUnits = paginate(sorted, currentPage, pageSize);

    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                <h5>Business Units</h5>
              </div>
              <div className="col text-right">
                <label>
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + businessUnits.length
                  } of ${businessUnits.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div className="text-right">
              <EditBusinessUnit businessUnit={{ _id: "" }} />
            </div>

            <div className="row">
              <div className="col overflow-auto">
                <BusinessUnitListTable
                  businessUnits={businessUnits}
                  sortColumn={sortColumn}
                  onSort={(path) => this.handleSort(path)}
                  onDelete={(product) => this.handleDelete(product)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Pagination
                  itemsCount={allBusinessUnit.length}
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

export default BusinessUnitList;
