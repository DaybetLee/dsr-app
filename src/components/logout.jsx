import { Component } from "react";
import { logout } from "../services/authService";
import Loading from "./common/loading";

class Logout extends Component {
  componentDidMount() {
    logout();
    window.location = "/login";
  }

  render() {
    return <Loading />;
  }
}

export default Logout;
