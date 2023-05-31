// import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { StyledTripleTitle } from "@/components/styles/TitleStyles";
import { StyledInput } from "@/components/styles/InputStyles";
import { StyledEnterGameButton } from "@/components/styles/ButtonStyles";

export default function HomePage({ handleLogin, handleLoginChange, username }) {
  return (
    <>
      <StyledTripleTitle>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </StyledTripleTitle>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <StyledImage
        src="/landing-image2.jpg"
        alt="zombies on a chessboard"
        width={300}
        height={300}
      />
      <StyledSection>
        <form onSubmit={handleLogin}>
          <h3>CHOOSE YOUR PLAYERNAME:</h3>
          <div>
            <StyledInput
              type="text"
              onChange={handleLoginChange}
              placeholder="Type here..."
              required
            />
            <StyledEnterGameButton type="submit">
              Enter Game
            </StyledEnterGameButton>
          </div>
        </form>
      </StyledSection>
    </>
  );
}

const StyledSection = styled.section`
  margin: 2rem 0;
`;

const StyledImage = styled(Image)`
  border: solid black 0.3rem;
  border-radius: 5px;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.5);
  margin-top: 0.8rem;
`;
