import styled from "styled-components";

export default function GameTerminal({ moveStatus }) {
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
      <h4>{gameEnd}</h4>
      <StyledP>GAME OVER</StyledP>
    </StyledGameTerminal>
  );
}

const StyledGameTerminal = styled.section`
  text-align: center;
  background-color: black;
  color: white;
  padding: 10px 1rem;
  margin-top: 10px;
  h4 {
    margin: 0;
    padding: 2px;
  }
`;

const StyledP = styled.p`
  margin: 0;
  font-weight: 900;
  font-size: x-large;
  letter-spacing: 5px;
`;
