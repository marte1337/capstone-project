import { pusher } from "../../../../lib/index";

export default async function handler(request, response) {
  const { socket_id, channel_name, username } = request.body;

  // use JWTs / UID here to authenticate users before continuing
  const randomString = Math.random().toString(36).slice(2);

  const presenceData = {
    user_id: randomString,
    user_info: {
      username: "@" + username,
    },
  };

  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    response.send(auth);
  } catch (error) {
    console.error(error);
  }
}
