import Link from "next/link";
import styled, { keyframes } from "styled-components";

export default function MainMenu({ username }) {
  return (
    <>
      <StyledTitle>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </StyledTitle>
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

const StyledTitle = styled.h2`
  margin-top: 0;
  padding-top: 15px;
`;

const StyledSection = styled.section`
  margin: 5rem 0;
  align-items: center;
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #2c2c2c;
    border-color: #2c2c2c;
    color: beige;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px rgb(187, 255, 208); }
  50% { text-shadow: 1px 2px 30px rgba(250, 254, 255, 1); }
  100% { text-shadow: 0 0 5px rgb(187, 255, 208); }
`;

const StyledPlayerName = styled.h2`
  position: relative;
  max-width: 300px;
  overflow-wrap: break-word;
  border-radius: 25px;
  margin: 5rem auto;
  padding: 1rem;
  font-size: 2rem;
  color: #ffffff;
  animation: ${glowAnimation} 3s linear infinite;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("landing-image2.jpg");
    background-size: cover;
    background-position: center;
    z-index: -1;
    border-radius: 5px;
    animation: moveBackground 10s linear infinite;
  }

  @keyframes moveBackground {
    0% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(-2px);
    }
  }
`;
