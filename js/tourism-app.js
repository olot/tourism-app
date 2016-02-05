document.getElementById('location-getter').addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('results').innerHTML = "";
    var eventbriteToken = document.querySelector('#eventbrite').value;
    var metOfficeToken = document.querySelector('#metOffice').value;
    var location = document.querySelector('#location').value;
    var JSONresults = getEvent(location, eventbriteToken);
    var arrayResults = parseEventData(JSONresults);
    var locationsArray = getLocationsArray(getLocationsObject(metOfficeToken));
    var eventLocation = getEventLocation(JSONresults);
    var locationId = findLocationID(eventLocation[0], eventLocation[1], locationsArray);
    var weatherResults = parseWeatherData(getWeather(locationId, metOfficeToken));
    appendWeatherResultsToDOM(weatherResults);
    appendEventResultsToDOM(arrayResults);
    tests();
});


function getEvent(location, eventbriteToken){
  var xhr = new XMLHttpRequest();
  var url = "https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.address="+location+"&location.within=5mi&start_date.keyword=today&token="+eventbriteToken;
  xhr.open("GET", url, false);
  xhr.send();
  return JSON.parse(xhr.response);

}

function parseEventData(JSONobject) {
  var resultArr = [];
  JSONobject.events.forEach(function(el) {
    var desc;
    if (el.description.text===null) {
      desc = 'Description not available';
    } else {
      desc = (el.description.text).split('.')[0]+'.';
    }

    resultArr.push({ name: el.name.text,
                     description: desc,
                     time: el.start.local.split('T')[1],
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
    //
    var nameTag = document.createElement('h3');
    var linkTag = document.createElement('a');
    var descriptionTag = document.createElement('p');
    var timeTag = document.createElement('p');
    timeTag.classList.add('eventTime');


    linkTag.href = el.url;
    linkTag.innerHTML = el.name;
    descriptionTag.innerHTML = el.description;
    timeTag.innerHTML = "Time: "+el.time.substr(0,5);

    nameTag.appendChild(linkTag);
    document.getElementById('results').appendChild(nameTag);
    document.getElementById('results').appendChild(timeTag);
    document.getElementById('results').appendChild(descriptionTag);
  });
};

var appendWeatherResultsToDOM = function(resultsArray) {
    var weatherDiv = document.createElement('div');
    weatherDiv.className += 'weather';
    var titleTag = document.createElement('h3');
    var temperatureTag = document.createElement('h3');
    var weatherTypeTag = document.createElement('h3');
    temperatureTag.classList.add('temperature');
    var eventsTitle = document.createElement('h3');
    eventsTitle.classList.add('eventsTitle');

    titleTag.innerHTML = "Today's weather";
    temperatureTag.innerHTML = resultsArray[0] + "&#8451";
    weatherTypeTag.innerHTML = resultsArray[1];
    eventsTitle.innerHTML = "Events happening today";

    document.getElementById('results').appendChild(weatherDiv);
    document.getElementsByClassName('weather')[0].appendChild(titleTag);
    document.getElementsByClassName('weather')[0].appendChild(temperatureTag);
    document.getElementsByClassName('weather')[0].appendChild(weatherTypeTag);
    document.getElementById('results').appendChild(eventsTitle);
};

//start ivans code

function getLocationsObject(metOfficeToken){
  var xhr = new XMLHttpRequest();
  var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key="+metOfficeToken;
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
  return locationID;
}

//end

var getWeather = function(locationID, metOfficeToken){
  var xhr = new XMLHttpRequest();
  var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/"+locationID+"?res=daily&key="+metOfficeToken;
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
  var temperature = JSONobject.SiteRep.DV.Location.Period[0].Rep[0].Dm;
  var weatherType = JSONobject.SiteRep.DV.Location.Period[0].Rep[0].W;
  resultArr.push(temperature, weatherObject[weatherType]);
  return resultArr;
}
