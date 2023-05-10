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

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "Player Two";

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  // // ---CREATE SEPERATE GAME HISTORY TO BYPASS GAME RESETS---
  function historyStorage() {
    if (
      history[history.length - 1]?.color !==
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

  // // ---CHECK FOR ZOMBIE PIECE => RESPAWN ZOMBIE => SET NEW GAME OBJECT WITH .fen() ---
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
      moveNumber: game.history().length,
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

  // // ---ON DROP = PASS WHITE MOVE TO makeAMove + TRIGGER BLACK MOVE CREATION
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false; // check illegal move
    return true;
  }

  console.log(history);

  return (
    <>
      <h2>
        TOTALLY <i>UNHINGED</i> CHESS
      </h2>
      {game && <Chessboard position={fen} onPieceDrop={onDrop} />}
      {moveStatus.gameOver && <GameTerminal moveStatus={moveStatus} />}
      {previousMove ? (
        <MoveInfo previousMove={previousMove} moveStatus={moveStatus} />
      ) : (
        <p>Make your first move.</p>
      )}
      <PlayerNameDisplay playerName={playerName} oppenentName={oppenentName} />
    </>
  );
}
