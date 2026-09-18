import { pusher } from "../../../lib/index";

// presence channel handler
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { message, username, chessmove, slug } = request.body;
  const hasMessage = typeof message === "string";
  const hasChessMove = chessmove === null || typeof chessmove === "string";
  if (
    !hasMessage ||
    !hasChessMove ||
    typeof username !== "string" ||
    typeof slug !== "string"
  ) {
    return response.status(400).json({ error: "Invalid board payload" });
  }

  try {
    // trigger a new post event via pusher
    await pusher.trigger(`presence-board-${slug}`, `chess-update-${slug}`, {
      chessmove,
      message,
      username,
      slug,
    });

    return response.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Unable to publish board update", error);
    return response.status(502).json({ error: "Unable to publish update" });
  }
}
