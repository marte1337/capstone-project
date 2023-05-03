import styled from "styled-components";
// import RandomMoveEngine from "@/components/Boards/RandomMoveEngine";
import ClickToMoveBoard from "@/components/Boards/ClickToMoveBoard";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        {/* <RandomMoveEngine /> */}
        {"..............."}
        <ClickToMoveBoard />
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
