import SignOutButton from "@/ui/component/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>DashboardPage</h1>

      {session ? (
        <div className={"mt-10"}>
          <div>{session?.user?.name}</div>
          <div>{session?.user?.email}</div>
          <img src={session?.user?.image || ""} width={50} height={50} alt={session?.user?.name || ""} className={"rounded-full"} />
          {/*<div>{session?.user?.exp}</div>*/}
          {/*<div>{session?.user?.id}</div>*/}
        </div>
      ) : (
        <p>Not Logged In</p>
      )}

      <SignOutButton />
    </div>
  );
}
