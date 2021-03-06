function Game(html_id, opts, moveHook, id) {

  // ******************
  // initialize options
  // ******************

  this.gameID = id;
  this.notMyTurn = false;
  this.moveListIndex = 0;

  this.position = 'start';
  if(opts.position)
    this.position = opts.position;

  this.orientation = 'white';
  if(opts.orientation)
    this.orientation = opts.orientation;

  if(this.orientation == 'black')
    this.notMyTurn = true;

  this.showNotation = false;
  if(opts.showNotation)
    this.showNotation = opts.showNotation;

  this.draggable = true;
  if(opts.draggable)
    this.draggable = opts.draggable;

  this.dropOffBoard = 'snapback';
  if(opts.dropOffBoard)
    this.dropOffBoard = opts.dropOffBoard;

  this.highlightLegalMoves = false;
  if(opts.highlightLegalMoves)
    this.highlightLegalMoves = opts.highlightLegalMoves;

  this.highlightPreviousMove = false;
  if(opts.highlightPreviousMove)
    this.highlightPreviousMove = opts.highlightPreviousMove;

  this.replayMode = false;
  if(opts.replayMode)
    this.replayMode = opts.replayMode;

  this.fens = [];
  if(opts.fens)
    this.fens = opts.fens;

  this.moveList = [];
  if (opts.moveList)
    this.moveList = opts.moveList;

  this.statusEl = $(opts.statusElId || null);
  this.pgnEl = $(opts.pgnElId || null);

  _this = this;

  // ******************
  // event handling
  // ******************

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  this.onDragStart = function(source, piece, position, orientation) {
    if (_this.replayMode || chess.game_over() === true || _this.notMyTurn ||
        (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  this.onDrop = function(source, target) {
    if(_this.highlightLegalMoves)
      _this.removeGreySquares();

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
      //disable moving
      _this.notMyTurn = true;

      // highlight white's move
      if(_this.highlightPreviousMove){
        _this.removeHighlights('white');
        $('.square-' + source).addClass('highlight-white');
        $('.square-' + target).addClass('highlight-white');
      }

      if (chess.in_draw() === true) {
        _this.moveList.push(move.san);
        moveHook(move.san + "$", _this.orientation, _this.getFEN());
      }
      else{
        //save to the move list
        _this.moveList.push(move.san);
        moveHook(move.san, _this.orientation, _this.getFEN());
      }
    }

    _this.updateStatus();
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  this.onSnapEnd = function() {
    board.position(chess.fen());
  };

  this.onMoveEnd = function(oldPos, newPos) {
    //enable moving again
    _this.notMyTurn = false;
  };

  this.onMouseoverSquare = function(square, piece) {
    if(!_this.highlightLegalMoves)
      return false;

    // get list of possible moves for this square
    var moves = chess.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    _this.greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      _this.greySquare(moves[i].to);
    }
  };

  this.onMouseoutSquare = function(square, piece) {
    if(!_this.highlightLegalMoves)
      return false;

    _this.removeGreySquares();
  };

  // ******************
  // integration functions
  // ******************

  this.getConfig = function() {
    return {
      pieceTheme: location.origin + '/img/chesspieces/wikipedia/{piece}.png',
      position: this.position,
      orientation: this.orientation,
      showNotation: this.showNotation,
      draggable: this.draggable,
      dropOffBoard: this.dropOffBoard,
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd,
      onMoveEnd: this.onMoveEnd,
      onMouseoutSquare: this.onMouseoutSquare,
      onMouseoverSquare: this.onMouseoverSquare
    };
  };

  var chess = new Chess();
  var board = new ChessBoard(html_id, this.getConfig());

  this.move = function(move_string) {
    var beforeKeys = _.keys(board.position());
    chess.move(move_string);
    board.position(chess.fen());
    _this.updateStatus();

    //highlight black
    if(_this.highlightPreviousMove){
      var afterKeys = _.keys(board.position());
      var fromSpace = null;
      beforeKeys.forEach(function(space){
        if(afterKeys.indexOf(space) == -1)
          fromSpace = space;
      });

      _this.removeHighlights('black');
      $('.square-' + fromSpace).addClass('highlight-black');
      $('.square-' + move_string).addClass('highlight-black');
    }
  };

  this.clearBoard = function() {
    board.clear();
  };

  this.getMoveList = function(){
    return moveList;
  };
  this.position = function(fen){
    board.position(fen);
    chess.fen(fen);
  }
  this.removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
  };

  this.greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.css('background', background);
  };

  this.changeHighlightLegalMoves = function(highlight) {
    this.highlightLegalMoves = highlight;
    if(!highlight)
      this.removeGreySquares();
  };

  this.changeHighlightPreviousMove = function(highlight) {
    this.highlightPreviousMove = highlight;
    if(!highlight){
      this.removeHighlights('black');
      this.removeHighlights('white');
    }
  };

  this.start = function(){
    board.start();
  };

  this.removeHighlights = function(color) {
    $('.square-55d63')
      .removeClass('highlight-' + color);
  };

  this.changeShowNotation = function(show) {
    if(this.showNotation != show) {
      this.showNotation = show;
      var cfg = this.getConfig();
      cfg.position = board.position();
      board = new ChessBoard(html_id, cfg);
    }
  };

  this.getFEN = function() {
    return board.fen();
  };

  this.initLinkedMoveList = function() {
    var moveNumber = 1;
    var html = "";
    this.pgnEl.html("");
    this.moveList.forEach(function(move, index){
      if(index % 2 == 0) {
        //even
        //add the moveNumber
        html = "<p><span>" + moveNumber + ". </span><span>" + this.buildMoveListLink(index, move) + "</span>";
        moveNumber++;
      } else {
        //odd
        html += "<span> " + this.buildMoveListLink(index, move) + "</span></p>";
        this.pgnEl.append(html);
        html = "";
      }
    }, this);
  };

  this.buildMoveListLink = function(value, string) {
    return "<a href='#' data-id='" + value + "'>" + string + "</a>";
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
    if(!this.replayMode)
      this.pgnEl.html(chess.pgn({ max_width: 10, newline_char: "<br />" }));
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

  // ******************
  // init
  // ******************

  this.updateStatus();

  if(this.replayMode)
    this.initLinkedMoveList();
}