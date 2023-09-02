(function($, WIMR){
  WIMR.dialog.registerTemplateCallback('submit_report', function($el){
    var $form = $el.find('form');

    $form.submit(function(e){
      
      e.preventDefault();
      
      var data = {
        'address': $('.reported-address').text(),
        'latitude': $('input[name=latitude]').val(),
        'longitude': $('input[name=longitude]').val(),
        'comment': $('#comment').val()
      }
      
      var viewVars = {};
      viewVars.clientConfig = WIMR.clientConfig;
      WIMR.dialog.loading();
      $.post('/reports.json', data)
      .done(function(response){
        viewVars.infoMessage = "<p>Your report has been <strong>added to our registry</strong>!</p>";
        WIMR.map.wimrReset(function(){
          WIMR.map.wimrHighlightPin(response.location._id);
          WIMR.dialog.showTemplate('finished', viewVars);
        });
      })
      .fail(function(){
        viewVars.infoMessage = 'Failed to create your report, please try again';
        WIMR.dialog.showTemplate('finished', viewVars);
      })
    })
  });
})(jQuery, WIMR);
