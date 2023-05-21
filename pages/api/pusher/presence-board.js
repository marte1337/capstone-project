import { pusher } from "../../../lib/index";

// presence channel handler
export default async function handler(request, response) {
  const { message, username, chessmove, history } = request.body;

  // trigger a new post event via pusher
  await pusher.trigger("presence-board", "chess-update", {
    chessmove,
    history,
    message,
    username,
  });

  response.json({ status: 200 });
}
