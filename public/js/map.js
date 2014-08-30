(function($){
  var map = window.leafletMap = L.map('map').setView([41.881, -87.629], 11);
  
  map.wmrInit = function() {
    map.locations = {};
    
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'scottbeslow.ijk19b6c'
      }).addTo(map);
    
    map.wmrRefreshLocations();
  }
  
  map.wmrRefreshLocations = function(callback) {
    $.get('/locations.json')
    .done(function(response){
      for (var i = 0; i < response.locations.length; i++){
        var current_loc = response.locations[i]
        if(current_loc.geoPoint){
          map.addOrUpdateLocation(current_loc);
          
        }
      }

      if (callback) {
        callback();
      }
      
    });
  }

  map.dropPin = function(lat,lng) {

    var mkr = L.marker([lat,lng]);
    mkr.addTo(map);
    
    map.setView([lat,lng], 16);
    return mkr;
  }
  
  map.zoomToPin = function(loc) {
    var mkr = map.locations[loc._id];
    var lat = loc.geoPoint[1];
    var lng = loc.geoPoint[0];
    
    map.setView([lat,lng], 16);
    mkr.openPopup();
  }
  
  map.addOrUpdateLocation = function(loc) {

    var txt = loc.address + "<br>";
    txt += loc.reports.length + " reports";

    if (!map.locations[loc._id]) {
      var lat = loc.geoPoint[1];
      var lng = loc.geoPoint[0]
  
      var marker = L.marker([lat,lng])
      marker.addTo(map).bindPopup(txt);
      map.locations[loc._id] = marker;
    } else {
      var marker = map.locations[loc._id];
      marker.unbindPopup();
      marker.bindPopup(txt);
      map.locations[loc._id] = loc;
    }
  }
  
  map.wmrReset = function(done) {
    map.setView([41.881, -87.629], 11);
    map.wmrRefreshLocations();
  }

})(jQuery);