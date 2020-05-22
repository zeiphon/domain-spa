import React from 'react';
import './App.css';
import Search from './components/search';

function App() {
  const [suburb, setSuburb] = React.useState('Blackburn');
  function updateSuburb(evt) {
    setSuburb(evt.currentTarget.value);
  }

  return (
    <div className="App p-4">
      <h1>Domain Property Search</h1>
      <Search suburb={suburb} updateSuburb={updateSuburb} />
      <div id="output">
        <span>{suburb}</span>
      </div>
    </div>
  );
}

export default App;
