import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect } from "react";
import MoveInfo from "../MoveInfo";
import PlayerNameDisplay from "../PlayerNameDisplay";
import GameTerminal from "../GameTerminal";
import styled from "styled-components";

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [fenHistory, setFenHistory] = useState([]);
  const [showReplayBoard, setShowReplayBoard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  console.log(fenHistory);

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
        <Chessboard position={fen} onPieceDrop={onDrop} id={"PlayBoard"} />
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
        <MoveInfo moveData={latestMoveHistory} moveStatus={moveStatus} />
      )}
      <PlayerNameDisplay playerName={playerName} oppenentName={oppenentName} />
      {!showReplayBoard && moveStatus.gameOver && (
        <StyledButton onClick={handleShowReplayBoard}>
          Show Game Replay?
        </StyledButton>
      )}
      {showReplayBoard && (
        <>
          <div>
            <StyledButton onClick={handlePreviousClick}>
              Previous Move
            </StyledButton>
            <StyledButton onClick={handleNextClick}>Next Move</StyledButton>
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
