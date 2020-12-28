import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Home/Navbar';
import SearchBar from './components/Home/SearchBar';

interface State {
  token: string | null,
}

class App extends Component<{}, State> {
  constructor(props: any){
    super(props)
    this.state=({
      token: '',
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

  clearToken = () => {
    localStorage.clear();
    this.setState({
      token: ''
    })
  }

  render (){
    return (
      <div className="App">
        <header className="App-header">
          <Navbar token={this.state.token} clickLogout={this.clearToken} updateToken={this.updateToken} />
        </header>
        <body className="App-body">
          <SearchBar token={this.state.token}/>
        </body>
      </div>
    );
  }
}

export default App;
