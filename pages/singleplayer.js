import PlayerVsRandomMove from "@/components/Boards/PlayerVsRandomMove";
import BoardWrapper from "@/components/BoardWrapper";

export default function SinglePlayerPage({ username }) {
  return (
    <BoardWrapper>
      <PlayerVsRandomMove username={username} />
    </BoardWrapper>
  );
}
