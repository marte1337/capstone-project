import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import { useState, useEffect, use } from "react";
import styled from "styled-components";
import MoveInfo from "../MoveInfo";
import GameTerminal from "../GameTerminal";

const tutorialFens = [
  {
    fen: "8/2rkr3/2rrr3/8/8/3RRR2/3RKR2/8 w KQkq - 0 1",
    text: "In this ZOMBIFIED CHESS tutorial you will get used to the zombie-mechanics. It´s pretty simple though: If you capture an opponent piece, it will respawn as your piece on the square it has been attacked from. Try to zombify some of your enemies and checkmate their king...",
  },
  {
    fen: "3k4/pppppppp/8/8/8/8/PPPPPPPP/4K3 w KQkq - 0 1",
    text: "You can get pretty interesting pawn-stand-offs in ZOMBIFIED CHESS, see for yourself! Be aware that, while you can capture & promote with a pawn, you can not respawn and promote. Respawned pawns on their final rank are doomed to stay on their square forever...true dead undead zombies!",
  },
  {
    fen: "8/2nkn3/2nnn3/8/8/3NNN2/3NKN2/8 w KQkq - 0 1",
    text: "We all appreceate a good ol´ knights-only-chackmate as an artform in itself, but how about knights-only ZOMBIEARMYSTYLE?",
  },
  {
    fen: "3k4/nnnnnnnn/bbbbbbbb/8/8/BBBBBBBB/NNNNNNNN/4K3 w KQkq - 0 1",
    text: "Well...whatever, you know what to do.",
  },
];

export default function RandomMoveEngine() {
  const [game, setGame] = useState(null);
  const [moveStatus, setMoveStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [fenHistory, setFenHistory] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fen, setFen] = useState(tutorialFens[currentIndex].fen);

  const latestMoveHistory = moveHistory[moveHistory.length - 1];

  // // ---CREATE GAME OBJECT---
  useEffect(() => {
    setGame(new Chess(fen));
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

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorialFens.length);
  };

  useEffect(() => {
    const newGameFen = tutorialFens[currentIndex].fen;
    const newGame = new Chess(newGameFen);
    setGame(newGame);
    setFen(newGame.fen());
    setMoveStatus({});
    setMoveHistory([]);
  }, [currentIndex]);

  return (
    <>
      <h2>
        TOTALLY <i>ZOMBIFIED</i> CHESS
      </h2>
      <h3>TUTORIALS</h3>
      {game && <Chessboard position={fen} onPieceDrop={onDrop} />}
      {moveStatus.gameOver && <GameTerminal moveStatus={moveStatus} />}
      {latestMoveHistory ? (
        <MoveInfo moveData={latestMoveHistory} moveStatus={moveStatus} />
      ) : (
        <p>Make a move.</p>
      )}

      {moveStatus.gameOver ? (
        <p>Well done...</p>
      ) : (
        <div>{tutorialFens[currentIndex].text}</div>
      )}

      <div>
        <StyledButton onClick={handleNextClick}>
          Play Next Tutorial
        </StyledButton>
      </div>
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
  padding: 0.5rem 1rem;
`;
