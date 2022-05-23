chess = new Chess();
let san_notation = "";
let validation_on = true;

const change_validation = () => {
  if (validation_on) {
    $("#validation").attr("class", "btn btn-danger");
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
  let move = source + "-" + target;

  san_notation = chess.move(move, { sloppy: true }).san;
  console.log(san_notation);
}
