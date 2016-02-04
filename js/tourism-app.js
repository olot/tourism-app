
document.getElementById('location-getter').addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('results').innerHTML = "";
    // var token = document.querySelector('#token input[type="text"]').value;
    var location = document.querySelector('#location-getter input[type="text"]').value;
    var JSONresults = getEvent(location);
    var arrayResults = parseEventData(JSONresults);
    var locationsArray = getLocationsArray(getLocationsObject());
    var eventLocation = getEventLocation(JSONresults);
    var locationId = findLocationID(eventLocation[0], eventLocation[1], locationsArray);
    var weatherResults = parseWeatherData(getWeather(locationId));
    console.log(weatherResults, "-------", eventLocation, locationId);
    appendWeatherResultsToDOM(weatherResults);
    appendEventResultsToDOM(arrayResults);
});


function getEvent(location){
  var xhr = new XMLHttpRequest();
  var url = "https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.address="+location+"&location.within=
  \ &start_date.keyword=today&token=RFUODMEENNH4TOA4DOXH";
  xhr.open("GET", url, false);
  xhr.send();
  return JSON.parse(xhr.response);

}

function parseEventData(JSONobject) {
  var resultArr = [];
  JSONobject.events.forEach(function(el) {
    resultArr.push({ name: el.name.text,
                     description: el.description.text,
                     time: el.start.local,
                     url: el.url});
  });
  return resultArr;
}

function getEventLocation(JSONObject){
  var lat = JSONObject.location.latitude;
  var long = JSONObject.location.longitude;

  var locArray = [];
  locArray.push(lat,long);
  return locArray;
}

var appendEventResultsToDOM = function(results) {
  results.forEach(function(el) {
    var nameTag = document.createElement('h3');
    var linkTag = document.createElement('a');
    var descriptionTag = document.createElement('p');
    var timeTag = document.createElement('p');

    linkTag.href = el.url;
    linkTag.innerHTML = el.name;
    descriptionTag.innerHTML = el.description;
    timeTag.innerHTML = el.time;

    nameTag.appendChild(linkTag);
    document.getElementById('results').appendChild(nameTag);
    document.getElementById('results').appendChild(timeTag);
    document.getElementById('results').appendChild(descriptionTag);
  });
};

var appendWeatherResultsToDOM = function(resultsArray) {
    var weatherDiv = document.createElement('div');
    weatherDiv.className += 'weather';
    var temperatureTag = document.createElement('h3');
    var weatherTypeTag = document.createElement('h3');

    temperatureTag.innerHTML = 'Temp: ' + resultsArray[0] + "&#8451";
    weatherTypeTag.innerHTML = 'Weather: ' + resultsArray[1];

    document.getElementById('results').appendChild(weatherDiv);
    document.getElementsByClassName('weather')[0].appendChild(temperatureTag);
    document.getElementsByClassName('weather')[0].appendChild(weatherTypeTag);
};

//start ivans code

function getLocationsObject(){
  var xhr = new XMLHttpRequest();
  var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=396c5ed0-9f0b-48a0-830c-9ca1133b8453";
  xhr.open("GET", url, false);
  xhr.send();
  return JSON.parse(xhr.response);
}

function getLocationsArray(object) {
  var array = [];
  object.Locations.Location.forEach(function(el) {
    var locationObject = {};
    locationObject.longitude = el.longitude;
    locationObject.latitude = el.latitude;
    locationObject.locID = el.id;
    array.push(locationObject);
  });
  return array;
}

function findLocationID(latitude, longitude, array) {
  latitude = Math.floor(latitude*100);
  longitude = Math.floor(longitude*100);
  var latArray = array.filter(function(el) {
    return latitude === Math.floor(100*(el.latitude));
  });
  var longArray = latArray.filter(function(el) {
    var long = Math.floor(100*(el.longitude));
    return longitude === long;
  });
  var locationIDArray = longArray[0] || latArray[0];
  var locationID = locationIDArray.locID;
  console.log('locationidis-------', locationID);
  return locationID;
}

//end

var getWeather = function(locationID){
  var xhr = new XMLHttpRequest();
  var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/"+locationID+"?res=daily&key=396c5ed0-9f0b-48a0-830c-9ca1133b8453";
  xhr.open("GET", url, false);
  xhr.send();
  return JSON.parse(xhr.response);

};

var weatherObject = {
  0:	'Clear night',
  1:	'Sunny day',
  2:	'Partly cloudy (night)',
  3:	'Partly cloudy (day)',
  4:	'Not used',
  5:	'Mist',
  6:	'Fog',
  7:	'Cloudy',
  8:	'Overcast',
  9:	'Light rain shower (night)',
  10:	'Light rain shower (day)',
  11:	'Drizzle',
  12:	'Light rain',
  13:	'Heavy rain shower (night)',
  14:	'Heavy rain shower (day)',
  15:	'Heavy rain',
  16:	'Sleet shower (night)',
  17:	'Sleet shower (day)',
  18:	'Sleet',
  19:	'Hail shower (night)',
  20:	'Hail shower (day)',
  21:	'Hail',
  22:	'Light snow shower (night)',
  23:	'Light snow shower (day)',
  24:	'Light snow',
  25:	'Heavy snow shower (night)',
  26:	'Heavy snow shower (day)',
  27:	'Heavy snow',
  28:	'Thunder shower (night)',
  29:	'Thunder shower (day)',
  30:	'Thunder',
  'NA':	'Not available'
};

function parseWeatherData(JSONobject) {
  var resultArr = [];
  var temperarure = JSONobject.SiteRep.DV.Location.Period[0].Rep[0].Dm;
  var weatherType = JSONobject.SiteRep.DV.Location.Period[0].Rep[0].W;
  console.log(temperarure, weatherObject[weatherType]);
  resultArr.push(temperarure, weatherObject[weatherType]);
  return resultArr;
}
