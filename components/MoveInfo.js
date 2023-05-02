import styled from "styled-components";

export default function MoveInfo({ previousMove, moveStatus }) {
  const piece = resolvePiece(previousMove.piece);

  function resolvePiece(piece) {
    switch (piece) {
      case "p":
        return "Pawn";
      case "b":
        return "Bishop";
      case "n":
        return "Knight";
      case "r":
        return "Rook";
      case "q":
        return "Queen";
      case "k":
        return "King";
      default:
        return "piece";
    }
  }

  const flag = resolveFlag(previousMove.flags);

  function resolveFlag(flag) {
    switch (flag) {
      case "b":
        return "pushed";
      case "e":
        return "CAPTURED EP";
      case "c":
        return "CAPTURED";
      case "p":
        return "PROMOTED";
      case "k":
        return "castled KS";
      case "q":
        return "castled QS";
      case "pc":
        return "CAPT&PROM";
      default:
        return "moved";
    }
  }

  return (
    <StyledSection>
      {moveStatus.moveNumber}: {previousMove.color === "w" ? "White" : "Black"}{" "}
      {piece} {flag} {previousMove.san} {moveStatus.inCheck && "Check!"}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  text-align: center;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
  h4,
  h3 {
    margin: 0;
  }
`;
