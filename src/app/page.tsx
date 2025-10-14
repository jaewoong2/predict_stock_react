import { redirect } from "next/navigation";

export default function Home() {
  // Server-side only redirect using headers()
  const today = getTodayDate();
  redirect(`/ox/dashboard?date=${today}`);
}

// Server-side date generation to avoid hydration mismatch
function getTodayDate() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}
