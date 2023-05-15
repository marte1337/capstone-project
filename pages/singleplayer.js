import PlayerVsRandomMove from "@/components/Boards/PlayerVsRandomMove";
import BoardWrapper from "@/components/BoardWrapper";

export default function SinglePlayerPage() {
  return (
    <BoardWrapper>
      <PlayerVsRandomMove />
    </BoardWrapper>
  );
}
