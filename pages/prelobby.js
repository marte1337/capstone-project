export default function PreGameLobby({ handleLogin, handleLoginChange }) {
  return (
    <>
      <form onSubmit={handleLogin}>
        <p>Choose your Playername:</p>
        <div>
          <input
            type="text"
            onChange={handleLoginChange}
            placeholder="playername..."
          />
          <button type="submit">Enter Lobby</button>
        </div>
      </form>
    </>
  );
}
