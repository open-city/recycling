(function($){
  
  var self = this;
  self.options = {
    opacity: 0.5,
    color: [127, 191, 255]
  }
  
  var methods = {
    init: function() {
      if (this.css('display') == 'static') {
        this.css('display', 'relative');
      }
      
      var rgba = "rgba(" + self.options.color.join(',') + "," + self.options.opacity.toString() +')';
      var $overlay = $("<div class='wimr-loading-overlay'></div>");
      $overlay.css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: this[0].scrollWidth,
        height: this[0].scrollHeight,
        backgroundColor: rgba
      });
      
      this.append($overlay);
    },
    
    clear: function() {
      this.find('.wimr-loading-overlay').remove();
    }
  };
  
  
  $.fn.wimrLoading = function(action, opts) {
    if ( !action || typeof action === 'object') {
      opts = action;
      action = 'init';
    }
    
    self.options = $.extend(options, opts);
    methods[action].apply(this);
  }

})(jQuery);