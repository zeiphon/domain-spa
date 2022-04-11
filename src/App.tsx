import React from 'react';
import './App.scss';
import Search from './components/search';
import Footer from './components/footer';
import axios from 'axios';
import SearchResult from './components/searchResult';
import findClosestStops from './utils/distance'
import { isArchivedInStorage, loadSearchParamsFromLocalStorage, saveSearchParamsToLocalStorage } from './utils/localStorageHelper';
import DomainListingWrapper from './types/domain';
import { getRandomAuctionSchedule, getRandomListedDate } from './utils/staticDataHelper';

//https://css-tricks.com/snippets/javascript/get-url-variables/
const getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
    }
    return false;
};

interface DomainListingWrapperWithClosestStops extends DomainListingWrapper {
    closestStops: Array<ClosestStop>;
}

interface ClosestStop {
    stop_name: string;
    distance: number;
    latitude: number;
    longitude: number;
}

function App() {
  const suburbsFromQueryString = getQueryVariable('suburbs');
  const savedSearchParams = loadSearchParamsFromLocalStorage() ?? {};

  const [selectedState, setSelectedState] = React.useState(savedSearchParams.state ?? 'VIC');
  const defaultSuburbs = savedSearchParams.suburbCsv ?? (suburbsFromQueryString ? decodeURI((suburbsFromQueryString)) : '');
  const [suburbs, setSuburbs] = React.useState(defaultSuburbs);
  const [minBeds, setMinBeds] = React.useState(savedSearchParams.minBeds ?? 2);
  const [minBaths, setMinBaths] = React.useState(savedSearchParams.minBaths ?? 1);
  const [minCarSpaces, setMinCarSpaces] = React.useState(savedSearchParams.minCarSpaces ?? 1);
  const [maxPrice, setMaxPrice] = React.useState(savedSearchParams.maxPrice ?? 650000);
  const [maxDistanceFromTrain, setMaxDistanceFromTrain] = React.useState(savedSearchParams.maxDistFromTrain ?? 1.25);

  const [results, setResults] = React.useState(new Array<DomainListingWrapperWithClosestStops>());
  const [searchResultList, setSearchResultList] = React.useState(new Array<JSX.Element>());
  const [isLoading, setIsLoading] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  const [requestedSuburbs, setRequestedSuburbs] = React.useState('');
  const [suburbCountsString, setSuburbCountsString] = React.useState('');
  const [resultsCount, setResultsCount] = React.useState(0);

  const setStateFromChangeEvent = function(evt, setFunc) {
      setFunc(evt.currentTarget.value);
  }

  const setResultsWithClosestStops = function(r: DomainListingWrapper[]) {
    const resultsWithClosestStops: DomainListingWrapperWithClosestStops[] = r
        .filter(x => {
            return x?.listing?.propertyDetails
                && x.listing.propertyDetails.latitude
                && x.listing.propertyDetails.longitude;
        })
        .map(x => {
            const closestStops: ClosestStop[] = findClosestStops(x.listing.propertyDetails.latitude, x.listing.propertyDetails.longitude);
            return { ...x, closestStops: closestStops };
        })
        .filter(x => {
            return x.closestStops.length > 0
                && Math.round(x.closestStops[0].distance * 10) / 10 <= maxDistanceFromTrain;
        });
    setResults(resultsWithClosestStops);
  }

  const apiKey = getQueryVariable('api_key');

  const runSearch = async function() {
    const reqSuburbs = suburbs
        .split(',')
        .map(x => x.trim())
        .sort()
        .join(', ');
    setRequestedSuburbs(reqSuburbs);
    saveSearchParamsToLocalStorage(
        minBeds,
        minBaths,
        minCarSpaces,
        maxPrice,
        maxDistanceFromTrain,
        reqSuburbs,
        selectedState
    );

    const url = 'https://api.domain.com.au/v1/listings/residential/_search?api_key=' + apiKey;
    const suburbArray = suburbs.split(',').map((s) => {
        return {
              "state":selectedState,
              "suburb":s.trim()
            };
    });

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
      "minBedrooms":minBeds,
      "minBathrooms":minBaths,
      "minCarspaces":minCarSpaces,
      "maxPrice":maxPrice,
      "locations":suburbArray,
      "sort": {
        "sortKey": "DateListed",
        "direction": "Descending"
      },
      "pageSize": 200
    };

    if (apiKey) {
        setIsLoading(true);
        await axios.post(url, data)
            .then(x => {
                setIsLoading(false);
                // TODO - Detect if the selected state has any stops
                if (selectedState === 'VIC') {
                    setResultsWithClosestStops(x.data);
                } else {
                    const closestStops: ClosestStop[] = [];
                    setResults(x.data.map(y => { return { ...y, closestStops: closestStops } }));
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    } else {
        setIsLoading(true);
        await axios.get('https://scottabutler.github.io/domain-react-spa/static-data.json')
            .then(x => {
                setIsLoading(false);
                var updatedData = postProcessSampleData(x.data);
                setResultsWithClosestStops(updatedData);
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    }
  }

  const postProcessSampleData = (data: DomainListingWrapper[]): DomainListingWrapper[] => {
      return data.map(x => {
          // Set random listed date
          x.listing.dateListed = getRandomListedDate();

          // Set random auction schedule
          x.listing.auctionSchedule = getRandomAuctionSchedule();

          // Set random inspection schedule
          // TODO

          return x;
      }).sort((a, b) => new Date(b.listing.dateListed).getTime() - new Date(a.listing.dateListed).getTime());
  }

  const spinner = isLoading
    ? (
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
    : <></>

  React.useEffect(() => {
    const list = results && results.length > 0
        ? results.map(x =>
            <SearchResult
                key={x.listing.listingSlug}
                closestStops={x.closestStops}
                data={x}
                showArchived={showArchived}
            />)
        : [];
    setSearchResultList(list);

    const suburbCounts = {};
    let hiddenResultCount = 0;
    results.map(x => {
        if (x?.listing?.propertyDetails) {
            const upperCaseSuburb = x.listing.propertyDetails.suburb.toUpperCase();
            if (suburbCounts[upperCaseSuburb]) {
                suburbCounts[upperCaseSuburb]++;
            } else {
                suburbCounts[upperCaseSuburb] = 1;
            }
        }
        if (isArchivedInStorage(x.listing.listingSlug)) {
            hiddenResultCount += 1; // TODO convert this to a map for immutability?
        }
    });
    setResultsCount(showArchived ? list.length : list.length - hiddenResultCount);
    const orderedSuburbCounts = orderObjectPropertiesByCount(suburbCounts);
    let counts: string[] = [];
    for (const s in orderedSuburbCounts) {
        counts.push(`${toTitleCase(s)} (${orderedSuburbCounts[s]})`);
    }

    // Add in any that suburbs from the search that didn't have any search results
    const requestedSuburbsArray = requestedSuburbs.split(', ').filter(r => !!r);
    const keys = Object.keys(orderedSuburbCounts);
    for (const r of requestedSuburbsArray) {
        if (!keys.find(x => x === r.toUpperCase())) {
            counts.push(`${toTitleCase(r)} (0)`);
        }
    }
    setSuburbCountsString(counts.join(', '));
  }, [results, showArchived]);

  function toTitleCase(input) {
    return input.split(' ')
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ');
  }

  function orderObjectPropertiesByCount(obj) {
    const keys = Object.keys(obj);
    const sorted = keys.sort(function(a,b){return obj[b]-obj[a]});
    const result = {};
    for (const k in sorted) {
        const sortedKey = sorted[k];
        result[sortedKey] = obj[sortedKey];
    };
    return result;
  }

  return (
    <div className="App py-2 container-fluid">
      {!apiKey &&
        <div className="alert alert-info" role="alert">
            <strong>Demo mode</strong> - Sample data will be returned unless a Domain Property API key is supplied using the <code>api_key</code> query string parameter.
        </div>
      }
      <h3 className="py-2 bg-light">Domain Property Search</h3>

      <div className="row mt-3">
          <div className="col-12 mb-2 pb-2 pb-sm-0">
              <div className="border border-secondary rounded bg-white p-2">
                  <Search
                      state={selectedState} updateState={(evt) => setStateFromChangeEvent(evt, setSelectedState)}
                      suburbs={suburbs} updateSuburbs={(evt) => setStateFromChangeEvent(evt, setSuburbs)}
                      minBeds={minBeds} updateMinBeds={(val) => setMinBeds(val)}
                      minBaths={minBaths} updateMinBaths={(val) => setMinBaths(val)}
                      minCarSpaces={minCarSpaces} updateMinCarSpaces={(val) => setMinCarSpaces(val)}
                      maxPrice={maxPrice} updateMaxPrice={(val) => setMaxPrice(val)}
                      maxDistanceFromTrain={maxDistanceFromTrain} updateMaxDistanceFromTrain={(val) => setMaxDistanceFromTrain(val)}
                      runSearch={runSearch}
                  />
              </div>
          </div>
      </div>
      <div className="row" id="searchResultsContainer">
        <div className="col-12">
          <div className="border border-secondary rounded bg-white p-2 px-3" id="output">
            {isLoading
            ? spinner
            : <>
                {results && results.length > 0 && requestedSuburbs
                ?
                    <div className="row">
                        <div className="col">
                            <span>Showing {resultsCount} properties in {suburbCountsString}</span>
                        </div>
                        <div className="col-12">
                            <input id="showArchivedCheckbox" type="checkbox" defaultChecked={showArchived} onChange={() => { setShowArchived(!showArchived) }} />
                            <label htmlFor="showArchivedCheckbox">Show hidden properties</label>
                        </div>
                    </div>
                : <></>
                }
                <div className={`d-flex flex-wrap ${searchResultList.length > 0 ? 'justify-content-around justify-content-md-start' : ''}`}>{
                    searchResultList.length > 0
                        ? searchResultList
                        : <span className="d-block">No properties found.</span>
                }</div>
            </>
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
