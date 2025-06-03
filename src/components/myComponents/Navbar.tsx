"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [theme, settheme] = useState("light");
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
    toast.success("Logged out successfully");
  };

  if (status === "loading") {
    return <div className="navbar bg-base-200">Loading...</div>;
  }

  const user = session?.user;


  //applying theme to all data
  document.querySelector("body")?.setAttribute("data-theme", theme);
  // Save the theme to localStorage
  localStorage.setItem("theme", theme);

  //theme handler for complete data
  const handlethemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      settheme("dark")
    } else {
      settheme("light")
    }
  }



  return (
    <div className={`navbar fixed top-0 px-6 md:px-8 lg:px-10 border-b-[0.3px] z-999 ${theme=="light"?"border-[#1e1e1e]":"border-[#eae8e1]"} theme-${theme}`}>
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl md:text-2xl font-bold">
          Ticket AI
        </Link>
      </div>

      <div className="flex md:gap-4 gap-3 items-center justify-center">
        <div>
          <label className="swap swap-rotate h-6 w-6">
            <input
              type="checkbox"
              className="theme-controller"
              checked={theme === "dark"}
              onChange={handlethemeChange}
            />

            {/* sun icon */}
            <svg
              className="swap-off h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
        <div>
          {!user ? (
          <>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {user.role === "admin" && (
              <Link href="/admin" className="btn btn-sm btn-admin">
                Admin
              </Link>
            )}
            <button onClick={logout} className="btn btn-sm bg-[#904E4E] text-[#eae8e1]">
              Logout
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
