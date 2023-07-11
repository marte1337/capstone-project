import HeaderLarge from "@/components/HeaderLarge";
import MainMenuBoardOptions from "@/components/MainMenuBoardOptions";
import styled, { keyframes } from "styled-components";
import { StyledMenuLinkButton } from "@/components/styles/ButtonStyles";

export default function MainMenu({ username }) {
  return (
    <>
      <HeaderLarge />
      <StyledPlayerName>{username}</StyledPlayerName>
      <MainMenuBoardOptions />
      {/* <StyledSection>
        <h3>CHOOSE YOUR BOARD:</h3>
        <StyledMenuLinkButton href="/tutorials">Tutorials</StyledMenuLinkButton>
        <StyledMenuLinkButton href="/singleplayer">
          Player VS RandomMoveMachine
        </StyledMenuLinkButton>
        <StyledMenuLinkButton href="/lobby">
          Enter Game Lobby
        </StyledMenuLinkButton>
      </StyledSection> */}
    </>
  );
}

// const StyledSection = styled.section`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   gap: 5px;
// `;

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
  margin: 4.8rem auto;
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
