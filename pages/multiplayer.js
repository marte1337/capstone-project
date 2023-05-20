import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import MoveInfo from "@/components//MoveInfo";
import PlayerNameDisplay from "@/components/PlayerNameDisplay";
import GameTerminal from "@/components/GameTerminal";
import BoardWrapper from "@/components/BoardWrapper";

import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";

//prevents undefined
let pusher = null;

export default function MultiPlayerPage({ username }) {
  // // ____PlayerVsPlayer______
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [fenHistory, setFenHistory] = useState([]);
  // // ____PlayerVsPlayer______

  // // :::::PUSHER:::::
  const router = useRouter();
  const [messageToReceive, setMessageToReceive] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  useEffect(() => {
    pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: "eu",
      authEndpoint: `api/pusher/auth`,
      auth: { params: { username } },
    });

    // Subscribe to "presence-channel" (relying on user authorization)
    const channel = pusher.subscribe("presence-board");

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
    });

    // update count: when a member leaves the chat
    channel.bind("pusher:member_removed", (member) => {
      setOnlineUsersCount(channel.members.count);
      setUsersRemoved((prevState) => [...prevState, member.info.username]);
    });

    // ---PERFORM CHAT---
    channel.bind("chess-update", (data) => {
      const { username, message } = data;
      setMessageToReceive((prevState) => [...prevState, { username, message }]);
    });

    // when closing channel: unsubscribe user
    return () => pusher.unsubscribe("presence-board");
  }, [username]);

  const handleSignOut = () => {
    pusher?.unsubscribe("presence-board");
    router.push("/");
  };

  // post chat to api
  const handleSubmit = async (event) => {
    // console.log(event.target.elements.chatInput.value);
    // setMessageToSend(event.target.elements.chatInput.value);
    event.preventDefault();
    await axios.post("/api/pusher/presence-board", {
      message: messageToSend,
      username,
    });
    setMessageToSend("");
  };

  // useEffect(() => {
  //   console.log(messageToReceive[messageToReceive.length - 1]?.message);
  //   makeAMove(messageToReceive[messageToReceive.length - 1]?.message);
  // }, []);

  // makeAMove(messageToReceive[messageToReceive.length - 1]?.message);
  // console.log(messageToReceive[messageToReceive.length - 1]?.message);
  // console.log(messageToReceive);
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const inputValue = event.target.elements.myInput.value;
  //   console.log(inputValue);
  //   makeAMove(inputValue);
  // };
  // // :::::PUSHER:::::

  const latestMoveHistory = moveHistory[moveHistory.length - 1];

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "Player Two";

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  // // ---CREATE SEPERATE MOVE/FEN HISTORY TO BYPASS GAME RESETS---
  function historyStorage(latestResult) {
    if (latestResult !== null) {
      setMoveHistory([...moveHistory, latestResult]);
    }
  }
  //Without useEffect,fenHistory only updates one before last
  useEffect(() => {
    setFenHistory([...fenHistory, fen]);
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
    const result = gameCopy.move(move);
    setFen(gameCopy.fen());

    // ---CHECK FOR ZOMBIE PIECE---
    if (result?.flags === "c") {
      zombieMove(result, { ...game });
    }

    // fetch move-history/game-data
    historyStorage(result);
    setMoveStatus({
      moveNumber: moveHistory.length + 1,
      inCheck: game.in_check(),
      isCheckmate: game.in_checkmate(),
      isDraw: game.in_draw(),
      isThreefoldRep: game.in_threefold_repetition(),
      isStalemate: game.in_stalemate(),
      gameOver: game.game_over(),
    });
    // console.log("send this to server: ", result?.san);
    // setMessageToSend(result?.san);
    // handleSubmit();

    return result; // null if the move was illegal, the move object if the move was legal
  }

  // // ---ON DROP = PASS WHITE MOVE TO makeAMove + TRIGGER BLACK MOVE CREATION
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false; // check illegal move

    return true; // successful move
  }

  return (
    <BoardWrapper>
      <>
        <h2>
          TOTALLY <i>ZOMBIFIED</i> CHESS
        </h2>
        {game && <Chessboard position={fen} onPieceDrop={onDrop} />}
        {moveStatus.gameOver && <GameTerminal moveStatus={moveStatus} />}
        {latestMoveHistory ? (
          <MoveInfo moveData={latestMoveHistory} moveStatus={moveStatus} />
        ) : (
          <p>Make a move...</p>
        )}
        {/* <PlayerNameDisplay
          playerName={playerName}
          oppenentName={oppenentName}
        /> */}

        <form onSubmit={handleSubmit}>
          <input type="text" name="myInput" />
          <button type="submit">Submit Move</button>
        </form>
      </>
      <>
        <p>
          Hello, <span>{username}</span>
        </p>
        <div>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
        <div>{onlineUsersCount} user(s) online now</div>

        <h2>Chat</h2>
        <div>
          {onlineUsers.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user.username}</span> joined the chat!
              </small>
            </div>
          ))}

          {usersRemoved.map((user, id) => (
            <small key={id}>
              {" "}
              <span>{user}</span> left the chat.
            </small>
          ))}
        </div>

        <div>
          {messageToReceive.map((chat, id) => (
            <div key={id}>
              <p>{chat.message}</p>
              <small>{chat.username}</small>
            </div>
          ))}
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <input
              name="chatInput"
              type="text"
              value={messageToSend}
              // Fix  setMessageToSend on Submit
              onChange={(event) => setMessageToSend(event.target.value)}
              placeholder="start typing...."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </>
    </BoardWrapper>
  );
}

