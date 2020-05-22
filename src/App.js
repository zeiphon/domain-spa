import React from 'react';
import './App.css';
import Search from './components/search';

function App() {
  return (
    <div className="App p-4">
      <h1>Domain Property Search</h1>
      <Search suburb="Blackburn" />
      <div id="output">

      </div>
    </div>
  );
}

export default App;
