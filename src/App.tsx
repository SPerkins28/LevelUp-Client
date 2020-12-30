import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Home/Navbar";
import SearchBar from "./components/Home/SearchBar";
import AccountPage from "./components/SideBarPages/AccountPage";
import Library from "./components/SideBarPages/Library";
import WantToPlay from "./components/SideBarPages/WantToPlay";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

interface State {
  token: string | null;
  results: any;
  searchTerm: string;
}

class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: "",
      results: {},
      searchTerm: "",
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem("token")) {
      this.setState({
        token: localStorage.getItem("token"),
      });
    }
  };

  updateToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    this.setState({
      token: newToken,
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
              <AccountPage />
            </Route>
            <Route exact path="/wanttoplay">
              <WantToPlay token={this.state.token} />
            </Route>
            <Route exact path="/library">
              <Library />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
