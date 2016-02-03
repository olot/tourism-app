document.getElementById('location-getter').addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('results').innerHTML += "yo!!!";
    var location = document.querySelector('#location-getter input[type="text"]').value;
    console.log(location);
});
