// https://gist.github.com/WhaleWatching/7f231c720066300bf8dd
(function ($, window, document) {
  if(!$) {
    throw 'jQuery required';
  }
  delegate = function(argu) {
    var delegate_history, handle, off_history, target;
    if (typeof argu === 'string') {
      target = $(argu);
    } else if (argu instanceof $) {
      target = argu;
    } else {
      throw 'Argument should be selector string or jQuery object';
    }
    if (target.length !== 1) {
      throw 'Error: Delegate element must be one(should be the root element)';
    }
    delegate_history = [];
    off_history = [];
    handle = function() {
      delegate_history.push(arguments);
      return target.on.apply(target, arguments);
    };
    handle.off = function() {
      off_history.push(arguments);
      return target.off.apply(target, arguments);
    };
    handle.delegate_history = delegate_history;
    handle.off_history = off_history;
    handle.selector = target.selector;
    return handle;
  }
  $.delegate_factory = delegate;
})(jQuery, window, document);

(function ($, window, document) {
  var
    elem_body = $('body'),
    elem_ip6p = $('.ip6p');
  var
    delegate = $.delegate_factory(elem_body);
  delegate('click.golden', '.switch-phone', function () {
    console.log($(this).data('image'));
    elem_ip6p.css({backgroundImage: 'url(' + $(this).data('image') + ')'});
  });
  delegate('click.full-screen', '.full-screen', function () {
    var html = $('html')[0];
    var requestMethod = html.requestFullScreen || html.webkitRequestFullScreen || html.mozRequestFullScreen || html.msRequestFullscreen;
    requestMethod.call(html);
  });
  delegate('mousewheel.disable-frame', 'iframe', function (event) {
    console.log(event);
    event.preventDefault();
    event.stopImmediatePropagation();
  })
})(jQuery, window, document);