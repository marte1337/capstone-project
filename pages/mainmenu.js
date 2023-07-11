import HeaderLarge from "@/components/HeaderLarge";
import MainMenuBoardOptions from "@/components/MainMenuBoardOptions";
import { StyledPlayerName } from "@/components/styles/PlayerNameStyles";

export default function MainMenu({ username }) {
  return (
    <>
      <HeaderLarge />
      <StyledPlayerName>{username}</StyledPlayerName>
      <MainMenuBoardOptions />
    </>
  );
}
