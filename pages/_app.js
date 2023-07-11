import GlobalStyle from "../styles";
import { useRouter } from "next/router";
import useLocalStorageState from "use-local-storage-state";

export default function App({ Component, pageProps }) {
  const [username, setUsername] = useLocalStorageState("username");
  const router = useRouter();

  const handleChange = (event) => {
    const { value } = event.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setUsername(filteredValue);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    router.push("/mainmenu");
  };

  return (
    <>
      <GlobalStyle />
      <Component
        handleLoginChange={handleChange}
        username={username}
        handleLogin={handleLogin}
        {...pageProps}
      />
    </>
  );
}
