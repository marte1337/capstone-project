// import Board from "@/components/Board";
import RandomMoveEngine from "@/components/RandomMoveEngine";
import styled from "styled-components";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        <RandomMoveEngine />
        {/* <Board /> */}
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
