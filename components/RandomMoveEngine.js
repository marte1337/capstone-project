import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    setGame(new Chess());
  }, []);

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    //from chess.js V1_beta onwards: .game_over() => .isGameOver() - ect
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    // illegal move
    if (move === null) return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }

  // console.log(game.fen());
  // console.log(game.history());
  // console.log(game.in_check());
  // console.log(game.turn());
  // console.log(game.moves({ verbose: true }));
  // console.log(game.history({ verbose: true }));

  //get history-object from last move only
  console.log(
    game.history({ verbose: true })[game.history({ verbose: true }).length - 1]
  );

  return (
    <>
      <h2>Play against the RandomMoveMachine!</h2>
      {game && <Chessboard position={game.fen()} onPieceDrop={onDrop} />}
      <h3>You are playing as White. Make your move...</h3>
    </>
  );
}
