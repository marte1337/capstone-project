import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h2>TOTALLY UNHINGED CHESS</h2>
      <h2>TOTALLY UNHINGED CHESS</h2>
      <h2>TOTALLY UNHINGED CHESS</h2>
      <div>
        <Link href="/mainboard">
          <button type="text">Go to Mainboard</button>
        </Link>
      </div>
    </>
  );
}
