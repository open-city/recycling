(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('finished', function($el){
      
    $el.find('form#email_form').submit(WIMR.emailFormHandler);
    
  });
})(jQuery, WIMR);