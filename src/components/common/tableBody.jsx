import _ from "lodash";
import React, { Component } from "react";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path);
  };

  createKey = (item, column, rowIndex, colIndex) => {
    return item._id + (column.path || column.key) + rowIndex + colIndex;
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={item._id}>
            {columns.map((column, colIndex) => (
              <td
                className="p-2 align-middle"
                key={this.createKey(item, column, rowIndex, colIndex)}
              >
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
