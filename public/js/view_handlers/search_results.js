(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('search_results', function($el){
    $rslts = $el.find('li.search-result a');
    $rslts.each(function(idx, obj){
      var $a = $(obj);
      $a.click(function(e){
        e.preventDefault();
        var theHref = $a.attr('href');
        var lat = $a.attr('data-latitude');
        var lng = $a.attr('data-longitude');
        var viewVars = {
          formattedAddress: $a.text()
        }
        
        WIMR.dialog.loading();
        $.get(theHref)
        .done(function(response){
          if(response.locations && response.locations.length >= 1){
            WIMR.dialog.renderExistingResult(response.locations[0], viewVars);
          } else {
            WIMR.dialog.renderNewResult(lat, lng, viewVars);
          }
        })
        .fail(function(){
          console.log("Error fetching location");
          WIMR.dialog.loading('clear');
        })
      });
    });
  });
})(jQuery, WIMR)