import { pusher } from "../../../../lib/index";

// ---Authorization Endpoint---
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { socket_id, channel_name, username } = request.body;
  if (
    typeof socket_id !== "string" ||
    typeof channel_name !== "string" ||
    typeof username !== "string"
  ) {
    return response.status(400).json({ error: "Invalid authentication payload" });
  }

  // use JWTs / UID in production
  const randomString = Math.random().toString(36).slice(2);

  const presenceData = {
    user_id: randomString,
    user_info: {
      username: username,
    },
  };

  try {
    const auth = pusher.authorizeChannel(
      socket_id,
      channel_name,
      presenceData
    );
    return response.status(200).send(auth);
  } catch (error) {
    console.error("Unable to authorize Pusher channel", error);
    return response.status(500).json({ error: "Unable to authorize channel" });
  }
}
