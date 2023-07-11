import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import axios from "axios";
import Link from "next/link";
import HeaderSmall from "@/components/HeaderSmall";
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

      <StyledNameContainer>
        <StyledPlayerNameSmall>{username}</StyledPlayerNameSmall>
        <StyledButton onClick={handleSignOut}>Sign out</StyledButton>
      </StyledNameContainer>
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

const StyledNameContainer = styled.div`
  max-width: 600px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: auto;
`;

const StyledPlayerNameSmall = styled.span`
  font-size: larger;
  font-weight: bold;
  text-shadow: 1px 1px 20px rgba(250, 254, 255, 1);
`;

const StyledButton = styled.button`
  text-align: center;
  font-weight: bolder;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin: 0.2rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

const StyledChat = styled.section`
  width: 95%;
  max-width: 400px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 10px 1rem;
  margin: 10px auto;
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
  padding: 5px 10px;
  margin-bottom: 10px;
  overflow: auto;
`;

const StyledMessage = styled.div`
  text-align: left;
  background-color: white;
  overflow-wrap: break-word;
  color: black;
  border-radius: 5px;
  margin: 5px auto 5px 7rem;
  padding: 4px;
`;
const StyledMessageUser = styled.div`
  text-align: left;
  background-color: #8f43ee;
  overflow-wrap: break-word;
  color: white;
  border-radius: 5px;
  margin: 5px 7rem 5px auto;
  padding: 4px;
`;

const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.1rem;
`;
