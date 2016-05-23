(function($){
  function SortableTable(tableEl) {
    this.currentSort = {};
    this.table = $(tableEl);
    this.sortSelector = $(tableEl + ' thead th a');
    this.tableBody = $(tableEl + ' tbody');
    this.tableRows = $(tableEl + ' tbody tr');
    $(this.sortSelector).on('click', function(event) {
      var sortField = $(event.target).data('sort');
      this.sortSelector = 'td.' + sortField;
      var rows = this.tableRows.clone(true);
      var frag = document.createDocumentFragment();
      var sortFunc = this.whichSort(sortField) ? this.sortDsc : this.sortAsc;
      var sorted = rows.sort(sortFunc);
      $(frag).append(sorted);
      $(this.tableBody).html(frag);
      this.currentSort = {
        field: sortField,
        desc: this.whichSort(sortField)
      };
    }.bind(this));
    this.sortDsc = function (a, b) {
      console.log(this.sortSelector);
      var current = +$(a).find(this.sortSelector).text();
      var next = +$(b).find(this.sortSelector).text();
      if (current < next) {
        return 1;
      } else {
        return -1;
      }
    }.bind(this);
    this.sortAsc = function (a, b) {
      if (+$(a).find(this.sortSelector).text() < +$(b).find(this.sortSelector).text()) {
        return -1;
      } else {
        return 1;
      }
    }.bind(this);
  }

  SortableTable.prototype.whichSort = function (selected) {
    if (this.currentSort.field === undefined) {
      return true;
    } else if (this.currentSort.field !== selected) {
      return true;
    } else if (this.currentSort.field === selected && this.currentSort.desc === true) {
      return false;
    } else if (this.currentSort.field === selected && this.currentSort.desc === false) {
      return true;
    }
    return false;
  };

  $(document).ready(function(){

    if ($('#map').length) {

      // WIMR is simply an application namespace,
      // defined in /views/_footer.ejs
      WIMR.map = WIMR.createMap('map');
      $("#mapSpinner .show").spin("show");

      WIMR.dialog.showTemplate('search_form', {}, function(){
        $(window).one('locationsLoaded', function(){
          $("#mapSpinner").hide();
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

    WIMR.getCounts();

    $('form#contact-form').submit(WIMR.contactFormHandler);
    $('#fb-share').on('click', WIMR.fbShareHandler);
    $('#tw-share').on('click', WIMR.twShareHandler);
    if ($('#reports_by_ward').length) {
      var ts = new SortableTable('#reports_by_ward');
    }
  });


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

})(jQuery);

window.onerror = function() {
  if (WIMR && WIMR.dialog) {
    WIMR.dialog.loading('clear');
  }
  return false; // allow default handlers to run
}

WIMR.getCounts = function() {
  $.getJSON('/locations/count.json')
    .done(function(data){
      $('#counts').removeClass('hidden')
      $('#locationCount').text(data.locationCount.commafy());
    })
    .fail(function(){});
  $.getJSON('/reports/count.json')
    .done(function(data){
      $('#reportCount').text(data.reportCount.commafy());
    })
    .fail(function(){});
};

String.prototype.commafy = function() {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
  });
}

Number.prototype.commafy = function() {
  return this.toString().commafy();
}
