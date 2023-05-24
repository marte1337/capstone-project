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

  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

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
  // function makeAMove(move) {
  //   const gameCopy = { ...game };
  //   const move = gameCopy?.move(move);
  //   setFen(gameCopy.fen());

  //   // ---CHECK FOR ZOMBIE PIECE---
  //   if (move?.flags === "c") {
  //     zombieMove(move, { ...game });
  //   }

  //   return move; // null if the move was illegal, the move object if the move was legal
  // }

  // // ---ON DROP = PASS MOVE TO makeAMove
  function onSquareClick(square) {
    // reset getMoveOptions if user clicks on a new/different square
    // set moveFrom if new square has legal moves
    function resetFirstMove(square) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
    }
    // if moveForm is falsy - new square does not have legal moves => resetFirstMove and return (do not trigger random move)
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    // --trigger move--
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setFen(gameCopy.fen());

    // ---CHECK FOR ZOMBIE PIECE---
    if (move?.flags === "c") {
      zombieMove(move, { ...game });
    }

    // checks illegal move, if invalid => reset setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    //empty current legal move option data for next move
    setMoveFrom("");
    setOptionSquares({});
  }

  //---GET MOVE OPTIONS---
  function getMoveOptions(square) {
    //game.moves({ square: "e4", verbose: true }) returns a list of legal moves from the current position
    //array of objects: {color: 'w', from: 'e4', to: 'e5', flags: 'n', piece: 'p', …}
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }
    //map over .to-value in moves, push value + background-color styles to newSquares-object
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          //.get(square): returns the piece on the square or null
          //game.get('a5') -> { type: 'p', color: 'b' }
          game.get(move.to) &&
          //different background if move.to piece color is !== color of piece from clicked square
          //(means move.to piece is enemy => gets red background)
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(255,0,0,.4) 60%, transparent 85%)"
            : "radial-gradient(circle, rgba(85,0,133,.4) 32%, transparent 45%)",
      };
      return move;
    });
    //also push current square (/w yellow background) to newSquares
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
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
        <h2>
          TOTALLY <i>ZOMBIFIED</i> CHESS
        </h2>
        {game && !showReplayBoard && (
          <Chessboard
            position={fen}
            boardOrientation={boardOrientation}
            id={"PlayBoard"}
            animationDuration={200}
            arePiecesDraggable={false}
            onSquareClick={onSquareClick}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "1px -2px 30px white",
            }}
            customSquareStyles={{
              ...optionSquares,
            }}
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

        {!showReplayBoard && moveStatus.gameOver && (
          <>
            <StyledButton onClick={handleShowReplayBoard}>
              Game Replay
            </StyledButton>
            <Link href="/prelobby">
              <StyledButton type="text">Main Menu</StyledButton>
            </Link>
          </>
        )}
        {showReplayBoard && (
          <>
            <div>
              <StyledButton onClick={handlePreviousClick}>
                Previous Move
              </StyledButton>
              <StyledButton onClick={handleNextClick}>Next Move</StyledButton>
            </div>
            <div>
              <small>Date: {new Date().toLocaleString()}</small>
            </div>
          </>
        )}

        <StyledButton onClick={handleOrientationToggle}>
          Switch View: {boardOrientation === "white" ? "Black" : "White"}
        </StyledButton>
        <StyledButton onClick={handleShowChatToggle}>
          {showChat ? "Hide Chat" : "Show Chat"}
        </StyledButton>
      </>
      <>
        <StyledChat>
          <div>{onlineUsersCount} user(s) online now</div>
          {showChat && (
            <section>
              <h2>GAMECHAT</h2>
              <div>
                {chatStorage.map((data, index) => (
                  <StyledMessage key={index}>
                    <small>{data.username}:</small> {data.message}
                  </StyledMessage>
                ))}
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <StyledInput
                    name="chatInput"
                    type="text"
                    value={messageToSend}
                    onChange={(event) => setMessageToSend(event.target.value)}
                    placeholder="start typing...."
                  />
                  <StyledButton type="submit">Send</StyledButton>
                </form>
              </div>

              <div>
                <StyledButton onClick={handleSignOut}>Leave Board</StyledButton>
              </div>
              <small>Boad-ID: {slug}</small>
              <div>
                {/* show online users */}
                {onlineUsers.map((user, index) => (
                  <div key={index}>
                    <small>
                      {" "}
                      <span>{user.username}</span> joined Game!
                    </small>
                  </div>
                ))}
                {/* show users leaving the chat */}
                {usersRemoved.map((user, index) => (
                  <div key={index}>
                    <small>
                      {" "}
                      <span>{user}</span> left Game.
                    </small>
                  </div>
                ))}
              </div>
            </section>
          )}
        </StyledChat>
      </>
    </BoardWrapper>
  );
}

const StyledButton = styled.button`
  text-align: center;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
`;

const StyledChat = styled.section`
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 10px 1rem;
  margin: 5px 10px;
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

const StyledMessage = styled.div`
  background-color: white;
  color: black;
  border-radius: 5px;
  margin: 5px 3rem;
  padding: 3px 0;
`;

const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.1rem;
`;
