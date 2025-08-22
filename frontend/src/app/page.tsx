export default function Home() {
  return (
    <main className=" text-3xl flex justify-center items-center h-screen ">
      <section className=" flex flex-col gap-5 w-fit h-fit p-10 border ">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" className=" border " />
        <label htmlFor="passwd">Password</label>
        <input type="password" id="passwd" className=" border " />
        <button type="submit" className=" cursor-pointer bg-blue-600 ">
          Login
        </button>
      </section>
    </main>
  );
}
