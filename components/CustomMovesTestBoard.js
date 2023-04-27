import { Chessboard } from "react-chessboard";
import Chess from "chess.js";

// Create a new chess game instance
const game = new Chess();

// Set up the starting position
game.reset();

// Override the knight's move function in the game object
game.moveKnight = function (square) {
  const moves = [
    { file: 1, rank: 2 },
    { file: 2, rank: 1 },
    { file: -1, rank: 2 },
    { file: -2, rank: 1 },
    { file: 1, rank: -2 },
    { file: 2, rank: -1 },
    { file: -1, rank: -2 },
    { file: -2, rank: -1 },
  ];
  const pos = Chess.SQUARES[square];
  const legalMoves = [];
  moves.forEach((move) => {
    const dest = Chess.SQUARES[pos + move.file + 16 * move.rank];
    if (dest && !this.get(dest)) {
      legalMoves.push({ from: square, to: dest });
    }
  });
  return legalMoves;
};

// Override the knight's move function in the game object
game.moveKnight = knightMoves;

// Generate legal moves for a knight at e4 with the modified move function
const legalMoves = game.moveKnight("e4");

console.log(legalMoves);

export default function CustomMovesTestBoard() {
  return <Chessboard />;
}
