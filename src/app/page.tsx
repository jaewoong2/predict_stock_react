import { redirect } from "next/navigation";

function Home() {
  redirect("/dashboard");
}

export default Home;
