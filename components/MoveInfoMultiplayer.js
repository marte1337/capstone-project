import styled from "styled-components";

export default function MoveInfoMultiplayer({ moveData, moveStatus }) {
  const turn = moveData?.charAt(moveData.indexOf(" ") + 1);

  return (
    <StyledSection>
      {moveStatus.moveNumber > 0 ? (
        <>
          Move No. {moveStatus.moveNumber}
          {moveStatus.inCheck && <strong> Check!! </strong>} -{" "}
          {turn === "w" ? "Whites Turn!" : "Blacks Turn!"}
        </>
      ) : (
        <>Choose a side - White begins.</>
      )}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  text-align: center;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
  padding: 0.2rem 0.5rem;
  h4,
  h3 {
    margin: 0;
  }
`;
