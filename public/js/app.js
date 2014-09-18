(function($){
  $(document).ready(function(){
    
    // WIMR is simply an application namespace,
    // defined in /views/index.ejs
    WIMR.map = WIMR.createMap('map');

    WIMR.dialog.showTemplate('search_form');
    
    $('#main_nav a.home').click(function(e){
      e.preventDefault();
      WIMR.map.wimrReset();
      WIMR.dialog.showTemplate('search_form');
    });
  })
})(jQuery);


/*******************
 * generic helpers
 * *****************/

/**
 * formats a short address from the
 * full address returned by the google
 * maps api
 */
WIMR.shortAddress = function(gAddr) {
  var addr = gAddr.address_components[0].short_name;
  addr += " ";
  addr += gAddr.address_components[1].short_name;
  return addr;
}
