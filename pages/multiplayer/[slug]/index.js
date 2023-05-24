import Pusher from "pusher-js";
import axios from "axios";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import MoveInfoMultiplayer from "@/components//MoveInfoMultiplayer";
import PlayerNameDisplay from "@/components/PlayerNameDisplay";
import GameTerminal from "@/components/GameTerminal";
import BoardWrapper from "@/components/BoardWrapper";

//prevents undefined
let pusher = null;

export default function MultiPlayerPage({ username }) {
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [fenHistory, setFenHistory] = useState([]);
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [showReplayBoard, setShowReplayBoard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showChat, setShowChat] = useState(true);
  const [messageToSend, setMessageToSend] = useState("");
  const [chatStorage, setChatStorage] = useState([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  const router = useRouter();
  const { slug } = router.query;
  const [oppenentName, setOpponentName] = useState(slug);

  useEffect(() => {
    pusher = new Pusher("2fd14399437ec77964ee", {
      // pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: "eu",
      authEndpoint: `../api/pusher/auth`,
      auth: { params: { username } },
    });

    // Subscribe to "presence-channel" (relying on user authorization)
    const channel = pusher.subscribe(`presence-board-${slug}`);

    // count: when a new member successfully subscribes to the channel
    channel.bind("pusher:subscription_succeeded", (members) => {
      setOnlineUsersCount(members.count);
    });

    // count: when a new member joins the chat
    channel.bind("pusher:member_added", (member) => {
      setOnlineUsersCount(channel.members.count);
      setOnlineUsers((prevState) => [
        ...prevState,
        { username: member.info.username },
      ]);
      setOpponentName(member.info.username);
    });

    // update count: when a member leaves the chat
    channel.bind("pusher:member_removed", (member) => {
      setOnlineUsersCount(channel.members.count);
      setUsersRemoved((prevState) => [...prevState, member.info.username]);
    });

    // ---PERFORM CHAT + MOVE---
    channel.bind(`chess-update-${slug}`, (data) => {
      const { username, message, chessmove } = data;

      if (chessmove) {
        const newGame = new Chess(chessmove);
        setGame(newGame);
        setFen(newGame.fen());
      }

      if (message.length > 1) {
        setChatStorage((prevState) => [...prevState, { username, message }]);
      }
    });

    // when closing channel: unsubscribe user
    return () => pusher.unsubscribe(`presence-board-${slug}`);
  }, [slug]);

  const handleSignOut = () => {
    pusher?.unsubscribe(`presence-board-${slug}`);
    router.push("/lobby");
  };

  // post chat to api
  const handleSubmit = async (event) => {
    event?.preventDefault();
    await axios.post("../api/pusher/presence-board", {
      chessmove: fen,
      message: messageToSend,
      username,
      slug,
    });
    setMessageToSend("");
  };
  // // :::::PUSHER-END:::::

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  //Without useEffect,fenHistory only updates one before last
  useEffect(() => {
    setFenHistory([...fenHistory, fen]);
    setMoveStatus({
      moveNumber: fenHistory.length,
      inCheck: game?.in_check(),
      isCheckmate: game?.in_checkmate(),
      isDraw: game?.in_draw(),
      isThreefoldRep: game?.in_threefold_repetition(),
      isStalemate: game?.in_stalemate(),
      gameOver: game?.game_over(),
    });
    //:::PUSHER:::
    handleSubmit();
  }, [fen]);

  // ---ZOMBIE FUNCTION => RESPAWN ZOMBIE => RESET GAME OBJECT WITH .fen()---
  function zombieMove(latestResult, game) {
    game.put(
      { type: latestResult.captured, color: latestResult.color },
      latestResult.from
    );
    const newGame = new Chess(game.fen());
    setGame(newGame);
    setFen(newGame.fen());

    const possibleMoves = game?.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }
  }

  // // ---MAKE A MOVE AND UPDATE GAME OBJECT---
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy?.move(move);
    setFen(gameCopy.fen());

    // ---CHECK FOR ZOMBIE PIECE---
    if (result?.flags === "c") {
      zombieMove(result, { ...game });
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  // // ---ON DROP = PASS MOVE TO makeAMove
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false; // check illegal move

    return true; // successful move
  }

  const handleOrientationToggle = () => {
    setBoardOrientation((prevOrientation) =>
      prevOrientation === "white" ? "black" : "white"
    );
  };

  const handleShowChatToggle = () => {
    setShowChat(!showChat);
  };

  const handleShowReplayBoard = () => {
    setShowReplayBoard(true);
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fenHistory.length);
  };
  const handlePreviousClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + fenHistory.length) % fenHistory.length
    );
  };

  return (
    <BoardWrapper>
      <>
        <StyledTitle>
          TOTALLY <i>ZOMBIFIED</i> CHESS
        </StyledTitle>
        {game && !showReplayBoard && (
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={boardOrientation}
            id={"PlayBoard"}
          />
        )}
        {showReplayBoard && (
          <>
            <h3>GAME REPLAY</h3>
            <Chessboard
              position={fenHistory[currentIndex]}
              boardOrientation={boardOrientation}
              id={"ReplayBoard"}
            />
          </>
        )}
        {moveStatus.gameOver && !showReplayBoard && (
          <GameTerminal moveStatus={moveStatus} />
        )}

        {!moveStatus.gameOver && (
          <MoveInfoMultiplayer
            moveData={fenHistory[fenHistory.length - 1]}
            moveStatus={moveStatus}
          />
        )}
        <PlayerNameDisplay playerName={username} oppenentName={oppenentName} />

        <StyledButton onClick={handleOrientationToggle}>
          Flip Board: {boardOrientation === "white" ? "Black" : "White"}
        </StyledButton>
        <StyledButton onClick={handleShowChatToggle}>
          {showChat ? "Hide Chat" : "Show Chat"}
        </StyledButton>

        {!showReplayBoard && moveStatus.gameOver && (
          <StyledButtonContainer>
            <StyledButton2 onClick={handleShowReplayBoard}>
              GAME REPLAY
            </StyledButton2>
            <StyledLink href="/prelobby">MAIN MENU</StyledLink>
          </StyledButtonContainer>
        )}
        {showReplayBoard && (
          <div>
            <StyledReviewButton onClick={handlePreviousClick}>
              Previous Move
            </StyledReviewButton>
            <StyledReviewButton onClick={handleNextClick}>
              Next Move
            </StyledReviewButton>
          </div>
        )}
      </>
      <>
        <StyledChat>
          <div>{onlineUsersCount} Player(s) online now</div>
          {showChat && (
            <section>
              <h2>GAMECHAT</h2>
              <StyledChatCanvas>
                {onlineUsers.map((user, id) => (
                  <div key={id}>
                    <small>
                      {" "}
                      <span>{user.username}</span> joined the game!
                    </small>
                  </div>
                ))}
                {usersRemoved.map((user, id) => (
                  <div key={id}>
                    <small>
                      {" "}
                      <span>{user}</span> left the game.
                    </small>
                  </div>
                ))}

                {chatStorage.map((chat, id) =>
                  chat.username === username ? (
                    <StyledMessageUser key={id}>
                      <small>{chat.username}:</small> {chat.message}
                    </StyledMessageUser>
                  ) : (
                    <StyledMessage key={id}>
                      <small>{chat.username}:</small> {chat.message}
                    </StyledMessage>
                  )
                )}
              </StyledChatCanvas>
              <div>
                <form onSubmit={handleSubmit} aria-label="Game Chat">
                  <StyledInput
                    name="chatInput"
                    type="text"
                    value={messageToSend}
                    onChange={(event) => setMessageToSend(event.target.value)}
                    placeholder="start typing...."
                    aria-label="Chat Input"
                  />
                  <StyledButton type="submit">Send</StyledButton>
                </form>
              </div>
              <div>
                <StyledButton onClick={handleSignOut}>Leave Board</StyledButton>
              </div>
              <small>Boad-ID: {slug}</small>
            </section>
          )}
        </StyledChat>
      </>
      {showReplayBoard && <small>Date: {new Date().toLocaleString()}</small>}
    </BoardWrapper>
  );
}

