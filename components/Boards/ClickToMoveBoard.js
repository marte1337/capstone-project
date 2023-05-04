import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";

export default function ClickToMoveBoard() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    setGame(new Chess());
  }, []);

  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  function safeGameMutate(modify) {
    setGame((game) => {
      const update = { ...game };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
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

  //---ON SQUARE CLICK---
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

    // --trigger random move--
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // checks illegal move, if invalid => reset setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    //"thinking-time" before RandomMoveEngine trigger
    setTimeout(makeRandomMove, 800);
    //empty current legal move option data for next move
    setMoveFrom("");
    setOptionSquares({});
  }

  return (
    <div>
      <h2>Player VS RandomMoveMachine on Click-2-Move-Board</h2>
      {game && (
        <Chessboard
          id="ClickToMove"
          animationDuration={200}
          arePiecesDraggable={false}
          position={game.fen()}
          onSquareClick={onSquareClick}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "1px 2px 30px white",
          }}
          customSquareStyles={{
            ...optionSquares,
          }}
        />
      )}
    </div>
  );
}
