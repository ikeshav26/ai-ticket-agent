"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Option 1: Use NextAuth credentials provider
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.ok) {
        router.push("/");
        toast.success("Login successful! Redirecting to dashboard...");
      } else {
        toast.error(res?.error || "Login failed. Please try again.");
      }

      // Option 2: If your backend is not tied to NextAuth yet:
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, form);
      // // you could manually sign in here or set cookies if needed
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signupMain h-screen w-full pt-20 `}>
      <div className="flex flex-col gap-6  justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-cover h-[36vh] w-[80vw] lg:w-[60vw] rounded-xl overflow-hidden flex items-center justify-center">
            <img src="/ticket1.png" alt="Ticket" className="w-full h-full no-repeat bg-cover" />
          </div>
          <p className="text-xl mt-2 font-semibold uppercase">Welcome back !!</p>
        </div>
        <div className=" flex flex-col gap-2 md:gap-4 lg:gap-6 items-center justify-center">
          <form onSubmit={handleLogin}>
            <div>
              <p>Username</p>
              <fieldset className="fieldset">
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="input w-60 md:w-80 lg:w-100 rounded-full focus:outline-none" placeholder="Enter Your Email" />
              </fieldset>
            </div>

            <div>
              <p>Password</p>
              <fieldset className="fieldset">
                <input type="password" name="password" value={form.password} onChange={handleChange} required className="input w-60 md:w-80 lg:w-100 rounded-full focus:outline-none" placeholder="Enter Your Password" />
              </fieldset>
            </div>

            <div>
              <button type="submit" disabled={loading} className="bttn w-60 md:w-80 lg:w-100 rounded-full py-2 px-1 mt-3 md:mt-2 cursor-pointer">{loading ?"Logging in..":"Login"}</button>
            </div>
          </form>
        </div>
        <div>
          <p className="text-sm text-gray-500">Doesn't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Signup</Link></p>
        </div>
      </div>
    </div>
  );
}
