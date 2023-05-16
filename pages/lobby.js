import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";

export default function Lobby({ username }) {
  const router = useRouter();
  //   const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
  const pusher = new Pusher("2fd14399437ec77964ee", {
    cluster: "eu",
    // use jwts in prod
    authEndpoint: `api/pusher/auth`,
    auth: { params: { username } },
  });

  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  useEffect(() => {
    const channel = pusher.subscribe("presence-channel");

    // when a new member successfully subscribes to the channel
    channel.bind("pusher:subscription_succeeded", (members) => {
      // subscribed members count
      setOnlineUsersCount(members.count);
    });

    // when a new member joins the chat
    channel.bind("pusher:member_added", (member) => {
      // console.log("count",channel.members.count)
      setOnlineUsersCount(channel.members.count);
      setOnlineUsers((prevState) => [
        ...prevState,
        { username: member.info.username },
      ]);
    });

    // when a member leaves the chat
    channel.bind("pusher:member_removed", (member) => {
      setOnlineUsersCount(channel.members.count);
      setUsersRemoved((prevState) => [...prevState, member.info.username]);
    });

    // updates chats
    channel.bind("chat-update", function (data) {
      const { username, message } = data;
      setChats((prevState) => [...prevState, { username, message }]);
    });

    // when closing channel, unsubscribe user
    return () => {
      pusher.unsubscribe("presence-channel");
    };
  }, []);

  const handleSignOut = () => {
    pusher.unsubscribe("presence-channel");
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await axios.post("/api/pusher/chat-update", {
    await axios.post("/api/pusher", {
      message: messageToSend,
      username,
    });
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

        <h2>Notifications</h2>
        <div>
          {/* show online users */}
          {onlineUsers.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user.username}</span> just joined the chat
              </small>
            </div>
          ))}

          {/* show users leaving the chat */}
          {usersRemoved.map((user, id) => (
            <small key={id}>
              {" "}
              <span>{user}</span> just left the chat!
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
              onChange={(e) => setMessageToSend(e.target.value)}
              //   handleSubmit={(e) => {
              //     handleSubmit(e);
              //   }}
              placeholder="start typing...."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}
