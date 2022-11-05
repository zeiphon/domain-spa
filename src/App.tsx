import React from 'react';
import './App.scss';
import Search from './components/search';
import Footer from './components/footer';
import axios from 'axios';
import SearchResult from './components/searchResult';
import findClosestStops from './utils/distance'
import { isArchivedInStorage, loadSearchParamsFromLocalStorage, saveSearchParamsToLocalStorage } from './utils/localStorageHelper';
import DomainListingWrapper, { State } from './types/domain';
import { getRandomInspectionAndAuctionSchedules, getRandomListedDate } from './utils/staticDataHelper';
import { getSuburbOptionsForState, Option } from './data/allSuburbOptions';
import { ClosestStop, DomainListingWrapperWithClosestStops, DomainResponseHeaders } from './types/app';
import InspectionTimesView from './components/inspectionTimesView';

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

function App() {
  const suburbsFromQueryString = getQueryVariable('suburbs');
  const savedSearchParams = loadSearchParamsFromLocalStorage() ?? {};

  const [selectedState, setSelectedState] = React.useState<State>(savedSearchParams.state ?? 'VIC');
  const defaultSuburbs = savedSearchParams.suburbCsv ?? (suburbsFromQueryString ? decodeURI((suburbsFromQueryString)) : '');
  const [suburbs, setSuburbs] = React.useState<string>(defaultSuburbs);
  const [suburbOptions, setSuburbOptions] = React.useState<Option[]>(getSuburbOptionsForState(selectedState));
  const [minBeds, setMinBeds] = React.useState<number>(savedSearchParams.minBeds ?? 2);
  const [minBaths, setMinBaths] = React.useState<number>(savedSearchParams.minBaths ?? 1);
  const [minCarSpaces, setMinCarSpaces] = React.useState<number>(savedSearchParams.minCarSpaces ?? 1);
  const [maxPrice, setMaxPrice] = React.useState<number>(savedSearchParams.maxPrice ?? 650000);
  const [maxDistanceFromTrain, setMaxDistanceFromTrain] = React.useState<number>(savedSearchParams.maxDistFromTrain ?? 1.25);

  const [results, setResults] = React.useState(new Array<DomainListingWrapperWithClosestStops>());
  const [searchResultList, setSearchResultList] = React.useState(new Array<JSX.Element>());
  const [isLoading, setIsLoading] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  const [requestedSuburbs, setRequestedSuburbs] = React.useState('');
  const [suburbCountsString, setSuburbCountsString] = React.useState('');
  const [suburbCountsOpen, setSuburbCountsOpen] = React.useState(false);
  const [resultsCount, setResultsCount] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [headers, setHeaders] = React.useState<DomainResponseHeaders | undefined>(undefined);

  const pageSize = 200;

  const setStateFromChangeEvent = function(evt, setFunc) {
      setFunc(evt.currentTarget.value);
  }

  const getResultsWithClosestStops = function(r: DomainListingWrapper[]) {
    const resultsWithLatLng: DomainListingWrapper[] = r
        .filter(x => {
            return x?.listing?.propertyDetails
                && x.listing.propertyDetails.latitude
                && x.listing.propertyDetails.longitude;
        });
    const resultsWithClosestStops1: DomainListingWrapperWithClosestStops[] =
        resultsWithLatLng.map(x => {
            const closestStops: ClosestStop[] = findClosestStops(x.listing.propertyDetails.latitude, x.listing.propertyDetails.longitude);
            return { ...x, closestStops: closestStops };
        });
    const resultsWithClosestStops: DomainListingWrapperWithClosestStops[] =
        resultsWithClosestStops1.filter(x => {
            return x.closestStops.length > 0
                && Math.round(x.closestStops[0].distance * 10) / 10 <= maxDistanceFromTrain;
        });
    return resultsWithClosestStops;
  }

  const apiKey = getQueryVariable('api_key');

  const runSearch = async function(pageNo: number) {
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
      "pageSize": pageSize,
      "pageNumber": pageNo
    };

    if (apiKey) {
        setIsLoading(true);
        await axios.post(url, data)
            .then(x => {
                setHeaders({
                    "x-quota-perday-limit": x.headers["x-quota-perday-limit"],
                    "x-quota-perday-remaining":  x.headers["x-quota-perday-remaining"],
                    "x-total-count":  x.headers["x-total-count"],
                    "x-pagination-pagenumber":  x.headers["x-pagination-pagenumber"],
                    "x-pagination-pagesize":  x.headers["x-pagination-pagesize"],
                });
                setPageNumber(parseInt(x.headers["x-pagination-pagenumber"]));
                setIsLoading(false);
                // TODO - Detect if the selected state has any stops
                if (selectedState === 'VIC') {
                    const newResultsWithStops = getResultsWithClosestStops(x.data);
                    setResults(pageNo === 1 ? newResultsWithStops : results.concat(newResultsWithStops));
                } else {
                    const newResultsWithEmptyStops: DomainListingWrapperWithClosestStops[] = x.data.map(y => { return { ...y, closestStops: [] } });
                    setResults(pageNo === 1 ? newResultsWithEmptyStops : results.concat(newResultsWithEmptyStops));
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
                var withStops = getResultsWithClosestStops(updatedData);
                setResults(withStops);
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

          // Set random auction and inspection schedules
          const { inspectionSchedule, auctionSchedule } = getRandomInspectionAndAuctionSchedules();
          x.listing.auctionSchedule = auctionSchedule;
          x.listing.inspectionSchedule = inspectionSchedule

          return x;
      }).sort((a, b) => new Date(b.listing.dateListed).getTime() - new Date(a.listing.dateListed).getTime());
  }

  const spinner = isLoading
    ? (
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
    : <></>;

  React.useEffect(() => {
    setSuburbOptions(getSuburbOptionsForState(selectedState));
  }, [selectedState])

  React.useEffect(() => {
    if (apiKey) return;
    runSearch(1);
  }, [])

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

            if (isArchivedInStorage(x.listing.listingSlug)) {
                hiddenResultCount += 1; // TODO convert this to a map for immutability?
                suburbCounts[upperCaseSuburb]--;
            }
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

  // LOAD MORE
  const hasMore = headers && parseInt(headers['x-total-count']) > (parseInt(headers['x-pagination-pagesize']) * parseInt(headers['x-pagination-pagenumber']));
  const loadMoreButton = hasMore
    ?
        <>
            <input type="button" className="load-more-button px-3 rounded mb-1" onClick={() => runSearch(pageNumber + 1)} value="Load more" disabled={!hasMore} />
        </>
    : <></>;
  const footerMetadata = headers
    ? `${headers['x-total-count']}.${headers['x-pagination-pagesize']}.${headers['x-pagination-pagenumber']}.${headers['x-quota-perday-limit']}.${headers['x-quota-perday-remaining']}`
    : "";
  // END LOAD MORE

  return (
    <div className="App py-2 container-fluid">
      {!apiKey &&
        <div className="alert alert-info mb-1" role="alert">
            <strong>Demo mode</strong> - Sample data will be returned unless a Domain Property API key is supplied using the <code>api_key</code> query string parameter.
        </div>
      }
      <h3 className="pt-2 bg-light">Domain Property Search</h3>

      <div className="row mt-3">
          <div className="col-12 pb-2">
              <div className="border border-secondary rounded bg-white p-2">
                  <Search
                      state={selectedState} updateState={(evt) => setStateFromChangeEvent(evt, setSelectedState)}
                      suburbs={suburbs} updateSuburbs={(val) => setSuburbs(val)}
                      suburbOptions={suburbOptions}
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
      <div className="row">
        <div className="col-12 col-lg-8" id="search-results-container">
          <div className="border border-secondary rounded bg-white py-2 px-3" id="output">
            <>
                {results && results.length > 0 && requestedSuburbs
                ?
                    <>
                        <div className="row">
                            <div className="col-12">
                                <span>Showing {resultsCount} properties</span>
                                <span className="toggle ms-1 text-secondary" onClick={() => setSuburbCountsOpen(!suburbCountsOpen)}>
                                    <i className={`icon-${suburbCountsOpen ? "up" : "down"}-open`} />
                                </span>
                                {suburbCountsOpen &&
                                    <div>{suburbCountsString}</div>
                                }
                            </div>
                        </div>
                        <div className="row my-1 ms-0">
                            <div className="col-12 form-check form-switch mb-0">
                                <input className="form-check-input mb-0" type="checkbox" id="showArchivedCheckbox" defaultChecked={showArchived} onChange={() => { setShowArchived(!showArchived) }} />
                                <label className="form-check-label mb-0" htmlFor="showArchivedCheckbox">Show hidden properties</label>
                            </div>
                        </div>
                    </>
                : <></>
                }
                <div className={`d-flex flex-wrap ${searchResultList.length > 0 ? 'justify-content-around justify-content-md-start' : ''}`}>
                    {
                        searchResultList.length > 0
                            ? searchResultList
                            : <span className="d-block">No properties found.</span>
                    }
                </div>
            </>
            {isLoading
                ? spinner
                : <></>
            }
            {results && results.length > 0 && <div className="col-12 mx-0 mx-md-3 text-center text-md-start my-2">{loadMoreButton}</div>}
          </div>
        </div>
        <div className="col-12 col-lg-4 ps-lg-0 ">
            <div className="border border-secondary rounded bg-white py-2 px-3 mt-2 mt-lg-0">
                <InspectionTimesView results={results.filter(x => !isArchivedInStorage(x.listing.listingSlug))} />
            </div>
        </div>
      </div>
      <Footer metadata={footerMetadata} />
    </div>
  );
}

export default App;
