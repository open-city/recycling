(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('finished', function($el){
    $el.find('a.start-over').click(function(e){
      e.preventDefault();
      WIMR.map.wimrReset();
      WIMR.dialog.showTemplate('search_form');
    });
    
    // email form functionality defined
    // in app.js because it is common to
    // multiple pages...
    
  });
})(jQuery, WIMR);