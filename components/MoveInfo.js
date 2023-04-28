export default function MoveInfo({ previousMove }) {
  console.log(previousMove);

  let piece;
  switch (previousMove.piece) {
    case "p":
      piece = "Pawn";
      break;
    case "b":
      piece = "Bishop";
      break;
    case "n":
      piece = "Knight";
      break;
    case "r":
      piece = "Rook";
      break;
    case "q":
      piece = "Queen";
      break;
    case "k":
      piece = "King";
      break;
    default:
      piece = "piece";
  }

  return (
    <section>
      <h4>Previous Move: {previousMove.san}</h4>
      {previousMove.color === "w" ? "White" : "Black"} {piece} moved{" "}
      {previousMove.from} - {previousMove.to}
      <p>
        It´s {previousMove.color === "w" ? "Blacks" : "Whites"} turn. Make your
        move...
      </p>
    </section>
  );
}
