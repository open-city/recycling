(function($, WIMR){
  WIMR.createMap = function(id) {
    var map = L.map(id).setView([41.881, -87.629], 11);
    var self = this;
    self.locations = {};
    self.pending = [];

    var defaultIcon = L.icon({
      iconUrl: '/js/images/marker-icon.png',
      shadowUrl: '/js/images/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [13, 41],
      shadowAnchor: [13, 41],
      popupAnchor: [0, -36]
    });

    var activeIcon = L.icon({
      iconUrl: '/js/images/marker-icon-active.png',
      shadowUrl: '/js/images/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [13, 41],
      shadowAnchor: [13, 41],
      popupAnchor: [0, -36]
    });
    
    map.wimrRefreshLocations = function(callback) {
      $.get('/locations.json')
      .done(function(response){
        var locs = {};
        for (var i = 0; i < response.locations.length; i++){
          var current_loc = response.locations[i]
          if(current_loc.geoPoint){
            map.addOrUpdateLocation(current_loc);
            locs[current_loc._id] = true;
          }
        }
  
        map.clearPendingLocations();
  
        if (callback) {
          callback();
        }
        
      });
    }
  
    map.dropPin = function(lat, lng, opts) {
  
      var mkr = L.marker([lat,lng]);
      mkr.setIcon(activeIcon);
      mkr.addTo(map);
      if (opts.popupText) {
        mkr.bindPopup(opts.popupText);
        mkr.openPopup();
      }
      
      map.setView([lat,lng], 16);
      return mkr;
    }
    
    map.zoomToPin = function(loc) {
      var mkr = self.locations[loc._id];
      var lat = loc.geoPoint[1];
      var lng = loc.geoPoint[0];
      
      map.setView([lat,lng], 16);
      
      for (var id in self.locations) {
        self.locations[id].setIcon(defaultIcon);
      }
      mkr.setIcon(activeIcon);
      mkr.openPopup();
    }
    
    map.addOrUpdateLocation = function(loc) {
  
      var txt = loc.address + "<br>";
      txt += loc.reports.length + " reports";
  
      if (!self.locations[loc._id]) {
        var lat = loc.geoPoint[1];
        var lng = loc.geoPoint[0]
    
        var marker = L.marker([lat,lng]);
        marker.addTo(map).bindPopup(txt);
        marker.update();
        
        marker._id = loc._id;
        marker.geoPoint = loc.geoPoint;
        marker.address = loc.address
        marker.reports = loc.reports;
        self.locations[loc._id] = marker;
      } else {
        var marker = self.locations[loc._id];
        marker.unbindPopup();
        marker.bindPopup(txt);
        marker.update();
      }
      
      marker.on('click', function(e){
        window.location.hash = '/reports/' + this._id;
      })
    }
    
    map.wimrReset = function(done) {
      
      map.setView([41.881, -87.629], 11);
      map.wimrRefreshLocations(function(){
        for (var loc in self.locations) {
          var mkr = self.locations[loc];
          
          // not sure why it's necessary to open then close,
          // but the popup won't close with just .closePopup()
          mkr.openPopup().closePopup();
          mkr.setIcon(defaultIcon);
        }
        
        if (done) {
          done(self);
        }
      });
    };
    
    map.wimrHighlightPin = function(loc_id) {
      var mkr = self.locations[loc_id];
      mkr.openPopup();
      mkr.setIcon(activeIcon)
    };
    
    map.wimrClosePopup = function(loc_id) {
      var mkr = self.locations[loc_id];
      mkr.closePopup();
    };
    
    map.addPendingLocation = function(loc) {
      self.pending.push(loc);
    };
    
    map.clearPendingLocations = function() {
      self.pending.forEach(function(mkr){
        map.removeLayer(mkr);
      });
      self.pending = [] ;
    };
    
    map.getLocation = function(id) {
      return self.locations[id]
    };

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'scottbeslow.ijk19b6c'
    }).addTo(map);
    
    map.wimrRefreshLocations();
    return map;
  }

})(jQuery, WIMR);