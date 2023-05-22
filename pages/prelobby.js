import Link from "next/link";
import styled, { keyframes } from "styled-components";

export default function MainMenu({ username }) {
  return (
    <>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <StyledPlayerName>{username}</StyledPlayerName>
      <StyledSection>
        <h3>CHOOSE YOUR BOARD:</h3>
        <div>
          <Link href="/tutorials">
            <StyledButton type="text">Tutorials</StyledButton>
          </Link>
        </div>
        <div>
          <Link href="/singleplayer">
            <StyledButton type="text">Player VS RandomMoveMachine</StyledButton>
          </Link>
        </div>
        <div>
          <Link href="/lobby">
            <StyledButton type="text">Enter Game Lobby</StyledButton>
          </Link>
        </div>
      </StyledSection>
    </>
  );
}

const StyledSection = styled.section`
  margin: 5rem 0;
`;

const StyledButton = styled.button`
  text-align: center;
  font-size: large;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
`;

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 7px rgba(253, 2, 219, 0.8); }
  50% { text-shadow: 0 0 30px rgba(187, 255, 208, 0.9); }
  100% { text-shadow: 0 0 7px rgba(253, 2, 219, 0.8); }
`;

const StyledPlayerName = styled.h2`
  border-radius: 25px;
  background-color: black;
  margin: 4rem 3.5rem;
  padding: 1rem;
  text-align: center;
  font-size: 2rem;
  color: #ffffff;
  animation: ${glowAnimation} 3s linear infinite;
`;
