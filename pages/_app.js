import GlobalStyle from "../styles";
import { useRouter } from "next/router";
import useLocalStorageState from "use-local-storage-state";

export default function App({ Component, pageProps }) {
  const [username, setUsername] = useLocalStorageState("username");

  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    router.push("/prelobby");
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
