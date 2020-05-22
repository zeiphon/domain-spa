import React from 'react';
import './App.css';
import Search from './components/search';
import Footer from './components/footer';
import axios from 'axios';

function App() {
  const [suburb, setSuburb] = React.useState('Blackburn');
  const updateSuburb = function(evt) {
    setSuburb(evt.currentTarget.value);
  };
  const getKeyFromQueryString = function() {
    return window.location.search.split('=')[1];
  };
  const runSearch = async function() {
    const key = getKeyFromQueryString();
    const url = 'https://api.domain.com.au/v1/listings/residential/_search?api_key=' + key;
    const data = {
      "listingType":"Sale",
      "propertyTypes":[
        "House",
        "NewApartments",
        "ApartmentUnitFlat",
        "Townhouse"
      ],
      "listingAttributes": [
        "NotUnderContract"
      ],
      "minBedrooms":2,
      "minBathrooms":2,
      "minCarspaces":1,
      "maxPrice":650000,
      "locations":[
        {
          "state":"VIC",
          "suburb":suburb
        }
      ],
      "sort": {
        "sortKey": "DateListed",
        "direction": "Descending"
      }
    };
    const result = await axios.post(url, data);
    document.querySelector("#searchResult").innerHTML = JSON.stringify(result, undefined, 2);
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
          <pre id="searchResult"></pre>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
