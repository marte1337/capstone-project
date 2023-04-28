import styled from "styled-components";
// import Board from "@/components/Boards/Board";
import RandomMoveEngine from "@/components/Boards/RandomMoveEngine";
// import ClickToMoveBoard from "@/components/Boards/ClickToMoveBoard";

export default function MainBoardPage() {
  return (
    <StyledSection>
      <StyledDiv>
        <RandomMoveEngine />
        {/* {" - - - - - - - - - - - -"} */}
        {/* <Board /> */}
        {/* {" - - - - - - - - - - - -"} */}
        {/* <ClickToMoveBoard /> */}
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
