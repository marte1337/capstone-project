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
