import React, { Component } from "react";

import UserList from "./userList";
import BusinessUnitList from "./businessUnitList";
import ComposeBtn from "./common/composeBtn";
import Loading from "./common/loading";

class UserSettings extends Component {
  state = {
    rendered: true,
  };

  render() {
    const { rendered } = this.state;
    if (!rendered) return <Loading />;
    return (
      <React.Fragment>
        <UserList />
        <BusinessUnitList />
        <ComposeBtn path="/user/new" label="User" signature="dummy" />
      </React.Fragment>
    );
  }
}

export default UserSettings;
