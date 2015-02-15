(function($, WIMR){
  
  WIMR.dialog.registerTemplateCallback('search_form', function($el) {
    
    var $form = $el.find('form');
    
    $form.submit(function(e){
      e.preventDefault();
      WIMR.dialog.loading();
      $("#addressField").removeClass('has-error');
      $("#status").wimrStatus("");
      
      var address = $form.find('#inputAddress').val();
      
      if ( address === "") {
        WIMR.dialog.loading('clear');
        $('#addressField').addClass('has-error');
        $("#status").wimrStatus("Address is required", 'warning')
        
      } else {
        var addressParam = formatAddressRequest(address);
        var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + addressParam;
      
      
        /**
         * GET /geocode.json, which is a proxy to the Google
         * Maps API for getting lat/longs of an address
         */
        $.get(url)
          .done(function (gResponse){
            var filteredResponse = filterGoogleResponse(gResponse.results);
            // Google returns a single result
            if (filteredResponse.length == 1){
              var address = filteredResponse[0]
                , latitude = address.geometry.location.lat
                , longitude = address.geometry.location.lng
                , viewVars = { formattedAddress: address.number_and_route }
                ;
              /**
               * Have lat/long, querying our database for existing reports
               **/
              $.get('/locations.json?latitude=' + latitude + '&longitude=' + longitude)
                .done(function(response){
                  WIMR.dialog.loading('clear');
                  if(response.locations && response.locations.length >= 1){
                    WIMR.dialog.renderExistingResult(response.locations[0], viewVars);
                  } else {
                    WIMR.dialog.renderNewResult(latitude, longitude, viewVars);
                  }
                })
                .fail(function(response){
                  console.error("Errored while looking for an existing location");
                  WIMR.dialog.loading('clear');
              })
              
            // google returns multiple results or no results at all
            } else {
              var viewVars = {};
              viewVars.possibleAddresses = filteredResponse || [];
              viewVars.buildingsFoundMessage = filteredResponse.length + " buildings found" ;
              viewVars.possibleAddresses.forEach(function(obj){
                obj.short_address = obj.number_and_route;
              })
              WIMR.dialog.showTemplate('search_results', viewVars);
            }

          })
          .fail(function (response){
            var status = "Sorry, either the address was incorrect or doesn't exist in Chicago.";
            $('#addressField').addClass('has-error');
            $('#status').wimrStatus(status, 'warning');
          });
    
      }
    });

  });


  function formatAddressRequest(inputAddress) {
    var city = 'Chicago';
    var state = 'IL';
    return encodeURIComponent([inputAddress,city,state].join(','));
  }

  function filterGoogleResponse(rslts) {
    var filtered = [];
    rslts.forEach(function(address){
      address = WIMR.parseGoogleAddress(address);
      if (address.street_number 
      &&  address.route
      &&  address.city === 'Chicago'
      &&  address.state === 'Illinois') {
        filtered.push(address);
      }
    });
    return filtered;
  }

})(jQuery, WIMR);