import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import MoveInfo from "../MoveInfo";
import PlayerNameDisplay from "../PlayerNameDisplay";
import GameTerminal from "../GameTerminal";

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState(game?.fen());
  const [previousMove, setPreviousMove] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [history, setHistory] = useState([]);

  const latestHistory = history[history.length - 1];

  console.log(history);

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "RandomMoveMachine";

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  // // ---CREATE SEPERATE GAME HISTORY TO BYPASS GAME RESETS---
  function historyStorage() {
    if (
      latestHistory?.color !==
      game?.history({ verbose: true })[
        game.history({ verbose: true }).length - 1
      ]?.color
    ) {
      setHistory([
        ...history,
        game?.history({ verbose: true })[
          game.history({ verbose: true }).length - 1
        ],
      ]);
    }
  }

  // // ---CHECK FOR ZOMBIE PIECE => RESPAWN ZOMBIE => RESET GAME OBJECT WITH .fen()---
  //  ---use previousMove to check captures (flags = "c")
  useEffect(() => {
    if (previousMove?.flags === "c") {
      game.put(
        { type: previousMove.captured, color: previousMove.color },
        previousMove.from
      );
      const newGame = new Chess(game.fen());
      setGame(newGame);
      setFen(newGame.fen());
      historyStorage();
    }
  }, [previousMove]);

  // // ---MAKE A MOVE AND UPDATE GAME OBJECT---
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    // setGame(gameCopy);
    setFen(gameCopy.fen());

    setPreviousMove(
      gameCopy.history({ verbose: true })[
        gameCopy.history({ verbose: true }).length - 1
      ]
    );

    setMoveStatus({
      moveNumber: history.length + 1,
      inCheck: game.in_check(),
      isCheckmate: game.in_checkmate(),
      isDraw: game.in_draw(),
      isThreefoldRep: game.in_threefold_repetition(),
      isStalemate: game.in_stalemate(),
      gameOver: game.game_over(),
    });

    historyStorage();

    return result; // null if the move was illegal, the move object if the move was legal
  }

  //---RandomMoveEngine---
  function makeRandomMove() {
    const possibleMoves = game.moves();

    //check game status (chess.js V1_beta onwards: .game_over() => .isGameOver() - ect)
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }
    //create random move and feed it to makeAMove()
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  // // ---ON DROP = PASS WHITE MOVE TO makeAMove + TRIGGER BLACK MOVE CREATION
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false; // check illegal move

    //"thinking-time" before RandomMoveEngine trigger
    setTimeout(makeRandomMove, 800);
    return true;
  }

  return (
    <>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      {game && <Chessboard position={fen} onPieceDrop={onDrop} />}
      {moveStatus.gameOver && <GameTerminal moveStatus={moveStatus} />}
      {previousMove ? (
        <MoveInfo previousMove={latestHistory} moveStatus={moveStatus} />
      ) : (
        <p>Make your first move.</p>
      )}
      <PlayerNameDisplay playerName={playerName} oppenentName={oppenentName} />
    </>
  );
}
