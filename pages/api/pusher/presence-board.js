import { pusher } from "../../../lib/index";

// presence channel handler
export default async function handler(request, response) {
  const { message, username, chessmove, slug } = request.body;

  // trigger a new post event via pusher
  await pusher.trigger(`presence-board-${slug}`, `chess-update-${slug}`, {
    chessmove,
    message,
    username,
    slug,
  });

  response.json({ status: 200 });
}
