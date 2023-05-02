import styled from "styled-components";
import RandomMoveEngine from "@/components/Boards/RandomMoveEngine";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        <RandomMoveEngine />
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
  padding: 2em 0;
`;
