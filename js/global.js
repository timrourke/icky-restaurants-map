$(document).on('ready', function() {

	var map;

	var form = document.getElementById('js-zip-form');

	var images = [{
    url: 'images/safe.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(20, 20),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 0)
  },{
    url: 'images/medium.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(20, 20),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 0)
  },{
    url: 'images/danger.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(20, 20),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 0)
  }];

	_.mixin({
	  'findByValues': function(collection, property, values) {
	    return _.filter(collection, function(item) {
	      return _.contains(values, item[property]);
	    });
	  }
	});

	var filtered = _.findByValues(restaurantData, "zip", ['60625']);

	function initialize() {
	 var mapOptions = {
        center: { lat: 41.9700, lng: -87.6900},
        zoom: 15
      };
      map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

	  for (var i = 0; i < filtered.length; i++) {
			var restaurant = filtered[i];
	    var myLatLng = new google.maps.LatLng(restaurant.latitude, restaurant.longitude);
	    var marker = new google.maps.Marker({
	        position: myLatLng,
	        map: map,
	        icon: images[restaurant.risk.split(' ')[1]-1],
	        title: restaurant['dba_name'],
	        zIndex: 3
	    });
		}
  }

  initialize();

  function centerMap(zip) {
  	$.ajax({
		  url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=false",
		  success: function(data) {

		  	var latLong = {
		  		lat: data.results[0].geometry.location.lat,
		  		lng: data.results[0].geometry.location.lng
		  	}

		  	map.panTo(latLong);
		  }
		});
  	// get latlong from google geocode service with this url:
  	// http://maps.googleapis.com/maps/api/geocode/json?address=50323&sensor=false
  }

  function searchZip(zip) {
  	var newZip = _.findByValues(restaurantData, "zip", [zip]);
  	for (var i = 0; i < newZip.length; i++) {
			var restaurant = newZip[i];
	    var myLatLng = new google.maps.LatLng(restaurant.latitude, restaurant.longitude);
	    var marker = new google.maps.Marker({
	        position: myLatLng,
	        map: map,
	        icon: images[restaurant.risk.split(' ')[1]-1],
	        title: restaurant['dba_name'],
	        zIndex: 3
	    });
		}

		centerMap(zip);
  }

  $(form).on('submit', function(e){
  	e.preventDefault();

  	var zip = document.getElementById('js-zip-form-zip-code').value;

  	searchZip(zip);

  });
  
});