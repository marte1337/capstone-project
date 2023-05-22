// import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

export default function HomePage({ handleLogin, handleLoginChange, username }) {
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
            <StyledButton type="submit">Enter Game</StyledButton>
          </div>
        </form>
      </StyledSection>
    </>
  );
}

const StyledSection = styled.section`
  margin: 2rem 0;
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
  padding: 0.5rem 0.5rem;
`;

const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.5rem;
`;

const StyledImage = styled(Image)`
  border: solid black 0.3rem;
  border-radius: 5px;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.5);
  margin-top: 0.8rem;
`;
