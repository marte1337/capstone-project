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

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  // // ---MAKE A MOVE AND UPDATE GAME OBJECT---
  function makeAMove(move) {
    // logs white and black "move" but only logs black previousMove!
    // console.log("log move from within makeMove:");
    // console.log(move);
    // console.log("log previousMove from within makeMove:");
    // console.log(previousMove);

    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);

    //gain data for moveStatus and previousMove
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

  // // ---ON DROP = PASS WHITE MOVE TO makeAMove + TRIGGER BLACK MOVE CREATION
  function onDrop(sourceSquare, targetSquare) {
    //trigger white makeAMove (sourcesquare, targetsquare, promotion)
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });

    if (move === null) return false; // check illegal move

    //"thinking-time" before black RandomMoveEngine trigger
    setTimeout(makeRandomMove, 800);

    // onDrop only logs white moves!
    // console.log("onDrop:");
    // console.log(move);

    return true;
  }

  // // ---CREATE A RANDOM MOVE FOR BLACK + PASS MOVE TO makeAMove---
  function makeRandomMove() {
    const possibleMoves = game.moves();
    //check game status (chess.js V1_beta onwards: .game_over() => .isGameOver() - ect)
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length); //create random move
    makeAMove(possibleMoves[randomIndex]); //trigger black makeAMove (only targetsquare)
  }

  // // ---CHECK FOR ZOMBIE PIECE => RESPAWN ZOMBIE => SET NEW GAME OBJECT WITH .fen() ---
  //  ---use previousMove to check captures (flags = "c")
  console.log("OUTSIDE makeMove: log previousMove + fen");
  console.log(previousMove);
  console.log(game?.fen());
  useEffect(() => {
    if (previousMove?.flags === "c") {
      const newGame = new Chess(game.fen());
      newGame.put(
        { type: previousMove.captured, color: previousMove.color },
        previousMove.from
      );
      setGame(newGame);
    }
  }, [previousMove]);

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
