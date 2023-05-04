import styled from "styled-components";
// import RandomMoveEngine from "@/components/Boards/RandomMoveEngine";
import CustomMovesTestBoard from "@/components/Boards/CustomMovesTestBoard";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        {/* <RandomMoveEngine /> */}
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
  max-width: 1000px;
  padding: 0.5rem 0;
`;
