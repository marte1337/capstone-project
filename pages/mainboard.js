import Board from "@/components/Board";
import styled from "styled-components";

export default function MainBoardPage() {
  return (
    <StyledDiv>
      <Board />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  max-width: 100vh;
`;
