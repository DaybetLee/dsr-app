import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import React, { Component } from "react";

import ProtectedRoute from "./components/common/protectedRoutes";
import { getCurrentUserToken } from "./services/authService";
import ReportSettings from "./components/productList";
import TemplateList from "./components/templateList";
import UserSettings from "./components/userSettings";
import Error404 from "./components/common/error404";
import Loading from "./components/common/loading";
import ReportFrom from "./components/reportForm";
import ReportList from "./components/reportList";
import UserReport from "./components/userReport";
import { getUser } from "./services/userService";
import { ToastContainer } from "react-toastify";
import LoginForm from "./components/loginForm";
import "react-toastify/dist/ReactToastify.css";
import { userPriority } from "./config.json";
import Request from "./components/request";
import Navbar from "./components/navBar";
import Logout from "./components/logout";
import User from "./components/userForm";

class App extends Component {
  state = { user: {}, reports: [], currentPage: 1, rendered: false };

  async componentDidMount() {
    const token = getCurrentUserToken();
    if (token) {
      const { data: user } = await getUser(token._id);
      this.setState({ user, rendered: true });
    } else {
      this.setState({ user: null, rendered: true });
    }
  }

  onSearch = (reports) => {
    reports.length === 0
      ? this.setState({ reports: [{ _id: null }] })
      : this.setState({ reports });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleUpdateUser = async () => {
    const orignalUser = { ...this.state };
    try {
      const user = await getUser(orignalUser._id);
      this.setState({ user, rendered: true });
    } catch (ex) {}
  };

  render() {
    const { user, reports, currentPage, rendered } = this.state;

    if (!rendered) return <Loading />;
    return (
      <React.Fragment>
        {user && (
          <ProtectedRoute
            to="/main"
            render={(props) => (
              <Navbar
                user={user}
                onSearch={(searchQuery) => this.onSearch(searchQuery)}
                onPageChange={(page) => this.handlePageChange(page)}
                {...props}
              />
            )}
          />
        )}
        <ToastContainer hideProgressBar />
        <div className="container-fluid">
          <main className="container py-4">
            <Switch>
              <Redirect from="/" exact to="/login" />

              <ProtectedRoute
                path="/myreports"
                render={(props) => (
                  <UserReport
                    reports={reports}
                    onPageChange={(page) => this.handlePageChange(page)}
                    currentPage={currentPage}
                    user={user}
                    {...props}
                  />
                )}
              />
              <Route
                path="/main"
                render={(props) => {
                  if (user) {
                    if (userPriority[user.role] === userPriority["user"])
                      return <Redirect to="/myreports" {...props} />;
                    return (
                      <ReportList
                        reports={reports}
                        onPageChange={(page) => this.handlePageChange(page)}
                        currentPage={currentPage}
                        user={user}
                        {...props}
                      />
                    );
                  }
                  return <LoginForm {...props} />;
                }}
              />

              <ProtectedRoute
                path="/report/:id"
                render={(props) => <ReportFrom user={user} {...props} />}
              />

              <ProtectedRoute
                path="/request"
                render={(props) => (
                  <Request
                    onUpdateUser={() => this.handleUpdateUser()}
                    user={user}
                    {...props}
                  />
                )}
              />

              <ProtectedRoute
                path="/template"
                render={(props) => <TemplateList user={user} {...props} />}
              />
              <ProtectedRoute path="/user/:id" component={User} />
              <ProtectedRoute path="/user" component={UserSettings} />
              <ProtectedRoute
                path="/report_settings"
                component={ReportSettings}
              />

              <Route
                path="/login"
                render={(props) => {
                  if (user) {
                    if (userPriority[user.role] === userPriority["user"])
                      return <Redirect to="/myreports" {...props} />;
                    return <Redirect to="/main" {...props} />;
                  }
                  return <LoginForm {...props} />;
                }}
              />
              <ProtectedRoute path="/logout" component={Logout} />
              <ProtectedRoute path="/error" component={Error404} />
              <Redirect from="/" exact to="/login" />
              <Redirect to="/error" />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
