import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

  // This code below will not be reached
  return null;
}