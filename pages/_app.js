import GlobalStyle from "../styles";
import { useState } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [username, setUsername] = useState("");

  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    router.push("/lobby");
  };

  return (
    <>
      <GlobalStyle />
      <Component
        handleLoginChange={(event) => setUsername(event.target.value)}
        username={username}
        handleLogin={handleLogin}
        {...pageProps}
      />
    </>
  );
}
