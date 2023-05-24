import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";

import Link from "next/link";
import styled from "styled-components";

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
    router.push("/prelobby");
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

  return (
    <>
      <StyledTitle>
        TOTALLY <i>ZOMBIFIED</i> CHAT
      </StyledTitle>
      <StyledNameContainer>
        <StyledPlayerNameSmall>{username}</StyledPlayerNameSmall>
        <StyledButton onClick={handleSignOut}>Sign out</StyledButton>
      </StyledNameContainer>
      <StyledChat>
        <h2>GAMELOBBY</h2>
        <div>
          <h4> {onlineUsersCount} user(s) online now</h4>
        </div>

        <StyledChatCanvas>
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
            <div key={id}>
              <small>
                {" "}
                <span>{user}</span> left the chat.
              </small>
            </div>
          ))}

          {chats.map((chat, id) => (
            <StyledMessage key={id}>
              <small>{chat.username}:</small> {chat.message}
            </StyledMessage>
          ))}
        </StyledChatCanvas>

        <div>
          <form onSubmit={handleSubmit}>
            <StyledInput
              type="text"
              value={messageToSend}
              onChange={(event) => setMessageToSend(event.target.value)}
              placeholder="start typing...."
            />
            <StyledButton type="submit">Send</StyledButton>
          </form>
        </div>
      </StyledChat>

      <div>
        PLAYER ONE: <br />
        <Link href={`/multiplayer/${username}`}>
          <StyledButton type="text">Create Game</StyledButton>
        </Link>
        <br />
        PLAYER TWO: <br />
        <form onSubmit={handleJoinPlayer} aria-label="Join PLayer Form">
          <StyledInput type="text" placeholder="Player you want to join..." />
          <StyledButton type="submit">Join Player</StyledButton>
        </form>
      </div>
    </>
  );
}

const StyledTitle = styled.h2`
  margin-top: 0;
  padding-top: 15px;
`;

const StyledNameContainer = styled.div`
  max-width: 600px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledPlayerNameSmall = styled.span`
  font-size: larger;
  font-style: bold;
  text-shadow: 1px 1px 20px rgba(250, 254, 255, 1);
`;

const StyledButton = styled.button`
  text-align: center;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin: 0.2rem;
  padding: 0.5rem 1rem;
`;

const StyledChat = styled.section`
  max-width: 600px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 10px 1rem;
  margin: 10px;
  h2 {
    margin: 0;
    font-weight: 900;
    font-size: x-large;
    letter-spacing: 5px;
  }
  h4 {
    font-weight: 600;
    margin: 0.6rem;
  }
`;

const StyledChatCanvas = styled.div`
  height: 270px;
  background-color: #2c2c2c;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
  overflow: auto;
`;

const StyledMessage = styled.div`
  background-color: white;
  overflow-wrap: break-word;
  color: black;
  border-radius: 5px;
  margin: 5px 3rem;
  padding: 2px 0;
`;

const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.1rem;
`;
