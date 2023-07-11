// import Link from "next/link";
import HeaderLarge from "@/components/HeaderLarge";
import PlayerNameInput from "@/components/PlayerNameInput";
import { StyledImage } from "@/components/styles/ImageStyles";

export default function LoginPage({ handleLogin, handleLoginChange }) {
  return (
    <>
      <HeaderLarge />
      <StyledImage
        src="/landing-image2.jpg"
        alt="zombies on a chessboard"
        width={300}
        height={300}
      />
      <PlayerNameInput
        handleLogin={handleLogin}
        handleLoginChange={handleLoginChange}
      />
    </>
  );
}
