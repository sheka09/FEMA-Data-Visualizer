var map = new L.map('map').setView([39.8283, -96], 5.4);
var layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  attribution: '© OpenStreetMap'
}).addTo(map);




//json data of states and coordinates of their centers
let states_coordinates = [
  { state: 'AL', lat: 32.689557, long: -86.786093 },
  { state: 'AZ', lat: 34.802998, long: -111.886933 },
  { state: 'AR', lat: 35.003415, long: -92.332075 },
  { state: 'CA', lat: 37.314097, long: -120.285287 },
  { state: 'CO', lat: 38.988627, long: -105.969668 },
  { state: 'CT', lat: 41.750730, long: -72.526858 },
  { state: 'DE', lat: 38.956771, long: -75.417671 },
  { state: 'DC', lat: 38.926998, long: -77.049962 },
  { state: 'FL', lat: 28.449407, long: -81.716621 },
  { state: 'GA', lat: 33.050355, long: -83.370792 },
  { state: 'ID', lat: 44.029814, long: -114.942091 },
  { state: 'IL', lat: 40.469373, long: -89.321976 },
  { state: 'IN', lat: 39.966029, long: -86.070024 },
  { state: 'IA', lat: 42.215218, long: -93.615763 },
  { state: 'KS', lat: 38.844696, long: -98.668797 },
  { state: 'KY', lat: 37.311583, long: -85.169411 },
  { state: 'LA', lat: 31.337959, long: -92.469106 },
  { state: 'ME', lat: 45.521868, long: -69.155546 },
  { state: 'MD', lat: 39.126240, long: -76.592614 },
  { state: 'MA', lat: 42.352588, long: -72.039286 },
  { state: 'MI', lat: 43.517178, long: -84.717120 },
  { state: 'MN', lat: 46.566651, long: -94.275370 },
  { state: 'MS', lat: 32.824841, long: -89.615066 },
  { state: 'MO', lat: 38.795514, long: -92.689613 },
  { state: 'MT', lat: 46.945047, long: -111.016512 },
  { state: 'NE', lat: 41.248205, long: -99.525361 },
  { state: 'NH', lat: 43.770415, long: -71.649982 },
  { state: 'NJ', lat: 39.761255, long: -74.696220 },
  { state: 'NM', lat: 34.558317, long: -106.287552 },
  { state: 'NV', lat: 39.312122, long: -116.778274 },
  { state: 'NY', lat: 43.086761, long: -75.343309 },
  { state: 'NC', lat: 35.543223, long: -79.226683 },
  { state: 'ND', lat: 47.664602, long: -101.037776 },
  { state: 'OH', lat: 40.143072, long: -82.982693 },
  { state: 'OK', lat: 35.457446, long: -96.949316 },
  { state: 'OR', lat: 44.262821, long: -120.644527 },
  { state: 'PA', lat: 41.069842, long: -77.826500 },
  { state: 'RI', lat: 41.722356, long: -71.598326 },
  { state: 'SC', lat: 33.681816, long: -80.809273 },
  { state: 'SD', lat: 44.591246, long: -101.192503 },
  { state: 'TN', lat: 35.794278, long: -86.080806 },
  { state: 'TX', lat: 31.933052, long: -99.689865 },
  { state: 'UT', lat: 39.478822, long: -111.596261 },
  { state: 'VT', lat: 44.047737, long: -72.644218 },
  { state: 'VA', lat: 37.212319, long: -78.667263 },
  { state: 'WA', lat: 47.514826, long: -120.851252 },
  { state: 'WV', lat: 38.627186, long: -80.641179 },
  { state: 'WI', lat: 44.392501, long: -89.887694 },
  { state: 'WY', lat: 43.405878, long: -108.092003 }
];

//set of two letters State code
const states = new Set(["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NH", "NJ", "NM", "NV", "NY", "NC", "ND", "OH", "OK", "OR",
  "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]);


const file = '/DisasterDeclarationsSummaries.json';
// //fetch data
async function getData() {
  let data;
 let response = await fetch(file);
  data = await response.json();
  // for (var i = 0; i < data.length; i++) {
    
  // }
   return data;
 }


var form = document.getElementById('disaster_form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const incidentType = document.getElementById('incidents').value;
  const incidentBeginDate = document.getElementById('begin_date').value;
  // console.log(incidentBeginDate);
  const incidentEndDate = document.getElementById('end_date').value;
  // console.log(incidentEndDate);
  getCount(incidentType, incidentBeginDate, incidentEndDate);
  document.getElementById('disaster_form').reset();
});

const bubbles=[];

function removeBubbles(bubbles){
 for(let i=0;i<bubbles.length;i++){
  map.removeLayer(bubbles[i]);
 }
}


async function getCount(incidentType, incidentBeginDate, incidentEndDate) {
  const dataSet = await getData();
  
  for (const state of states) {
    let count = 0;

    for (let i = 0; i < dataSet.length; i++) {
      if (dataSet[i].state == state) {

        if (dataSet[i].incidentType === incidentType) {
          if (dataSet[i].incidentBeginDate !== null && dataSet[i].incidentEndDate !== null) {
            let beginDate = dataSet[i].incidentBeginDate.split('T')[0];
            let endDate = dataSet[i].incidentEndDate.split('T')[0];
            if (new Date(beginDate) - new Date(incidentBeginDate) >= 0 && new Date(endDate) - new Date(incidentEndDate) <= 0) {
              count++;
            }
          }

        }

      }

    }
    for (var j = 0; j < states_coordinates.length; j++) {
      if (states_coordinates[j].state === state && count > 0) {
        states_coordinates[j].frequency = count;
      }
      if (states_coordinates[j].state === state && count == 0) {
        states_coordinates.splice(j, 1);
      }
    }
  }
  removeBubbles(bubbles);
  addMarker(states_coordinates);
};

function addMarker(data) {
  console.log(data.length);
  for (var i = 0; i < data.length; i++) {
   const circle = L.circleMarker([data[i].lat, data[i].long], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: Math.log(data[i].frequency) * 5
    }).addTo(map).bindPopup('frequency:' + data[i].frequency);
     bubbles.push(circle);
  }
}



