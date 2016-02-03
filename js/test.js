QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("pressing submit should make a request and return an object", function( assert ) {
  var expected = "object";
  var actual = typeof result;
  assert.equal(actual, expected, "Passed!" );
});
