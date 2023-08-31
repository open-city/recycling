(function($){
  function SortableTable(tableEl) {
    this.currentSort = {};
    this.table = $(tableEl);
    this.sortSelector = $(tableEl + ' thead th a');
    this.tableBody = $(tableEl + ' tbody');
    this.tableRows = $(tableEl + ' tbody tr');
    $(this.sortSelector).on('click', function(event) {
      event.preventDefault();
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
    WIMR.clientConfig = null
    if ($('#map').length) {
      $(window).one('locationsLoaded', function(){
        $("#mapSpinner").hide();
        WIMR.dialog.hashChange();
      });

      // WIMR is simply an application namespace,
      // defined in /views/_footer.ejs
      WIMR.map = WIMR.createMap('map');
      $("#mapSpinner .show").spin("show");

      $.getJSON("/clientconfig.json")
        .done(cc => WIMR.clientConfig = cc)
        .always(() => {
          WIMR.dialog.showTemplate('search_form', {clientConfig: WIMR.clientConfig});
      });

      $('body').on('click', '.start-over', function(e){
        e.preventDefault();
        WIMR.map.wimrReset();
        WIMR.dialog.showTemplate('search_form', {clientConfig: WIMR.clientConfig});
        window.location.hash = "";
      });

      $(window).on('resize', function(){
        clearTimeout(WIMR.resizeTimer);
        WIMR.resizeTimer = setTimeout(function(){
          WIMR.reflow();
        }, 250);
      });

      $(window).on('hashchange', WIMR.dialog.hashChange);

    }

    WIMR.getCounts();

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
      if (contentWidth < (windowWidth * 0.75)) {
        var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
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
  };

  WIMR.formatDate = function(date) {
    date = new Date(date);
    var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = date.getDate();
    var m = months[ date.getMonth() ];
    var y = date.getFullYear();
    return m + " " + d + ", " + y;
  };

})(jQuery);

window.onerror = function() {
  if (WIMR && WIMR.dialog) {
    WIMR.dialog.loading('clear');
  }
  return false; // allow default handlers to run
};

WIMR.getCounts = function() {
  $.getJSON('/locations/count.json')
    .done(function(data){
      $('#counts').removeClass('hidden');
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
};

Number.prototype.commafy = function() {
  return this.toString().commafy();
};