const StyledTitle = styled.h2`
  margin-top: 0;
  padding-top: 10px;
`;

const StyledButton = styled.button`
  text-align: center;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin: 0.5rem 1px;

  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin: 0 auto;
`;

const StyledReviewButton = styled.button`
  text-align: center;
  font-size: large;
  background-color: #2c2c2c;
  color: white;
  border-radius: 5px;
  margin: 0.5rem 1px;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

  &:hover {
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const StyledButton2 = styled.button`
  text-align: center;
  font-size: large;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  text-align: center;
  font-size: large;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const StyledChat = styled.section`
  max-width: 600px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 10px 1rem;
  margin: 10px;
  h2 {
    margin: 0;
    font-weight: 900;
    font-size: x-large;
    letter-spacing: 5px;
  }
  h4 {
    font-weight: 600;
    margin: 0.6rem;
  }
`;

const StyledChatCanvas = styled.div`
  height: 270px;
  background-color: #2c2c2c;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  overflow: auto;
`;

const StyledMessage = styled.div`
  text-align: left;
  background-color: white;
  overflow-wrap: break-word;
  color: black;
  border-radius: 5px;
  margin: 5px auto 5px 7rem;
  padding: 4px;
`;
const StyledMessageUser = styled.div`
  text-align: left;
  background-color: #8f43ee;
  overflow-wrap: break-word;
  color: white;
  border-radius: 5px;
  margin: 5px 7rem 5px auto;
  padding: 4px;
`;

const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.1rem;
`;
