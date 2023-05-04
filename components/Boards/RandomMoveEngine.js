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
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  console.log(moveStatus);

  //temporarily static player-names
  const playerName = "Player One";
  const oppenentName = "RandomMoveMachine";

  //---Create Game Object---
  useEffect(() => {
    setGame(new Chess());
  }, []);

  function safeGameMutate(modify) {
    setGame((game) => {
      const update = { ...game };
      modify(update);

      //gain BLACK move/gamestatus info (to be passed down)
      setPreviousMove(
        game.history({ verbose: true })[
          game.history({ verbose: true }).length - 1
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

      return update; // null if the move was illegal, the move object if the move was legal
    });
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

    //gain WHITE move/gamestatus info
    //safeGameMutate only updates with black moves (White moves/checkmates arent displayed)!
    setPreviousMove(
      game.history({ verbose: true })[
        game.history({ verbose: true }).length - 1
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

    //"thinking-time" before RandomMoveEngine trigger
    setTimeout(makeRandomMove, 800);
    //empty current legal move option data for next move
    setMoveFrom("");
    setOptionSquares({});
  }

  return (
    <>
      <h2>
        TOTALLY <i>UNHINGED</i> CHESS
      </h2>
      {game && (
        <Chessboard
          position={game.fen()}
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
