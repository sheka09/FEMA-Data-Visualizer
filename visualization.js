var map = new L.map('map').setView([39.8283, -96], 5.4);
var legend = L.control({position: 'bottomright'});

var layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5,
  attribution: '© OpenStreetMap'
}).addTo(map);


//set of two letters State code
const states = new Set(["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NH", "NJ", "NM", "NV", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]);

const disaster_file = '/DisasterDeclarationsSummaries.json';
const states_coordinates='/states_coordinates.json';

// //fetch data
async function getData(file) {
 let response = await fetch(file);
 let data = await response.json();
  return data;
 }


var form = document.getElementById('disaster_form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const incidentType = document.getElementById('incidents').value;
  const incidentBeginDate = document.getElementById('begin_date').value;
  const incidentEndDate = document.getElementById('end_date').value;
  getCount(incidentType, incidentBeginDate, incidentEndDate);
  document.getElementById('disaster_form').reset();
});

const bubbles=[];

//removes bubbles
function removeBubbles(bubbles){
 for(let i=0;i<bubbles.length;i++){
  map.removeLayer(bubbles[i]);
 }
}

//counts frequency of an incident in a given period by states
async function getCount(incidentType, incidentBeginDate, incidentEndDate) {
  const dataSet = await getData(disaster_file);
   let coordinates=await getData(states_coordinates);

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

      for (var j = 0; j < coordinates.length; j++) {
      if (coordinates[j].state === state && count > 0) {
        coordinates[j].frequency = count;
      }
      if (coordinates[j].state === state && count == 0) {
        coordinates.splice(j, 1);
      }
    }
  }
  removeBubbles(bubbles);
  addMarker(coordinates);
};


//populates bubble circles by the frequency of the occurrence per state
function addMarker(data) {
  console.log(data.length);
  for (var i = 0; i < data.length; i++) {
   const circle = L.circleMarker([data[i].lat, data[i].long], {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 1,
      radius: getRadius(data[i].frequency)

    }).addTo(map).bindPopup('frequency:' + data[i].frequency);
     bubbles.push(circle);
  }
}

//returns radius of the bubbles
function getRadius(r) {
   return r > 200 ? 15 :
         r > 150 ? 12:
         r > 100 ? 8 :
         r > 50 ? 4 :
         r > 10 ? 2:
         0;
   }
  

  
  legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
    
  var grades = [50,100,150,200],
  labels = ['<Strong> Reported Incidents </strong>'],
   categories = ['1-50','51-100','101-200','> 200'];
  for (var i = 0; i < grades.length; i++) {
    var grade = grades[i];

    labels.push(
      '<i class="circlepadding" style="width: 5px;"></i> <i  style="background: red; width: '+getRadius(grade)*2.2+'px; height: '+getRadius(grade)*2.2+'px; border-radius:  50%; margin-top: '+Math.max(0,(19-getRadius(grade)))+'px;"></i>'+categories[i]);

        }
  div.innerHTML = labels.join('<br>');
  return div;
   };

     legend.addTo(map);





