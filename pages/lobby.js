import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";

import Link from "next/link";

//prevents undefined
let pusher = null;

export default function Lobby({ username }) {
  const router = useRouter();

  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  // Derived from: https://pusher.com/docs/channels/getting_started/javascript-realtime-user-list/

  useEffect(() => {
    // pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
    pusher = new Pusher("2fd14399437ec77964ee", {
      cluster: "eu",
      authEndpoint: `api/pusher/auth`,
      auth: { params: { username } },
    });

    // Subscribe to "presence-channel" (relying on user authorization)
    const channel = pusher.subscribe("presence-channel");

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
    channel.bind("chat-update", (data) => {
      const { username, message } = data;
      setChats((prevState) => [...prevState, { username, message }]);
    });

    // when closing channel: unsubscribe user
    return () => pusher.unsubscribe("presence-channel");
  }, [username]);

  const handleSignOut = () => {
    pusher?.unsubscribe("presence-channel");
    router.push("/");
  };

  // post chat to api
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/api/pusher", {
      message: messageToSend,
      username,
    });
    setMessageToSend("");
  };

  return (
    <>
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
          {/* show online users */}
          {onlineUsers.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user.username}</span> joined the chat!
              </small>
            </div>
          ))}

          {/* show users leaving the chat */}
          {usersRemoved.map((user, id) => (
            <small key={id}>
              {" "}
              <span>{user}</span> left the chat.
            </small>
          ))}
        </div>

        <div>
          {chats.map((chat, id) => (
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
      <Link href="/multiplayer">
        <button type="text">Go to Chess-Board</button>
      </Link>
    </>
  );
}
