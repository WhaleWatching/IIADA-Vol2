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
  var scenes = $(),
    elem_body = $('body');
  var
    delegate = $.delegate_factory(elem_body);
  delegate('click.director', '[data-scene-director]', function () {
    director = $(this);
    scene_name = director.data('scene-director');
    jump(scene_name);
  });
  var jump = function (scene_name) {
    scene = scenes.filter('[data-scene=' + scene_name + ']');
    prev_scene = scenes.filter('.camera-on');
    if(scene.length > 1) {
      throw 'Scenes duplicated for ' + scene_name;
    } else if (scene.length === 0) {
      console.warn('Scene not found for ' + scene_name)
      return;
    }
    prev_scene.removeClass('camera-on');
    scene.addClass('camera-on');
    elem_body.trigger('scene:jump', [scene_name, prev_scene.data('scene')]);
  }
  var setScenes = function (_scenes) {
    if(_scenes instanceof $) {
      scenes = _scenes;
    } else if(typeof(_scenes) === 'string') {
      scenes = $(_scenes);
    } else {
      return false;
    }
    scenes = scenes.filter('[data-scene]');
    return true;
  }
  $.scene = {
    setScenes: setScenes,
    jump: jump
  };
})(jQuery, window, document);


(function ($, window, document) {
  var
    elem_body = $('body'),
    elem_loader = $('body>.loader'),
    elem_root = $('body>.root');
  var
    delegate = $.delegate_factory(elem_body);
  $(document).ready(function () {
    if(elem_loader.height() === 0) {
      elem_body.addClass('old-browser');
      return;
    }

    delegate('scene:jump', function () {
      $('body').scrollTop(0);
    });

    // #scene/navbar
    var scene_navbar = $('[data-scene=navbar]');
    delegate('scene:jump', function (event, scene_name, prev_scene_name) {
      if(scene_name === prev_scene_name) {
        return;
      }
      if(scene_name === 'navbar' && !scene_navbar.data('animation_id_0')) {
        scene_navbar.data('animation_id_0', setInterval(function () {
          scene_navbar.find('.auto-toggle-0').click();
        }, 1400));
        scene_navbar.data('animation_id_1', setInterval(function () {
          scene_navbar.find('.auto-toggle-1').click();
          setTimeout(function () {
            scene_navbar.find('.auto-toggle-1-later').click();
          },300);
        }, 2400));
        scene_navbar.data('animation_id_2', setInterval(function () {
          scene_navbar.find('.auto-toggle-2').click();
          setTimeout(function () {
            scene_navbar.find('.auto-toggle-2-later').click();
          },500);
        }, 3000));
      }
      if(prev_scene_name === 'navbar' && scene_navbar.data('animation_id_0')) {
        clearInterval(scene_navbar.data('animation_id_0'));
        clearInterval(scene_navbar.data('animation_id_1'));
        clearInterval(scene_navbar.data('animation_id_2'));
        scene_navbar.data('animation_id_0', false);
        scene_navbar.data('animation_id_1', false);
        scene_navbar.data('animation_id_2', false);
      }
    });


    $.scene.setScenes('[data-scene]');
    routie('scene scene/:sceneid', function (sceneid) {
      $.scene.jump(sceneid);
    });
    routie('', function () {
      $.scene.jump('cover');
    });
    setTimeout(function() {
      elem_body
        .removeClass('loading')
        .addClass('ready');
      // $(window).trigger('resize');
    }, 200);
  });
  // $(window).resize(function () {
  //   var targets = $('.exhibit-iframe.auto-resize');
  //   targets.each(function (index, original_element) {
  //     var element = $(original_element);
  //     console.log(element.parent().width());
  //     element.width(element.parent().width());
  //   })
  // });
})(jQuery, window, document);

