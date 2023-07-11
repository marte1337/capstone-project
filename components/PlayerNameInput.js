import { StyledInput } from "@/components/styles/InputStyles";
import { StyledSection } from "@/components/styles/SectionStyles";
import { StyledEnterGameButton } from "@/components/styles/ButtonStyles";

export default function PlayerNameInput({
  handleLogin,
  handleLoginChange,
  username,
}) {
  return (
    <>
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
