import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";
import Link from "next/link";
import HeaderSmall from "@/components/HeaderSmall";
import {
  StyledPlayerNameSmall,
  StyledPlayerNameSmallContainer,
} from "@/components/styles/PlayerNameStyles";
import {
  StyledChat,
  StyledChatCanvas,
  StyledMessage,
  StyledMessageUser,
  StyledInput,
} from "@/components/styles/ChatLobbyStyles";
import { StyledLobbyButton } from "@/components/styles/ButtonStyles";

//prevents undefined
let pusher = null;

export default function Lobby({ username }) {
  const router = useRouter();

  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  useEffect(() => {
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
    router.push("/mainmenu");
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

  const handleJoinPlayer = (event) => {
    event.preventDefault();
    const hostName = event.target.elements[0].value;

    router.push(`/multiplayer/${hostName}`);
  };

  const chatCanvasRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat canvas when new messages are added
    chatCanvasRef.current.scrollTop = chatCanvasRef.current.scrollHeight;
  }, [chats]);

  return (
    <>
      <HeaderSmall />
      <StyledPlayerNameSmallContainer>
        <StyledPlayerNameSmall>{username}</StyledPlayerNameSmall>
        <StyledLobbyButton onClick={handleSignOut}>Sign out</StyledLobbyButton>
      </StyledPlayerNameSmallContainer>
      <StyledChat>
        <h2>GAMELOBBY</h2>
        <div>
          <h4> {onlineUsersCount} user(s) online now</h4>
        </div>
        <StyledChatCanvas ref={chatCanvasRef}>
          {onlineUsers.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user.username}</span> joined the chat!
              </small>
            </div>
          ))}
          {usersRemoved.map((user, id) => (
            <div key={id}>
              <small>
                {" "}
                <span>{user}</span> left the chat.
              </small>
            </div>
          ))}
          {chats.map((chat, id) =>
            chat.username === username ? (
              <StyledMessageUser key={id}>
                <small>{chat.username}:</small> {chat.message}
              </StyledMessageUser>
            ) : (
              <StyledMessage key={id}>
                <small>{chat.username}:</small> {chat.message}
              </StyledMessage>
            )
          )}
        </StyledChatCanvas>
        <div>
          <form onSubmit={handleSubmit} aria-label="Chat Submit Form">
            <StyledInput
              type="text"
              value={messageToSend}
              onChange={(event) => setMessageToSend(event.target.value)}
              placeholder="start typing...."
              aria-label="Chat Input"
            />
            <StyledLobbyButton type="submit">Send</StyledLobbyButton>
          </form>
        </div>
      </StyledChat>
      <div>
        PLAYER ONE: <br />
        <Link href={`/multiplayer/${username}`}>
          <StyledLobbyButton type="text">Create Game</StyledLobbyButton>
        </Link>
        <br />
        PLAYER TWO: <br />
        <form onSubmit={handleJoinPlayer} aria-label="Join PLayer Form">
          <StyledInput type="text" placeholder="Player you want to join..." />
          <StyledLobbyButton type="submit">Join Player</StyledLobbyButton>
        </form>
      </div>
    </>
  );
}
