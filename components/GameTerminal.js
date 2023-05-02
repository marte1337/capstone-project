import styled from "styled-components";

export default function GameTerminal({ moveStatus }) {
  console.log(moveStatus);

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
      <h3>GAME OVER</h3>
    </StyledGameTerminal>
  );
}

const StyledGameTerminal = styled.section`
  text-align: center;
  background-color: black;
  color: white;
  padding: 10px 1rem;
  margin: 0;
  h4,
  h3 {
    margin: 0;
    padding: 2px;
  }
`;
