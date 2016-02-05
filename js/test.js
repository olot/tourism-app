function tests () {
  var eventbriteToken = document.querySelector('#eventbrite').value;
  var metOfficeToken = document.querySelector('#metOffice').value;
  var location = document.querySelector('#location').value;
  QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
  });

  QUnit.test("entering a location and pressing submit should make a request and return an object", function( assert ) {
    var expected = "object";
    var actual = typeof getEvent(location, eventbriteToken);
    assert.equal(actual, expected, "Passed!" );
  });

  QUnit.test("function parseEventData should return an array of objects containing event name, description, time and url keys", function(assert){
    var expected = ["name", "description", "time", "url"];
    var actual = Object.keys(parseEventData(getEvent(location, eventbriteToken))[0]);
    assert.deepEqual(actual, expected, "Passed!");
  });

  QUnit.test("the keys in our array should be populated with values", function(assert){
    var eventObject = parseEventData(getEvent(location, eventbriteToken))[0];
    var value = eventObject.time;
    assert.ok(value.length > 0, "Passed!");
  });

  QUnit.test("the keys in our array should be populated with values", function(assert){
    var eventObject = parseEventData(getEvent(location, eventbriteToken))[0];
    var value = eventObject.description;
    assert.ok(value.length > 0, "Passed!");
  });

  QUnit.test("the keys in our array should be populated with values", function(assert){
    var eventObject = parseEventData(getEvent(location, eventbriteToken))[0];
    var value = eventObject.name;
    assert.ok(value.length > 0, "Passed!");
  });

  QUnit.test("the keys in our array should be populated with values", function(assert){
    var eventObject = parseEventData(getEvent(location, eventbriteToken))[0];
    var value = eventObject.url;
    assert.ok(value.length > 0, "Passed!");
  });

  QUnit.test("the getWeather function should return an object", function(assert){
    var expected = "object";
    var actual = typeof getWeather(352409, metOfficeToken);
    assert.equal(actual, expected, "Passed!" );
  });
}
