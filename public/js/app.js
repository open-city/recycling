(function($){
  $(document).ready(function(){

    if ($('#map').length) {
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
      });
    }
    
    $('form#email_form').submit(function(e){
      e.preventDefault();
      var action = $(this).attr('action');
      var email = $(this).find('#email_address').val();
      var $respText = $(this).find('.response');
      
      $.post(action, {email: email}, function(resp){
        
        var clearForm = false;
        switch (resp.status) {
          case 'success':
            var response = "<strong>Thanks!</strong> " ;
            response += "We've added " + resp.contact.email + " to our mailing list.";
            clearForm = true;
            break;
          
          case 'duplicate':
            var response = "<strong>Thanks!</strong> " ;
            response += "We already have " + email + " on our mailing list.";
            clearForm = true;
            break;
          
          default:
            var response = "<strong>Oh no! An error occurred!</strong> ";
            response += "<br>" + resp.message;
            break;
        }

        $respText.html(response);
        if (clearForm) {
          $('#email_address').val('');
        }
      });
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

WIMR.reflow = function() {
  var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  var navH = $("#main_nav").outerHeight(true);
  var contentHeight = winH - navH;
  $('#map').height(contentHeight);
  $('#viewContent').height(contentHeight).css('overflowX','auto');
}