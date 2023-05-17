import PlayerVsPlayer from "@/components/Boards/PlayerVsPlayer";
import BoardWrapper from "@/components/BoardWrapper";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";

//prevents undefined
let pusher = null;

export default function MultiPlayerPage({ username }) {
  // // :::::PUSHER:::::
  const router = useRouter();
  const [messageToReceive, setMessageToReceive] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  useEffect(() => {
    // pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
    pusher = new Pusher("2fd14399437ec77964ee", {
      cluster: "eu",
      authEndpoint: `api/pusher/auth`,
      auth: { params: { username } },
    });

    // Subscribe to "presence-channel" (relying on user authorization)
    const channel = pusher.subscribe("presence-board");

    // count: when a new member successfully subscribes to the channel
    channel.bind("pusher:subscription_succeeded", (members) => {
      setOnlineUsersCount(members.count);
    });

    // count: when a new member joins the chat
    channel.bind("pusher:member_added", (member) => {
      setOnlineUsersCount(channel.members.count);
      setOnlineUsers((prevState) => [
        ...prevState,
        { username: member.info.username },
      ]);
    });

    // update count: when a member leaves the chat
    channel.bind("pusher:member_removed", (member) => {
      setOnlineUsersCount(channel.members.count);
      setUsersRemoved((prevState) => [...prevState, member.info.username]);
    });

    // ---PERFORM CHAT---
    channel.bind("chess-update", (data) => {
      const { username, message } = data;
      setMessageToReceive((prevState) => [...prevState, { username, message }]);
      // makeAMove(messageToReceive.message);
    });

    // when closing channel: unsubscribe user
    return () => pusher.unsubscribe("presence-board");
  }, [username]);

  const handleSignOut = () => {
    pusher?.unsubscribe("presence-board");
    router.push("/");
  };

  // post chat to api
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/api/pusher/presence-board", {
      message: messageToSend,
      username,
    });
    setMessageToSend("");
  };
  // // :::::PUSHER:::::

  return (
    <BoardWrapper>
      {/* <PlayerVsPlayer username={username} /> */}
      <div>
        <p>
          Hello, <span>{username}</span>
        </p>
        <div>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
        <div>{onlineUsersCount} user(s) online now</div>

        <h2>Chat</h2>
        <div>
          {onlineUsers.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user.username}</span> joined the chat!
              </small>
            </div>
          ))}

          {usersRemoved.map((user, id) => (
            <small key={id}>
              {" "}
              <span>{user}</span> left the chat.
            </small>
          ))}
        </div>

        <div>
          {messageToReceive.map((chat, id) => (
            <div key={id}>
              <p>{chat.message}</p>
              <small>{chat.username}</small>
            </div>
          ))}
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={messageToSend}
              onChange={(event) => setMessageToSend(event.target.value)}
              placeholder="start typing...."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </BoardWrapper>
  );
}
