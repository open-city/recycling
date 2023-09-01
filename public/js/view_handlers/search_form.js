(function($, WIMR){

  WIMR.dialog.registerTemplateCallback('search_form', function($el) {
    var path = "/welcomemessage.md"
    $.get(path).done(d => $("#welcomemessage").html(marked.parse(d))).fail(err => console.log(err));

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
        $("#status").wimrStatus("Address is required", 'warning');

      } else {
        var addressParam = formatAddressRequest(address);
        var url = "https://nominatim.openstreetmap.org/search?format=jsonv2&dedupe=1&accept-language=en&countrycodes=us&q=" + addressParam;

        /**
         * GET /geocode.json, which is a proxy to the Google
         * Maps API for getting lat/longs of an address
         */
        $.get(url)
          .done(function (gResponse){
            var filteredResponse = filterGeocodeResponse(gResponse);
            // Geocode API returns a single result
            if (filteredResponse.length == 1){
              var address = filteredResponse[0]
                , latitude = address.lat
                , longitude = address.lon
                , viewVars = { formattedAddress: address.display_name }
                ;
              /**
               * Have lat/long, querying our database for existing reports
               **/
              $.get('/locations.json?latitude=' + latitude + '&longitude=' + longitude)
                .done(function(response) {
                  WIMR.dialog.loading('clear');
                  if (response.locations && response.locations.length >= 1) {
                    WIMR.dialog.renderExistingResult(response.locations[0], viewVars);
                  } else {
                    WIMR.dialog.renderNewResult(latitude, longitude, viewVars);
                  }
                })
                .fail(function(response) {
                  console.error("Errored while looking for an existing location");
                  WIMR.dialog.loading('clear');
              });

            // google returns multiple results or no results at all
            } else {
              var viewVars = {};
              viewVars.possibleAddresses = filteredResponse || [];
              viewVars.buildingsFoundMessage = filteredResponse.length + " buildings found" ;
              viewVars.possibleAddresses.forEach(function (obj) {
                obj.short_address = obj.number_and_route;
              });
              WIMR.dialog.showTemplate('search_results', viewVars);
            }

          })
          .fail(function (response){
            var status = "Sorry, either the address was incorrect or doesn't exist in " + WIMR.config.cityname + ".";
            $('#addressField').addClass('has-error');
            $('#status').wimrStatus(status, 'warning');
          });

      }
    });

  });

  function formatAddressRequest(inputAddress) {
    var city = WIMR.config.cityname;
    var state = WIMR.config.stateabbrev;
    return encodeURIComponent([inputAddress,city,state].join(','));
  }

  function filterGeocodeResponse(results) {
    return results.filter(result => result.addresstype == 'building')
  }

})(jQuery, WIMR);
