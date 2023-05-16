import { pusher } from "../../../lib/pusher";

// presence channel handler
export default async function handler(req, res) {
  const { message, username } = req.body;

  // trigger a new post event via pusher
  await pusher.trigger("presence-channel", "chat-update", {
    message,
    username,
  });

  res.json({ status: 200 });
}

// import { pusher } from "../../../lib/pusher";

// // public channel handler
// export default async function handler(req, res) {
//   const { message, sender } = req.body;
//   await pusher.trigger("chat", "chat-event", {
//     message,
//     sender,
//   });

//   res.json({ message: "completed" });
// }
