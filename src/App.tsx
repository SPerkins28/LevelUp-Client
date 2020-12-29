import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Home/Navbar';
import SearchBar from './components/Home/SearchBar';

interface State {
  token: string | null,
  results: any
  searchTerm: string,
}

class App extends Component<{}, State> {
  constructor(props: any){
    super(props)
    this.state=({
      token: '',
      results: {},
      searchTerm: ''
    })
  }

  componentDidMount = () => {
    if (localStorage.getItem('token')){
      this.setState({
        token: localStorage.getItem('token')
      })
    }
  }

  updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    this.setState({
      token: newToken
    })
  }

  setResults = (results: any) => {
    this.setState({
      results: results,
      searchTerm: ''
    })
  }

  setSearchTerm = (searchTerm: string) => {
    this.setState({
      searchTerm: searchTerm,
    })
  }

  clearToken = () => {
    localStorage.clear();
    this.setState({
      token: '',
      results: {},
      searchTerm: '',
    })
  }

  render (){
    return (
      <div className="App">
        <header className="App-header">
          <Navbar token={this.state.token} clickLogout={this.clearToken} updateToken={this.updateToken} />
        </header>
        <body className="App-body">
          <SearchBar searchTerm={this.state.searchTerm} setSearchTerm={this.setSearchTerm} results={this.state.results} setResults={this.setResults} token={this.state.token}/>
        </body>
      </div>
    );
  }
}

export default App;
