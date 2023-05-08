import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import MoveInfo from "../MoveInfo";
import PlayerNameDisplay from "../PlayerNameDisplay";
import GameTerminal from "../GameTerminal";

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [previousMove, setPreviousMove] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "RandomMoveMachine";

  //---Create game object---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  //---make a move and add it to game object -> move = square---
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);

    //gain move/gamestatus info (to be passed down)
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

    return result; // null if the move was illegal, the move object if the move was legal
  }

  // //---respawn captured piece as a zombie if applicable---

  useEffect(() => {
    if (previousMove?.flags === "c") {
      const newGame = new Chess(game.fen());
      newGame.put(
        { type: previousMove.captured, color: previousMove.color },
        previousMove.from
      );
      // setGame(game.clear());
      setGame(newGame);
    }
  }, [previousMove]);

  // game?.put({ type: "n", color: "w" }, "h5");
  // game?.put({ type: "n", color: "w" }, "h4");
  console.log(game?.fen());

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

  //---trigger RandomMoveEngine "on drop"---
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity sake
    });
    console.log(move);
    // checks illegal move
    if (move === null) return false;

    //"thinking-time" before RandomMoveEngine trigger
    setTimeout(makeRandomMove, 800);
    return true;
  }

  return (
    <>
      <h2>
        TOTALLY <i>UNHINGED</i> CHESS
      </h2>
      {game && <Chessboard position={game.fen()} onPieceDrop={onDrop} />}
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
