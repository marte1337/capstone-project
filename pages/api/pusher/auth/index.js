import { pusher } from "../../../../lib/pusher";

export default async function handler(req, res) {
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const { socket_id, channel_name, username } = req.body;

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
    //check...
    res.send(auth);
  } catch (error) {
    console.error(error);
  }
}
