import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>TOTALLY UNHINGED CHESS</h1>
      <div>
        <Link href="/mainboard">
          <button type="text">Go to Mainboard</button>
        </Link>
      </div>
    </>
  );
}
