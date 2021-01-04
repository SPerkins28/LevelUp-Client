import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Home/Navbar";
import SearchBar from "./components/Home/SearchBar";
import MyAccount from "./components/SideBarPages/MyAccount";
import Library from "./components/SideBarPages/Library";
import WantToPlay from "./components/SideBarPages/WantToPlay";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

interface State {
  token: string | null;
  results: any;
  searchTerm: string;
  userId: number;
  role: "user" | "admin";
}

class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
      results: {},
      searchTerm: "",
      userId: 0,
      role: "user",
    };
  }

  updateToken = (newToken: string, userId: number, role: "user" | "admin") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("role", role);
    this.setState({
      token: newToken,
      userId: userId,
      role: role,
    });
  };

  setResults = (results: any) => {
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
      results: {},
      searchTerm: "",
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
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
