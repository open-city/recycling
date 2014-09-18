(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('finished', function($el){
    $el.find('a.start-over').click(function(e){
      e.preventDefault();
      WIMR.map.wimrReset();
      WIMR.dialog.showTemplate('search_form');
    });
    
    
    $el.find('form#email_form').submit(function(e){
      e.preventDefault();
      var action = $(this).attr('action');
      var email = $(this).find('#email_address').val();
      var $container = $(this).parent();
      
      $.post(action, {email: email}, function(resp){
        switch (resp.status) {
          case 'success':
            var path = "/templates/finished/email_success.ejs" ;
            var data = { email: resp.contact.email };
            break;
          
          case 'duplicate':
            var path = "/templates/finished/email_duplicate.ejs" ;
            var data = {};
            break;
          
          default:
            var path = "/templates/finished/email_error.ejs" ;
            var data = { message: resp.error_message };
            break;
        }

        var html = new EJS({url: path}).render(data);
        $container.html(html);
      });
    });
    
  });
})(jQuery, WIMR);