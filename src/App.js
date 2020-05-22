import React from 'react';
import './App.css';
import Search from './components/search';
import Footer from './components/footer';

function App() {
  const [suburb, setSuburb] = React.useState('Blackburn');
  const updateSuburb = function(evt) {
    setSuburb(evt.currentTarget.value);
  }
  const runSearch = function() {
    document.querySelector("#searchResult").innerHTML = 'You searched for ' + suburb;
  }

  return (
    <div className="App py-2 container-fluid">
      <h1 className="pb-2">Domain Property Search</h1>
      <div className="row no-gutters mt-4">
        <div className="col-3">
          <Search suburb={suburb} updateSuburb={updateSuburb} runSearch={runSearch} />
        </div>
        <div className="col-9 p-2 pl-4" id="output">
          <span>{suburb}</span><br />
          <span id="searchResult"></span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
