(function ($, window, document) {
  var
    elem_body = $('body'),
    elem_loader = $('body>.loader'),
    elem_root = $('body>.root');
  $(document).ready(function () {
    if(elem_loader.height() === 0) {
      elem_body.addClass('old-browser');
      return;
    }
    setTimeout(function() {
      elem_body
        .removeClass('loading')
        .addClass('ready');
      }, 300);
  });
})(jQuery, window, document);