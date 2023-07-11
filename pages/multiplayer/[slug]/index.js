import Pusher from "pusher-js";
import axios from "axios";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import HeaderSmall from "@/components/HeaderSmall";
import MoveInfoMultiplayer from "@/components//MoveInfoMultiplayer";
import PlayerNameDisplay from "@/components/PlayerNameDisplay";
import GameTerminal from "@/components/GameTerminal";
import BoardWrapper from "@/components/BoardWrapper";
import {
  StyledButton,
  StyledReplayButton,
  StyledLinkButton,
  StyledMultiPlayerButtonContainer,
  StyledMultiPlayerButton,
} from "@/components/styles/ButtonStyles";
import {
  StyledChat,
  StyledChatCanvas,
  StyledMessage,
  StyledMessageUser,
  StyledInput,
} from "@/components/styles/ChatMultiPlayerStyles";

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

  const [showChat, setShowChat] = useState(false);
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
        <HeaderSmall />
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

        <StyledMultiPlayerButton onClick={handleOrientationToggle}>
          Flip Board: {boardOrientation === "white" ? "Black" : "White"}
        </StyledMultiPlayerButton>
        <StyledMultiPlayerButton onClick={handleShowChatToggle}>
          {showChat ? "Hide Chat/Options" : "Show Chat/Options"}
        </StyledMultiPlayerButton>

        {!showReplayBoard && moveStatus.gameOver && (
          <StyledMultiPlayerButtonContainer>
            <StyledButton onClick={handleShowReplayBoard}>
              GAME REPLAY
            </StyledButton>
            <StyledLinkButton href="/mainmenu">MAIN MENU</StyledLinkButton>
          </StyledMultiPlayerButtonContainer>
        )}
        {showReplayBoard && (
          <div>
            <StyledReplayButton onClick={handlePreviousClick}>
              Previous Move
            </StyledReplayButton>
            <StyledReplayButton onClick={handleNextClick}>
              Next Move
            </StyledReplayButton>
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
                  <StyledMultiPlayerButton type="submit">
                    Send
                  </StyledMultiPlayerButton>
                </form>
              </div>
              <div>
                <StyledMultiPlayerButton onClick={handleSignOut}>
                  Leave Board
                </StyledMultiPlayerButton>
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
