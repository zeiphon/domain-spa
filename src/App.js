import React from 'react';
import './App.css';
import Search from './components/search';

function App() {
  const [suburb, setSuburb] = React.useState('Blackburn');
  const updateSuburb = function(evt) {
    setSuburb(evt.currentTarget.value);
  }
  const runSearch = function() {
    console.log('Running search for suburb ', suburb);
  }

  return (
    <div className="App p-4">
      <h1>Domain Property Search</h1>
      <Search suburb={suburb} updateSuburb={updateSuburb} runSearch={runSearch} />
      <div id="output">
        <span>{suburb}</span>
      </div>
    </div>
  );
}

export default App;
