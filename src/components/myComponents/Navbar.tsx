"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  if (status === "loading") {
    return <div className="navbar bg-base-200">Loading...</div>;
  }

  const user = session?.user;

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Ticket AI
        </Link>
      </div>

      <div className="flex gap-2">
        {!user ? (
          <>
            <Link href="/signup" className="btn btn-sm">
              Signup
            </Link>
            <Link href="/signin" className="btn btn-sm">
              Signin
            </Link>
          </>
        ) : (
          <>
            <p>Hi, {user.email}</p>
            {user.role === "admin" && (
              <Link href="/admin" className="btn btn-sm">
                Admin
              </Link>
            )}
            <button onClick={logout} className="btn btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
