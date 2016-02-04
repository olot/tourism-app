
document.getElementById('location-getter').addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('results').innerHTML += "";
    var location = document.querySelector('#location-getter input[type="text"]').value;
    var JSONresults = getEvent(location);
    var arrayResults = parseEventData(JSONresults);
    appendEventResultsToDOM(arrayResults);
});


function getEvent(location){
  var xhr = new XMLHttpRequest();
  var url = "https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.address="+location+"&location.within=1mi&start_date.keyword=today&token=RFUODMEENNH4TOA4DOXH";
  xhr.open("GET", url, false);
  xhr.send();
  console.log(xhr.status, xhr.statusText);
  console.log(JSON.parse(xhr.responseText));
  console.log(JSON.parse(xhr.response));
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
