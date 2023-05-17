import { pusher } from "../../../lib/index";

// presence channel handler
export default async function handler(request, response) {
  const { message, username } = request.body;

  // trigger a new post event via pusher
  await pusher.trigger("presence-board", "chess-update", {
    message,
    username,
  });

  response.json({ status: 200 });
}
