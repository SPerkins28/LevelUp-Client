import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Home/Navbar";
import SearchBar from "./components/Home/SearchBar";
import MyAccount from "./components/SideBarPages/MyAccount";
import Library from "./components/SideBarPages/Library";
import WantToPlay from "./components/SideBarPages/WantToPlay";
import AdminPortal from "./components/SideBarPages/AdminPortal";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import APIResponse from "./Interfaces/APIResponse";

interface State {
  token: string | null;
  results: APIResponse | undefined;
  searchTerm: string;
  userId: number;
  role: "user" | "admin" | "banned";
}

interface Props {}

class App extends Component<{}, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
      results: undefined,
      searchTerm: "",
      userId: 0,
      role: "user",
    };
  }

  updateToken = (newToken: string, userId: number, role: "user" | "admin" | "banned") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("role", role);
    this.setState({
      token: newToken,
      userId: userId,
      role: role,
    });
  };

  setResults = (results: APIResponse | undefined) => {
    this.setState({
      results: results,
      searchTerm: "",
    });
  };

  setSearchTerm = (searchTerm: string) => {
    this.setState({
      searchTerm: searchTerm,
    });
  };

  clearToken = () => {
    localStorage.clear();
    this.setState({
      token: "",
      results: undefined,
      searchTerm: "",
      role: "user"
    });
  };

  render() {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <Navbar
              token={this.state.token}
              clickLogout={this.clearToken}
              updateToken={this.updateToken}
              role={this.state.role}
            />
          </header>
          <Switch>
            <Route exact path="/">
              <SearchBar
                token={this.state.token}
                searchTerm={this.state.searchTerm}
                setSearchTerm={this.setSearchTerm}
                results={this.state.results}
                setResults={this.setResults}
              />
            </Route>
            <Route exact path="/myaccount">
              <MyAccount token={this.state.token} />
            </Route>
            <Route exact path="/wanttoplay">
              <WantToPlay token={this.state.token} />
            </Route>
            <Route exact path="/library">
              <Library token={this.state.token} />
            </Route>
            <Route exact path="/admin">
              <AdminPortal token={this.state.token} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
