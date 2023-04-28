import styled from "styled-components";

export default function gameTerminal({ previousMove, moveStatus }) {
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
    <StyledGameTerminal>
      {!moveStatus.gameOver && (
        <h4>
          {previousMove.color === "w" ? "Blacks turn." : "Whites turn."}{" "}
          {moveStatus.inCheck
            ? "CAREFUL, your King is in check!!"
            : "Make a SICK move..."}
        </h4>
      )}
      {moveStatus.gameOver && <h3>{gameEnd} GAME OVER!</h3>}
    </StyledGameTerminal>
  );
}

const StyledGameTerminal = styled.section`
  background-color: black;
  color: white;
  padding: 10px 1rem;
  margin: 0;
  h4,
  h3 {
    margin: 0;
  }
`;
