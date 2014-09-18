(function($){
  $(document).ready(function(){
    
    // WIMR is simply an application namespace,
    // defined in /views/index.ejs
    WIMR.map = WIMR.createMap('map');

    WIMR.dialog.showTemplate('search_form');
    
    $('body').on('click', '.start-over', function(e){
      e.preventDefault();
      WIMR.map.wimrReset();
      WIMR.dialog.showTemplate('search_form');
    });
    
    WIMR.reflow();
    $(window).on('resize', function(){
      clearTimeout(WIMR.resizeTimer);
      WIMR.resizeTimer = setTimeout(function(){
        WIMR.reflow();
      }, 250);
    })
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

WIMR.reflow = function() {
  var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  var navH = $("#main_nav").outerHeight(true);
  var contentHeight = winH - navH;
  $('#map').height(contentHeight);
  $('#viewContent').height(contentHeight).css('overflowX','auto');
}