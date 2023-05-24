import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import Link from "next/link";
import MoveInfo from "../MoveInfo";
import PlayerNameDisplay from "../PlayerNameDisplay";
import GameTerminal from "../GameTerminal";
import styled from "styled-components";

export default function RandomMoveEngine({ username }) {
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [previousMove, setPreviousMove] = useState(null);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [fenHistory, setFenHistory] = useState([]);
  const [showReplayBoard, setShowReplayBoard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  const latestMoveHistory = moveHistory[moveHistory.length - 1];

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
  function safeGameMutate(modify) {
    setGame((game) => {
      const update = { ...game };
      modify(update);
      setFen(game.fen());

      // // ---CHECK FOR ZOMBIE PIECE---
      // if (result?.flags === "c") {
      //   zombieMove(result, { ...game });
      // }
      // fetch move-history/game-data

      // historyStorage(result);
      setPreviousMove(
        game.history({ verbose: true })[
          game.history({ verbose: true }).length - 1
        ]
      );
      setMoveStatus({
        moveNumber: moveHistory.length + 1,
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

  // // ---ON DROP = PASS WHITE MOVE TO makeAMove + TRIGGER BLACK MOVE CREATION
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

    //Gain WHITE move/gamestatus info
    //safeGameMutate only updates with black moves (White moves/checkmates arent displayed)!
    //Small problem: Does update on every click, even when switching between pieces
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

    return true; // successful move
  }

  // ---TRIGGER BLACK MOVE---
  useEffect(() => {
    if (previousMove?.color === "w") {
      setFen(game.fen());
      setTimeout(makeRandomMove, 1200);
    }
  }, [previousMove]);

  // // ---CREATE A RANDOMMOVE---
  function makeRandomMove() {
    const possibleMoves = game?.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      return; // exit if the game is over
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

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
    <>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      {game && !showReplayBoard && (
        <Chessboard
          position={fen}
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
          <Chessboard position={fenHistory[currentIndex]} id={"ReplayBoard"} />
        </>
      )}
      {moveStatus.gameOver && !showReplayBoard && (
        <GameTerminal moveStatus={moveStatus} />
      )}
      {!moveStatus.gameOver && (
        <MoveInfo moveData={previousMove} moveStatus={moveStatus} />
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
            <Link href="/prelobby">
              <StyledButton type="text">Main Menu</StyledButton>
            </Link>
          </div>
          <small>Date: {new Date().toLocaleString()}</small>
        </>
      )}
    </>
  );
}

const StyledButton = styled.button`
  text-align: center;
  font-size: large;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
`;
