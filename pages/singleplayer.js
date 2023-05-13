import styled from "styled-components";
import PlayerVsRandomMove from "@/components/Boards/PlayerVsRandomMove";

export default function SinglePlayerPage() {
  return (
    <StyledSection>
      <StyledDiv>
        <PlayerVsRandomMove />
      </StyledDiv>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDiv = styled.div`
  width: 80%;
  max-width: 800px;
  padding: 0.5rem 0;
`;
