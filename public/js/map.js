$(function(){
  var map = L.map('map').setView([41.881, -87.629], 11);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'scottbeslow.ijk19b6c'
    }).addTo(map);

  $.get('/locations.json')
    .done(function(response){
      for (var i = 0; i < response.locations.length; i++){
        var current_loc = response.locations[i]
        if(current_loc.latitude && current_loc.longitude){
          L.marker([current_loc.latitude, current_loc.longitude]).addTo(map)
          .bindPopup(current_loc.address);
        }
      }
    })

});