// // :::::::::::::WORKING VERSION CHATROOM ONLY:::::::::::::::::::::::

// import PlayerVsPlayer from "@/components/Boards/PlayerVsPlayer";
// import BoardWrapper from "@/components/BoardWrapper";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Pusher from "pusher-js";
// import axios from "axios";

// //prevents undefined
// let pusher = null;

// export default function MultiPlayerPage({ username }) {
//   // // :::::PUSHER:::::
//   const router = useRouter();
//   const [messageToReceive, setMessageToReceive] = useState([]);
//   const [messageToSend, setMessageToSend] = useState("");
//   const [onlineUsersCount, setOnlineUsersCount] = useState(0);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [usersRemoved, setUsersRemoved] = useState([]);

//   useEffect(() => {
//     // pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
//     pusher = new Pusher("2fd14399437ec77964ee", {
//       cluster: "eu",
//       authEndpoint: `api/pusher/auth`,
//       auth: { params: { username } },
//     });

//     // Subscribe to "presence-channel" (relying on user authorization)
//     const channel = pusher.subscribe("presence-board");

//     // count: when a new member successfully subscribes to the channel
//     channel.bind("pusher:subscription_succeeded", (members) => {
//       setOnlineUsersCount(members.count);
//     });

//     // count: when a new member joins the chat
//     channel.bind("pusher:member_added", (member) => {
//       setOnlineUsersCount(channel.members.count);
//       setOnlineUsers((prevState) => [
//         ...prevState,
//         { username: member.info.username },
//       ]);
//     });

//     // update count: when a member leaves the chat
//     channel.bind("pusher:member_removed", (member) => {
//       setOnlineUsersCount(channel.members.count);
//       setUsersRemoved((prevState) => [...prevState, member.info.username]);
//     });

//     // ---PERFORM CHAT---
//     channel.bind("chess-update", (data) => {
//       const { username, message } = data;
//       setMessageToReceive((prevState) => [...prevState, { username, message }]);
//       // makeAMove(messageToReceive.message);
//     });

//     // when closing channel: unsubscribe user
//     return () => pusher.unsubscribe("presence-board");
//   }, [username]);

//   const handleSignOut = () => {
//     pusher?.unsubscribe("presence-board");
//     router.push("/");
//   };

//   // post chat to api
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     await axios.post("/api/pusher/presence-board", {
//       message: messageToSend,
//       username,
//     });
//     setMessageToSend("");
//   };
//   // // :::::PUSHER:::::

//   return (
//     <BoardWrapper>
//       {/* <PlayerVsPlayer username={username} /> */}
//       <div>
//         <p>
//           Hello, <span>{username}</span>
//         </p>
//         <div>
//           <button onClick={handleSignOut}>Sign out</button>
//         </div>
//         <div>{onlineUsersCount} user(s) online now</div>

//         <h2>Chat</h2>
//         <div>
//           {onlineUsers.map((user, id) => (
//             <div key={id}>
//               <small>
//                 {" "}
//                 <span>{user.username}</span> joined the chat!
//               </small>
//             </div>
//           ))}

//           {usersRemoved.map((user, id) => (
//             <small key={id}>
//               {" "}
//               <span>{user}</span> left the chat.
//             </small>
//           ))}
//         </div>

//         <div>
//           {messageToReceive.map((chat, id) => (
//             <div key={id}>
//               <p>{chat.message}</p>
//               <small>{chat.username}</small>
//             </div>
//           ))}
//         </div>

//         <div>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               value={messageToSend}
//               onChange={(event) => setMessageToSend(event.target.value)}
//               placeholder="start typing...."
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       </div>
//     </BoardWrapper>
//   );
// }
