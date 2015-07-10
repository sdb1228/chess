var game = null;

$(document).ready(function(){

  //display the move list

  //make an array of the move list

  var cfg = {
    draggable: false,
    statusElId: '#status',
    pgnElId: '#pgn'
  };
  $("#gameDiv").show();
  $("#game-list-panel").hide();
  $("#header").text("Play chess!")
  game = new window.Game('board', cfg, connection.sendMove, gameID);


  var board,
    boardEl = $('#board'),
    game = new Chess(),
    squareClass = 'square-55d63',
    squareToHighlight,
    colorToHighlight;
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');
    var moveAnimator;
    var canAnimate = true;

  var updateStatus = function() {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
      moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw() === true) {
      status = 'Game over, drawn position';
    }

    // game still on
    else {
      status = moveColor + ' to move';

      // check?
      if (game.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
      }
    }

    statusEl.html(status);
    fenEl.html(game.fen());
    pgnEl.html(game.pgn({ max_width: 12, newline_char: "<br />" }));

  };

  var makeRandomMove = function() {


    var possibleMoves = game.moves({
      verbose: true
    });

    // exit if the game is over
    if (game.game_over() === true ||
      game.in_draw() === true ||
      possibleMoves.length === 0) return;

    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    var move = possibleMoves[randomIndex];

    if (move.color === 'w') {
      boardEl.find('.' + squareClass).removeClass('highlight-white');
      boardEl.find('.square-' + move.from).addClass('highlight-white');
      squareToHighlight = move.to;
      colorToHighlight = 'white';
    }
    else {
      boardEl.find('.square-55d63').removeClass('highlight-black');
      boardEl.find('.square-' + move.from).addClass('highlight-black');
      squareToHighlight = move.to;
      colorToHighlight = 'black';
    }

    game.move(possibleMoves[randomIndex].san);
    board.position(game.fen());
    if(!canAnimate){
      moveAnimator = setTimeout(makeRandomMove, 1000);
    }

  };

  var onMoveEnd = function() {
    updateStatus();
    boardEl.find('.square-' + squareToHighlight)
      .addClass('highlight-' + colorToHighlight);

  };
  function myFunction() {
      canAnimate = false;
      moveAnimator = setTimeout(makeRandomMove, 500);
      $('.start').prop('disabled', true);
      $('#stop').prop('disabled', false);
  }

  function myStopFunction() {
    $('.start').prop('disabled', false);
      $('#stop').prop('disabled', true);
      clearTimeout(moveAnimator);
      canAnimate = true;
  }

  var cfg = {
    position: 'start',
    onMoveEnd: onMoveEnd
  };
  board = new ChessBoard('board', cfg);
});