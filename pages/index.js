// import Link from "next/link";
import styled from "styled-components";

export default function HomePage({ handleLogin, handleLoginChange }) {
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
      <StyledSection>
        <form onSubmit={handleLogin}>
          <h3>CHOOSE YOUR PLAYERNAME:</h3>
          <div>
            <input
              type="text"
              onChange={handleLoginChange}
              placeholder="playername..."
              required
            />
            <button type="submit">Enter Lobby</button>
          </div>
        </form>
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

// import Link from "next/link";
// import styled from "styled-components";

// export default function HomePage() {
//   return (
//     <>
//       <h2>
//         TOTALLY <i>ZOMBIFIED</i> CHESS
//       </h2>
//       <h2>
//         TOTALLY <i>ZOMBIFIED</i> CHESS
//       </h2>
//       <h2>
//         TOTALLY <i>ZOMBIFIED</i> CHESS
//       </h2>
//       <StyledSection>
//         <h3>CHOOSE YOUR BOARD:</h3>
//         <div>
//           <Link href="/tutorials">
//             <StyledButton type="text">Tutorials</StyledButton>
//           </Link>
//         </div>
//         <div>
//           <Link href="/singleplayer">
//             <StyledButton type="text">Player VS RandomMoveMachine</StyledButton>
//           </Link>
//         </div>
//         <div>
//           <Link href="/prelobby">
//             <StyledButton type="text">Enter Game Lobby</StyledButton>
//           </Link>
//         </div>
//       </StyledSection>
//     </>
//   );
// }
