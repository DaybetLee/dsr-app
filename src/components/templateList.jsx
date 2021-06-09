import _ from "lodash";
import React, { Component } from "react";

import {
  getTemplate,
  deleteTemplate,
  createTemplate,
} from "./../services/templateService";
import Loading from "./common/loading";
import { paginate } from "./../utils/paginate";
import { userPriority } from "../config.json";
import ComposeBtn from "./common/composeBtn";
import Pagination from "./common/pagination";
import TemplateListTable from "./templateListTable";
import { getProductVendors } from "./../services/productVendor";

class TemplateList extends Component {
  state = {
    templates: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "_id", order: "asc" },
    rendered: false,
    productVendors: [],
  };

  async componentDidMount() {
    if (!this.props.user) return this.props.location.push("/login");

    const { data: templates } = await getTemplate();
    const { data: productVendors } = await getProductVendors();
    this.setState({
      templates,
      rendered: true,
      productVendors,
    });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleClone = async (template) => {
    try {
      await createTemplate(template);
      const { data: templates } = await getTemplate();
      this.setState({ templates });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.error = error.response.data;
        this.setState({ errors });
      }
    }
  };

  handleDelete = async (template) => {
    const orignal = [...this.state.templates];
    const templates = orignal.filter((t) => t !== template);
    this.setState({ templates, currentPage: 1 });

    try {
      await deleteTemplate({ id: template._id });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ templates: orignal, currentPage: 1 });
      }
    }
  };

  render() {
    const {
      templates: allTemplates,
      pageSize,
      currentPage,
      sortColumn,
      rendered,
      productVendors,
    } = this.state;

    const user = this.props.user;

    const sorted = _.orderBy(
      allTemplates,
      [sortColumn.path],
      [sortColumn.order]
    );

    const templates = paginate(sorted, currentPage, pageSize);

    if (!rendered) return <Loading />;
    return (
      <React.Fragment>
        <div className="card mb-4">
          <div className="card-header bg-white">
            <div className="row">
              <div className="col">
                <h3 className="">Templates</h3>
              </div>
              <div className="col text-right">
                <label className="pt-2 ">
                  {`${(currentPage - 1) * pageSize + 1}-${
                    (currentPage - 1) * pageSize + templates.length
                  } of ${allTemplates.length}`}
                </label>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col overflow-auto">
                <TemplateListTable
                  templates={templates}
                  sortColumn={sortColumn}
                  onDelete={(template) => this.handleDelete(template)}
                  onClone={(template) => this.handleClone(template)}
                  onSort={(path) => this.handleSort(path)}
                  productVendors={productVendors}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Pagination
                  itemsCount={allTemplates.length}
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
        {userPriority[user.role] < userPriority["admin"] && (
          <ComposeBtn
            path="/report/new"
            label="Report"
            signature={user.userSignature}
          />
        )}
      </React.Fragment>
    );
  }
}

export default TemplateList;
