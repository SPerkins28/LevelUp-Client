import React from 'react';
import './App.css';
import Navbar from './components/Home/Navbar';
import SearchBar from './components/Home/SearchBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <body className="App-body">
        <SearchBar />
      </body>
    </div>
  );
}

export default App;
