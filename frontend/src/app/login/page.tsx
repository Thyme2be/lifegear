"use client";
import { useState } from "react";
import axios from "axios";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    console.log("Form data being sent:", formData);

    try {
      const res = await axios.post("http://localhost:8000/login", formData);
      console.log("Response from backend:", res.data);
      alert("Login successful");
    } catch (error) {
      console.error("ERROR WHILE LOGIN", error);
    }
  }

  return (
    <main className=" text-3xl flex justify-center items-center h-screen ">
      <form
        onSubmit={handleLogin}
        className=" flex flex-col gap-5 w-fit h-fit p-10 border "
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" border "
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" border "
        />
        <button type="submit" className=" cursor-pointer bg-blue-600 ">
          Login
        </button>
      </form>
    </main>
  );
};

export default Page;
