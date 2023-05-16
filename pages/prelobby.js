export default function PreGameLobby({ handleLogin, handleLoginChange }) {
  return (
    <>
      <form onSubmit={handleLogin}>
        <p>Enter your playername to start:</p>
        <div>
          <input
            type="text"
            onChange={handleLoginChange}
            placeholder="your playername"
          />
          <button type="submit">Sign in to get started</button>
        </div>
      </form>
    </>
  );
}
