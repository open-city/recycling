(function($){
  $(document).ready(function(){

    if ($('#map').length) {
  
      // WIMR is simply an application namespace,
      // defined in /views/_footer.ejs
      WIMR.map = WIMR.createMap('map');
      WIMR.dialog.showTemplate('search_form', {}, function(){
        $(window).one('locationsLoaded', function(){
          WIMR.dialog.hashChange();
        })
      });
      
      $('body').on('click', '.start-over', function(e){
        e.preventDefault();
        WIMR.map.wimrReset();
        WIMR.dialog.showTemplate('search_form');
        window.location.hash = "";
      });

      $(window).on('resize', function(){
        clearTimeout(WIMR.resizeTimer);
        WIMR.resizeTimer = setTimeout(function(){
          WIMR.reflow();
        }, 250);
      })
      
      $(window).on('hashchange', WIMR.dialog.hashChange);
    
    }
    
    $('form#contact-form').submit(WIMR.contactFormHandler);
    $('#fb-share').on('click', WIMR.fbShareHandler);
    $('#tw-share').on('click', WIMR.twShareHandler);
    
  })
})(jQuery);


/*******************
 * generic helpers
 * *****************/


WIMR.reflow = function() {
  if (!WIMR.map) return;
  setTimeout(function(){
    var contentWidth = $("#viewContent").outerWidth();
    var windowWidth  = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (contentWidth < (windowWidth * .75)) {
      var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      var navH = $("#main_nav").outerHeight(true);
      var contentHeight = winH - navH;
      $('#map').height(contentHeight);
      $('#viewWrapper').height(contentHeight).css('overflowX','auto');
    } else {
      $("#map").height(200);
      $("#viewWrapper").height('auto');
    }
    
    WIMR.map.invalidateSize();
  });
}

WIMR.formatDate = function(date) {
  date = new Date(date);
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var d = date.getDate();
  var m = months[ date.getMonth() ];
  var y = date.getFullYear();
  return m + " " + d + ", " + y;
}

WIMR.contactFormHandler = function (e) {

  e.preventDefault();
  var $form = $(this)
    , action = $(this).attr('action')
    , $resMsg = $(document).find('#response')
    , data = {
        name: $form.find('#name').val(),
        email: $form.find('#email').val(),
        subject: $form.find('#subject').val(),
        message: $form.find('#message').val(),
        g_recaptcha_response: grecaptcha.getResponse()
      }
    ;
  
  $form.wimrLoading();
  
  $.post(action, data, function (res) {
    $form.wimrLoading('clear');
    var clearForm = false;
    if (res.status == "200") {
      var response = "<strong>Thanks!</strong> Your message has been sent!";
      $resMsg.html(response);
      $resMsg.addClass('bg-success');
      clearForm = true;      
    } else {
      var response = "<strong>Oh no! An error occurred!</strong> ";
      response += "<br>" + res.message;
      $resMsg.html(response);
      $resMsg.addClass('bg-danger');
    }
    if (clearForm) {
      $('#name').val('');
      $('#email').val('');
      $('#message').val('');
    }
  });

};

/**
 * Parses the returned address from the Google Maps api 
 * into an object with properties 'street_number', 'route',
 * 'city', 'state', 'zip'
 */
WIMR.parseGoogleAddress = function(addr) {
  var ret = {};
  var propMap = {
    'administrative_area_level_1': 'state',
    'administrative_area_level_2': 'county',
    'locality': 'city',
    'postal_code': 'zip',
    'postal_code_suffix': 'zip_plus_four'   
  }
  addr.address_components.forEach(function(part){
    var googleProp = part.types[0];
    var prop = propMap[googleProp] || googleProp;
    ret[prop] = part.long_name;
  })
  ret.number_and_route = ret.street_number + ' ' + ret.route;
  ret.geometry = addr.geometry;
  return ret;
}

