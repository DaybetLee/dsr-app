import React, { Component } from "react";

import PendingRequestList from "./pendingRequestList";
import { getUsers } from "./../services/userService";
import RequestReportList from "./requestReportList";
import DenyRequestList from "./denyRequestList";
import { userPriority } from "../config.json";
import Loading from "./common/loading";

class Request extends Component {
  state = { users: [], rendered: false };

  async componentDidMount() {
    const { data: users } = await getUsers();
    users.shift();

    this.setState({
      users,
      rendered: true,
    });
  }

  render() {
    const { users, rendered } = this.state;

    if (!rendered) return <Loading />;
    const props = this.props;

    if (!props.user) return props.location.push("/login");

    return (
      <div>
        {userPriority[props.user.role] === userPriority["manager"] && (
          <RequestReportList {...props} users={users} />
        )}
        <PendingRequestList {...props} users={users} />
        <DenyRequestList {...props} users={users} />
      </div>
    );
  }
}

export default Request;
