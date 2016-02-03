
document.getElementById('location-getter').addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('results').innerHTML += "yo!!!";
    var location = document.querySelector('#location-getter input[type="text"]').value;
    getEvent(location);


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
