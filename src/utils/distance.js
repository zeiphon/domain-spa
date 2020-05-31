import stops from '../data/stopsLatLon';

//Source: https://stackoverflow.com/q/18883601
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function findClosestStops(lat, lon) {
  let nearbyStops = [];
  const offset = 0.02;
  for (const stop of stops) {
    const lonDiff = stop.stop_longitude - lon;
    const latDiff = stop.stop_latitude - lat;
    
    if (lonDiff > -offset && lonDiff < offset
      && latDiff > -offset && latDiff < offset) {
      nearbyStops.push(stop);
    }
  }

  const results = nearbyStops.map(x =>
    { return { 
      stop_name: x.stop_name, 
      distance: getDistanceFromLatLonInKm(lat, lon, x.stop_latitude, x.stop_longitude) 
    }}
    )
    .sort((a, b) => a.distance - b.distance);

  return results;
}

export default findClosestStops;