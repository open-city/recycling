(function($, WIMR){
  WIMR.createMap = function(id) {
    var map = L.map(id).setView([41.881, -87.629], 11);
    var self = this;
    self.locations = {};
    
    map.wimrRefreshLocations = function(callback) {
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
      var mkr = self.locations[loc._id];
      var lat = loc.geoPoint[1];
      var lng = loc.geoPoint[0];
      
      map.setView([lat,lng], 16);
      mkr.openPopup();
    }
    
    map.addOrUpdateLocation = function(loc) {
  
      var txt = loc.address + "<br>";
      txt += loc.reports.length + " reports";
  
      if (!self.locations[loc._id]) {
        var lat = loc.geoPoint[1];
        var lng = loc.geoPoint[0]
    
        var marker = L.marker([lat,lng])
        marker.addTo(map).bindPopup(txt);
        self.locations[loc._id] = marker;
      } else {
        var marker = self.locations[loc._id];
        marker.unbindPopup();
        marker.bindPopup(txt);
        self.locations[loc._id] = loc;
      }
    }
    
    map.wimrReset = function(done) {
      map.setView([41.881, -87.629], 11);
      map.wimrRefreshLocations();
    }
    


    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'scottbeslow.ijk19b6c'
    }).addTo(map);
      
    map.wimrRefreshLocations();
    return map;
  }

})(jQuery, WIMR);