(function($, WIMR){
  WIMR.createMap = function(id) {
    var map = L.map(id, {
      maxZoom: 20
    }).setView([41.881, -87.629], 11);
    var self = this;
    self.locations = {};
    self.pending = [];
    self.clusterGroup = new L.MarkerClusterGroup({
      disableClusteringAtZoom: 16,
      maxClusterRadius: 40
    });
    map.addLayer(self.clusterGroup);

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
          var current_loc = response.locations[i];
          if (current_loc.geoJsonPoint) {
            map.addOrUpdateLocation(current_loc);
            locs[current_loc._id] = true;
          }
        }

        map.clearPendingLocations();

        $(window).trigger('locationsLoaded');
        if (callback) {
          callback();
        }

      });
    };

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
    };

    map.zoomToPin = function(loc) {
      var mkr = self.locations[loc._id];
      var lat = mkr.latitude;
      var lng = mkr.longitude;

      map.setView([lat,lng], 16);

      for (var id in self.locations) {
        self.locations[id].setIcon(defaultIcon);
      }
      mkr.setIcon(activeIcon);
      mkr.openPopup();
    };

    map.addOrUpdateLocation = function(loc) {
      var marker;
      var txt = loc.address + "<br>";
      txt += loc.reports.length;
      txt += loc.reports.length === 1 ? " report" : " reports";

      if (!self.locations[loc._id]) {
        var lat = loc.latitude;
        var lng = loc.longitude;

        marker = L.marker([lat,lng]);
        self.clusterGroup.addLayer(marker);
        marker.bindPopup(txt);
        marker.update();

        marker._id = loc._id;
        marker.latitude = lat;
        marker.longitude = lng;
        marker.address = loc.address;
        marker.reports = loc.reports;
        self.locations[loc._id] = marker;
      } else {
        marker = self.locations[loc._id];
        marker.reports = loc.reports;
        marker.unbindPopup();
        marker.bindPopup(txt);
        marker.update();
      }

      marker.on('click', function(e){
        window.location.hash = '/reports/' + this._id;
      });
    };

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
      mkr.setIcon(activeIcon);
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
        self.clusterGroup.removeLayer(mkr);
      });
      self.pending = [] ;
    };

    map.getLocation = function(id) {
      return self.locations[id];
    };

    L.tileLayer('http://api.tiles.mapbox.com/v4/smartchicagocollaborative.l45jl5j8/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic21hcnRjaGljYWdvY29sbGFib3JhdGl2ZSIsImEiOiJ5MzB1MHFNIn0.190SObdn-P8VvOWu7AQvVA', {
      maxZoom: 18,
      attribution: 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
    }).addTo(map);

    map.wimrRefreshLocations();
    return map;
  };

})(jQuery, WIMR);
