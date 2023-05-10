import styled from "styled-components";
import CustomMovesTestBoard from "@/components/Boards/CustomMovesTestBoard";
import PlayerVsRandomMove from "@/components/Boards/PlayerVsRandomMove";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        <PlayerVsRandomMove />
        <CustomMovesTestBoard />
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
