function Game(html_id, opts, moveHook, id) {

  // ******************
  // initialize options
  // ******************

  this.gameID = id;

  this.position = 'start';
  if(opts.position)
    this.position = opts.position;

  this.orientation = 'white';
  if(opts.orientation)
    this.orientation = opts.orientation;

  this.showNotation = false;
  if(opts.showNotation)
    this.showNotation = opts.showNotation;

  this.draggable = true;
  if(opts.draggable)
    this.draggable = opts.draggable;

  this.dropOffBoard = 'snapback';
  if(opts.dropOffBoard)
    this.dropOffBoard = opts.dropOffBoard;

  this.moveList = [];
  if (opts.moveList)
    this.moveList = opts.moveList;

  this.statusEl = $(opts.statusElId || null);
  this.pgnEl = $(opts.pgnElId || null);

  _this = this;

  // ******************
  // only allow legal moves
  // ******************

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  this.onDragStart = function(source, piece, position, orientation) {
    if (chess.game_over() === true ||
        (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  this.onDrop = function(source, target) {
    // see if the move is legal
    var move = chess.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) {
      return 'snapback';
    }else {
      //save to the move list
      _this.moveList.push(move.san);
      moveHook(move.san);
    }

    _this.updateStatus();
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  this.onSnapEnd = function() {
    board.position(chess.fen());
  };

  // ******************
  // integration functions
  // ******************

  this.getConfig = function() {
    return {
      position: this.position,
      orientation: this.orientation,
      showNotation: this.showNotation,
      draggable: this.draggable,
      dropOffBoard: this.dropOffBoard,
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd
    };
  };

  var chess = new Chess();
  var board = new ChessBoard(html_id, this.getConfig());

  this.move = function(move_string) {
    chess.move(move_string);
    board.position(chess.fen());
    _this.updateStatus();
  };

  this.clearBoard = function() {
    board.clear();
  };

  this.getMoveList = function(){
    return moveList;
  };

  // ******************
  // game status
  // ******************


  this.updateStatus = function() {
    var status = '';

    var moveColor = 'White';
    if (chess.turn() === 'b') {
      moveColor = 'Black';
    }

    // checkmate?
    if (chess.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (chess.in_draw() === true) {
      status = 'Game over, drawn position';
    }

    // game still on
    else {
      status = moveColor + ' to move';

      // check?
      if (chess.in_check() === true) {
        _this.highlightCheck(moveColor, true);
        status += ', ' + moveColor + ' <strong>is in check</strong>';
      }else{
        _this.highlightCheck("Black", false);
        _this.highlightCheck("White", false);
      }
    }

    this.statusEl.html(status);
    this.pgnEl.html(chess.pgn());
  };

  this.highlightCheck = function(color, highlight) {
    var space = null;
    var piece = "wK";
    if(color == "Black")
      piece = "bK";

    var position = board.position();
    _.forIn(position, function(value, key){
      if(value == piece)
        space = key;
    });

    if(highlight) {
      $(".square-" + space).addClass("highlight-check");
    }else{
      $(".square-" + space).removeClass("highlight-check");
    }
  };

  this.updateStatus();
}