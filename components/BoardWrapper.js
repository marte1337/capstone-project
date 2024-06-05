import styled from "styled-components";

export default function BoardWrapper({ children }) {
  return (
    <StyledSection>
      <StyledDiv>{children}</StyledDiv>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDiv = styled.div`
  width: 90%;
  max-width: 550px;
  padding: 0.5rem 0;
`;
