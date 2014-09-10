(function($){
  $(document).ready(function(){
    
    // WIMR is simply an application namespace,
    // defined in /views/index.ejs
    WIMR.map = WIMR.createMap('map');

    WIMR.dialog.showTemplate('search_form');
  })
})(jQuery);

