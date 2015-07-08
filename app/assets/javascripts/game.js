function Game(html_id, opts, moveHook) {

  // ******************
  // initialize options
  // ******************

  var position = 'start';
  if(opts.position)
    position = opts.position;

  var orientation = 'white';
  if(opts.orientation)
    orientation = opts.orientation;

  var showNotation = false;
  if(opts.showNotation)
    showNotation = opts.showNotation;

  var draggable = true;
  if(opts.draggable)
    draggable = opts.draggable;

  var dropOffBoard = 'snapback';
  if(opts.dropOffBoard)
    dropOffBoard = opts.dropOffBoard;

  var moveList = [];
  if (opts.moveList)
    moveList = opts.moveList;

  // ******************
  // only allow legal moves
  // ******************

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  function onDragStart(source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) {
      return 'snapback';
    }else {
      //save to the move list
      moveList.push(move.san);
      moveHook(move.san);
    }

    updateStatus();
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd() {
    board.position(game.fen());
  };

  // ******************
  // integration functions
  // ******************

  function getConfig() {
    return {
      position: position,
      orientation: orientation,
      showNotation: showNotation,
      draggable: draggable,
      dropOffBoard: dropOffBoard,
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd
    };
  };

  var chess = new Chess();
  var board = new ChessBoard(html_id, this.getConfig());

  function move(move_string) {
    board.move(move_string);
  };

  function clearBoard() {
    board.clear();
  };

  function getMoveList(){
    return moveList;
  };

  // ******************
  // game status
  // ******************


  function updateStatus() {
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
    pgnEl.html(game.pgn());
  };

  updateStatus();
}