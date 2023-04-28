import styled from "styled-components";

export default function MoveInfo({ previousMove, moveStatus }) {
  console.log(previousMove);
  console.log(moveStatus);

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

  let flag;
  switch (previousMove.flags) {
    case "b":
      flag = "pushed two squares";
      break;
    case "e":
      flag = "CAPTURED en passant";
      break;
    case "c":
      flag = "CAPTURED";
      break;
    case "p":
      flag = "PROMOTED";
      break;
    case "k":
      flag = "castled kingside";
      break;
    case "q":
      flag = "castled queenside";
      break;
    case "pc":
      flag = "CAPTURED & PROMOTED";
      break;
    default:
      flag = "moved";
  }

  let gameEnd;
  if (moveStatus.isDraw) {
    gameEnd = "Draw!";
  } else if (moveStatus.isStalemate) {
    gameEnd = "Stalemate!";
  } else if (moveStatus.isThreefoldRep) {
    gameEnd = "Threefold Repetition - Draw!";
  } else {
    gameEnd = "Checkmate!";
  }

  return (
    <StyledSection>
      <h4>
        Move {moveStatus.moveNumber}: {previousMove.san}{" "}
        {moveStatus.inCheck && "Check!"}
      </h4>
      {previousMove.color === "w" ? "White" : "Black"} {piece} {flag}{" "}
      {previousMove.from}-{previousMove.to}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  text-align: center;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
  h4,
  h3 {
    margin: 0;
  }
`;
