import styled from "styled-components";

export default function MoveInfo({ moveData, moveStatus }) {
  const piece = resolvePiece(moveData?.piece);

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

  const flag = resolveFlag(moveData?.flags);

  function resolveFlag(flag) {
    switch (flag) {
      case "b":
        return "pushes";
      case "e":
        return "CAPTURES EP";
      case "c":
        return "CAPTURES";
      case "p":
        return "PROMOTES";
      case "k":
        return "castles KS";
      case "q":
        return "castles QS";
      case "pc":
        return "CAPT&PROM";
      default:
        return "moves";
    }
  }

  return (
    <StyledSection>
      {moveData ? (
        <>
          {moveStatus.moveNumber}: {moveData.color === "w" ? "White" : "Black"}{" "}
          {piece} {flag} {moveData.san}{" "}
          {moveStatus.inCheck && <strong>Check!!</strong>}
        </>
      ) : (
        <>Make a move.</>
      )}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  text-align: center;
  background-color: #2c2c2c;
  color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-top: 0.5rem;

  padding: 0.2rem 0.5rem;
  h4,
  h3 {
    margin: 0;
  }
`;
