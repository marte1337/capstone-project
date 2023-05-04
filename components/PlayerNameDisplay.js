import styled from "styled-components";

export default function PlayerNameDisplay({ playerName, oppenentName }) {
  return (
    <StyledContainer>
      <StyledBox>
        PLAYER: <br />
        <strong>{playerName}</strong>
      </StyledBox>
      <StyledBox>
        OPPONENT: <br />
        <strong>{oppenentName}</strong>
      </StyledBox>
    </StyledContainer>
  );
}

const StyledContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledBox = styled.div`
  text-align: center;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
`;
