import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import MoveInfo from "../MoveInfo";
import PlayerNameDisplay from "../PlayerNameDisplay";
import GameTerminal from "../GameTerminal";

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [fenHistory, setFenHistory] = useState([]);

  const latestMoveHistory = moveHistory[moveHistory.length - 1];

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "RandomMoveMachine";

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

  // ---TRIGGER BLACK MOVE---
  useEffect(() => {
    if (latestMoveHistory?.color === "w") {
      setFen(game.fen());
      setTimeout(makeRandomMove, 1200);
    }
  }, [latestMoveHistory]);

  // // ---CREATE A RANDOMMOVE---
  function makeRandomMove() {
    const possibleMoves = game?.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  //set up payload on game over
  if (game?.game_over()) {
    console.log("Date: ", new Date().toLocaleString());
    console.log("Player Names: ", playerName, ", ", oppenentName);
    console.log("Move History: ", moveHistory);
    console.log("Fen History: ", fenHistory);
  }

  return (
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
      <PlayerNameDisplay playerName={playerName} oppenentName={oppenentName} />
    </>
  );
}
