(function($, WIMR){
  WIMR.getDialog = function(){
    
    var self = this;
    var $element = $("#viewContent");
    var $wrapper = $("#viewWrapper");
    var callbacks = {};
    
    self.hashRoutes = {
      'reports': function(params){
        var report_id = params[0];
        var loc = WIMR.map.getLocation(report_id);
        WIMR.dialog.renderExistingResult(loc, {
          formattedAddress: loc.address
        });
      }
    }
    
    
    self.publicMethods = {
      registerTemplateCallback: function(tplName, callback) {
        callbacks[tplName] = callbacks[tplName] || [];
        callbacks[tplName].push(callback)
      },

      getTemplateCallbacks: function(tplName) {
        return callbacks[tplName] || [];
      },
      
      showTemplate: function(tplName, data, callback) {
        WIMR.dialog.loading('clear');
        var path = "/templates/" + tplName + ".ejs" ;
        data = data || {};
        var html = new EJS({url: path}).render(data);
        $element.html(html);
        $('html, body').scrollTo(0, 0);
        $wrapper.scrollTo(0, 0);
        
        var tplCallbacks = self.publicMethods.getTemplateCallbacks(tplName);
        if (callback) tplCallbacks.push(callback);

        $.each(tplCallbacks, function(idx, cb){
          cb($element);
        });
        WIMR.reflow();
      },
      
      /**
       * Takes response from /locations.json?latitude=xxx&longitude=xxx
       * and renders result template
       */
      renderExistingResult: function(loc, viewVars) {
        viewVars = viewVars || {};
        WIMR.map.zoomToPin(loc);
        viewVars.comments = [];
        viewVars.reportCount = loc.reports.length;
        loc.reports.forEach(function(report){
          if (report.comment.replace(/\s/g,'')) {
            var comment = {
              text: report.comment,
              date: WIMR.formatDate(report.date)
            }
            viewVars.comments.push(comment);
          }
        });
        
        viewVars.latitude  = loc.latitude;
        viewVars.longitude = loc.longitude;
        self.publicMethods.showTemplate('submit_report', viewVars);
      },
      
      /**
       * Renders reporting template if no results are found for that lat/long
       */
      renderNewResult: function(latitude, longitude, viewVars) {
        viewVars = viewVars || {};
        var mkr = WIMR.map.dropPin(latitude, longitude, {
          popupText: viewVars.formattedAddress
        });
        WIMR.map.addPendingLocation(mkr);
        viewVars.reportCount = 0;
        viewVars.latitude = latitude;
        viewVars.longitude = longitude;
        viewVars.comments = [];
        self.publicMethods.showTemplate('submit_report', viewVars);
      },
      
      loading: function(arg) {
        if (arg === 'clear') {
          $wrapper.wimrLoading('clear');
        } else {
          $wrapper.wimrLoading();
        }
      },

      hashChange: function(e) {
        console.log('hashChange')
        var hash = window.location.hash;
        var a = hash.split('/');
        a.shift();
        var loc = a.shift();
        var params = a;
        
        if (self.hashRoutes[loc]) {
          self.hashRoutes[loc](params)
        }
      }
    }
    
    return self.publicMethods;
  }
  
  WIMR.dialog = WIMR.getDialog();
})(jQuery, WIMR);
