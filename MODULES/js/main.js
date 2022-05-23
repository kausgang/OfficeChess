game = new Chess();
let san_notation = "";
let validation_on = true;
// let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

let i = 0;

var config = {
  draggable: true,
  // dropOffBoard: 'snapback', // this is the default
  position: "start",
  orientation: "white",
  dropOffBoard: "trash",
  sparePieces: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

var board = Chessboard("board", config);

function savefen() {
  // Save Current position as a FEN string

  let FEN = board.fen();

  //check if user wants to give a name to the fen
  //   let name = prompt("Want to give a Name: ");

  //   let name_fen = "";

  // if name is entered, add name to the FEN string
  //   if (name) name_fen = name;
  //   else name_fen = FEN;
  if (validation_on) name_fen = game.pgn();
  else name_fen = FEN;

  let tr =
    '<tr>\
                     <th scope="row" data-FEN=' +
    FEN +
    ">" +
    '<a href="#">' +
    "fen-" +
    ++i +
    "</th>\
                    <td>" +
    name_fen +
    '</td>\
                    <td><a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons"></i></a></td>\
                </tr>';

  $("#tablerow").append(tr);
}

$("#flipboard").on("click", board.flip);
$("#startboard").on("click", board.start);
$("#clearboard").on("click", board.clear);
$("#savefen").on("click", savefen);

// load the board position if fen hyperlink is clicked
$("#fentable").on("click", "th", function () {
  var move_fen = $(this).data().fen;
  board.position(move_fen);
});

// Delete row on delete button click
$(document).on("click", ".delete", function () {
  $(this).parents("tr").remove();
});

function onDragStart(source, piece, position, orientation) {
  if (validation_on) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // only pick up pieces for the side to move
    if (
      (game.turn() === "w" && piece.search(/^b/) !== -1) ||
      (game.turn() === "b" && piece.search(/^w/) !== -1)
    ) {
      return false;
    }
  }
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}
const change_validation = () => {
  if (validation_on) {
    $("#validation").attr("class", "btn btn-danger disabled");
    $("#validation").html("Validation - OFF");
    validation_on = false;
  } else {
    $("#validation").attr("class", "btn btn-success");
    $("#validation").html("Validation - ON");
    validation_on = true;
  }
};

$("#validation").on("click", change_validation);

function onDrop(source, target, piece, newPos, oldPos, orientation) {
  if (validation_on) {
    var move = game.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";

    updateStatus();
  }

  //   let move = source + "-" + target;
  //   if (validation_on) {
  //     move_obj = game.move(move, { sloppy: true });
  //     if (move_obj !== null) {
  //       $("#san_moves").append(move_obj.san, ",");
  //     } else {
  //       old_fen = Chessboard.objToFen(oldPos);
  //       go_back(old_fen);
  //       //   alert("Invalid Move");
  //       //   change_validation();
  //       //   $("#validation").attr("class", "btn btn-danger disabled");
  //       //   console.log(old_fen);
  //       //   board.clear;
  //       //   board.position(old_fen);
  // }
  //   }
}

function updateStatus() {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }

  //   $status.html(status);
  //   $fen.html(game.fen());
  $("#san_moves").html(game.pgn());
}
