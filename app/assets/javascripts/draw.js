$(document).ready(function() {
  var canvas = null;
  var ctx = null;
  var color = '#8fd0ff';

  function clear() {
    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
  }

  function drawLine(ax, ay, bx, by) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  function registerListeners(canvas) {
    var imageData = null;
    canvas.on("mousedown", function(e) {
      var ax = e.offsetX;
      var ay = e.offsetY;
      imageData = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);
      canvas.on("mousemove", function (ev) {
        var bx = ev.offsetX;
        var by = ev.offsetY;
        clear();
        ctx.putImageData(imageData, 0, 0);
        drawLine(ax, ay, bx, by);
      });
    });
    $(document).on("mouseup", function(e) {
      canvas.off("mousemove");
    });
  }

  function createCanvas() {
    var board = $('#board');
    var height = board.height();
    var width = board.width();
    var x = board.offset().left;
    var y = board.offset().top;
    var el = $('<canvas></canvas>')
                  .attr({
                    width: width+'px',
                    height: height+'px',
                  })
                  .css({
                    position: 'absolute',
                    left: x+'px',
                    top: y+'px',
                    width: width+'px',
                    height: height+'px',
                    cursor: 'crosshair',
                  });
    registerListeners(el);
    $('body').append(el);
    return el;
  }

  $('#toggle-mode-button').on('click', function(e) {
    el = $(this)
    if (el.data('mode') === 'play') {
      el.data('mode', 'draw');
      el.html('Switch to Play Mode');
      canvas = createCanvas();
      ctx = canvas[0].getContext('2d');
    } else if (el.data('mode') === 'draw') {
      el.data('mode', 'play');
      el.html('Switch to Draw Mode');
      ctx = null;
      canvas.remove();
      canvas = null;
    }
  });
});
