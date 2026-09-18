import { pusher } from "../../../lib/index";

// presence channel handler
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { message, username } = request.body;
  if (typeof message !== "string" || typeof username !== "string") {
    return response.status(400).json({ error: "Invalid message payload" });
  }

  try {
    // trigger a new post event via pusher
    await pusher.trigger("presence-channel", "chat-update", {
      message,
      username,
    });

    return response.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Unable to publish lobby message", error);
    return response.status(502).json({ error: "Unable to publish message" });
  }
}
