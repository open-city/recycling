(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('finished', function($el){
    $el.find('a.start-over').click(function(e){
      e.preventDefault();
      WIMR.map.wimrReset();
      WIMR.dialog.showTemplate('search_form');
    });
    
    $el.find('form#email_form').submit(WIMR.emailFormHandler);
    
  });
})(jQuery, WIMR);