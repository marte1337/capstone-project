import { StyledMenuLinkButton } from "@/components/styles/ButtonStyles";
import { StyledBoardOptionsSection } from "./styles/SectionStyles";

export default function MainMenuBoardOptions() {
  return (
    <>
      <StyledBoardOptionsSection>
        <h3>CHOOSE YOUR BOARD:</h3>
        <StyledMenuLinkButton href="/tutorials">Tutorials</StyledMenuLinkButton>
        <StyledMenuLinkButton href="/singleplayer">
          Player VS RandomMoveMachine
        </StyledMenuLinkButton>
        <StyledMenuLinkButton href="/lobby">
          Enter Game Lobby
        </StyledMenuLinkButton>
      </StyledBoardOptionsSection>
    </>
  );
}
