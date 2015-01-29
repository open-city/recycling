(function($){
  
  $.fn.wimrStatus = function(message, level) {
    var $this = $(this);
    var levels = ['success','info','warning','danger'];
    var classes = levels.map(function(level){ return 'bg-' + level; });
    $this.removeClass( classes.join(' ') );

    if (!message) {
      $this.html("");
      return;
    }

    level = level || 'success';
    level = level.toLowerCase();
    if (!$.inArray(level, levels)) {
      level = 'info';
    }
    var statusClass = 'bg-' + level;

    $this.addClass(statusClass);
    $this.html(message);
  }

})(jQuery);